// app/api/invite/request-bulk/route.ts
export const runtime = 'nodejs'

import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { render } from '@react-email/render'
import { nanoid } from 'nanoid'
import { connectDB } from '@/lib/mongoose'
import Invitation from '@/models/Invitado'
import InviteMagicLinkEmail from '@/lib/emails'
import { signGuestToken, buildAccessLink } from '@/lib/jwt'

const resend = new Resend(process.env.RESEND_API_KEY)
const APP_URL = (process.env.APP_URL || 'http://localhost:3000').replace(/\/+$/, '')
const EMAIL_FROM = process.env.EMAIL_FROM || 'Romina & Sebas <contact@romyseb.ch>'

type GroupInput = {
  contactName: string
  contactEmail: string
  contactPhone?: string
  preferredLanguage?: 'es' | 'fr' | 'en' | 'de' | 'it'
  notes?: string
}
type GuestInput = {
  role?: 'primary' | 'companion'
  firstName: string
  lastName: string
  targetEmail?: string
  originalGuestEmail?: string | null
  email?: string // compat
  age: number
  isChild?: boolean
  phone?: string
  allergies?: string
  dietary?: any
  dietaryOther?: string
  mobilityNeeds?: string
  songSuggestion?: string
}

export async function POST(req: Request) {
  try {
    await connectDB()

    const body = (await req.json()) as { group: GroupInput; guests: GuestInput[] }
    if (!body?.group || !Array.isArray(body?.guests) || body.guests.length === 0) {
      return NextResponse.json({ message: 'Payload inválido. Esperado { group, guests[] }' }, { status: 400 })
    }

    const { group, guests } = body

    // === Validación contacto
    if (!group.contactName || !group.contactEmail) {
      return NextResponse.json({ message: 'Nombre y correo del contacto principal son requeridos.' }, { status: 400 })
    }
    const reEmail = /^[^@\s]+@[^@\s]+\.[^@\s]+$/
    if (!reEmail.test(group.contactEmail)) {
      return NextResponse.json({ message: `Correo del contacto no válido: ${group.contactEmail}` }, { status: 400 })
    }

    // === Validación invitados
    for (const g of guests) {
      if (!g.firstName || !g.lastName) {
        return NextResponse.json({ message: 'Cada invitado debe tener nombre y apellidos.' }, { status: 400 })
      }
      const ageNum = Number(g.age)
      if (!Number.isFinite(ageNum) || ageNum < 0 || ageNum > 120) {
        return NextResponse.json({ message: `Edad inválida para ${g.firstName} ${g.lastName}` }, { status: 400 })
      }
      if (g.isChild && ageNum >= 18) {
        return NextResponse.json({ message: `Marcado como niño/niña con edad 18+ para ${g.firstName} ${g.lastName}` }, { status: 400 })
      }
      if (g.originalGuestEmail && !reEmail.test(g.originalGuestEmail)) {
        return NextResponse.json({ message: `Email de invitado no válido: ${g.originalGuestEmail}` }, { status: 400 })
      }
      if (g.email && !reEmail.test(g.email)) {
        return NextResponse.json({ message: `Email de invitado no válido: ${g.email}` }, { status: 400 })
      }
      if (g.targetEmail && !reEmail.test(g.targetEmail)) {
        return NextResponse.json({ message: `targetEmail no válido: ${g.targetEmail}` }, { status: 400 })
      }
    }

    // === Normalización ===
    const groupId = nanoid(12)
    const normalized = guests.map((g) => {
      const role: 'primary' | 'companion' = g.role || 'companion'
      const sendTo =
        (g.targetEmail && reEmail.test(g.targetEmail) && g.targetEmail) ||
        (g.email && reEmail.test(g.email) && g.email) ||
        group.contactEmail

      return {
        role,
        firstName: g.firstName,
        lastName: g.lastName,
        targetEmail: sendTo.toLowerCase(),
        originalGuestEmail: g.originalGuestEmail ?? (g.email || null),

        age: Number(g.age),
        isChild: !!g.isChild,
        phone: g.phone || undefined,
        allergies: g.allergies || undefined,
        dietary: g.dietary ?? 'none',
        dietaryOther: g.dietaryOther || undefined,
        mobilityNeeds: g.mobilityNeeds || undefined,
        songSuggestion: g.songSuggestion || undefined,
      }
    })
    if (!normalized.some(n => n.role === 'primary')) {
      normalized[0].role = 'primary'
    }

    // === Generar tokens & links y armar miembros ===
    const members = await Promise.all(
      normalized.map(async (n) => {
        const token = await signGuestToken({
          email: n.targetEmail,
          firstName: n.firstName,
          lastName: n.lastName,
          age: n.age,
          isChild: n.isChild,
          groupId,
          role: n.role,
        })
        const accessLink = buildAccessLink(token, APP_URL)

        return {
          firstName: n.firstName,
          lastName: n.lastName,
          targetEmail: n.targetEmail,
          originalGuestEmail: n.originalGuestEmail ? String(n.originalGuestEmail).toLowerCase() : null,
          age: n.age,
          isChild: n.isChild,
          phone: n.phone,
          allergies: n.allergies,
          dietary: n.dietary,
          dietaryOther: n.dietaryOther,
          mobilityNeeds: n.mobilityNeeds,
          songSuggestion: n.songSuggestion,
          role: n.role,
          token,
          accessLink,
          status: 'sent' as const,
          used: false,
          sentAt: new Date(),
        }
      })
    )

    // === Crear una sola invitación (padre) con todos los miembros
    const invitationDoc = await Invitation.create({
      groupId,
      contactName: group.contactName,
      contactEmail: group.contactEmail.toLowerCase(),
      contactPhone: group.contactPhone || undefined,
      preferredLanguage: group.preferredLanguage || 'es',
      notes: group.notes || '',
      members,
    })

    // === Envío de emails (no bloquea persistencia) ===
    const sendOps = members.map(async (m) => {
      try {
        const html = await render(InviteMagicLinkEmail({ firstName: m.firstName, link: m.accessLink }))
        const { error } = await resend.emails.send({
          from: EMAIL_FROM,
          to: m.targetEmail,
          subject: 'Tu enlace de acceso a la boda',
          html,
        })
        if (error) throw new Error(String(error))
        return { email: m.targetEmail, ok: true }
      } catch (e: any) {
        console.error('[request-bulk] email error →', m.targetEmail, e?.message)
        return { email: m.targetEmail, ok: false, error: e?.message || 'error' }
      }
    })
    const results = await Promise.all(sendOps)
    const anyFail = results.some(r => !r.ok)

    return NextResponse.json(
      anyFail
        ? { message: 'Algunos correos no se pudieron enviar', groupId, invitationId: invitationDoc._id, results }
        : { ok: true, groupId, invitationId: invitationDoc._id, results },
      { status: anyFail ? 207 : 200 }
    )
  } catch (err) {
    console.error(err)
    return NextResponse.json({ message: 'Error procesando la solicitud' }, { status: 500 })
  }
}

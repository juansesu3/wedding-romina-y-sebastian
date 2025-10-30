// --------------------------------------------------------
// app/api/invite/resend/route.ts — reenviar magic link
import { NextResponse, type NextRequest } from 'next/server'
import { connectDB } from '@/lib/mongoose'
import Invitation from '@/models/Invitado' // ⬅️ si tu modelo es Invitation.ts, cámbialo
import { Resend } from 'resend'
import { render } from '@react-email/render'
import InviteMagicLinkEmail from '@/lib/emails'
import { signGuestToken, buildAccessLink } from '@/lib/jwt'

export const runtime = 'nodejs'

// Tipos mínimos para evitar `any`
// Si exportas estos tipos desde tu modelo, impórtalos en vez de redefinirlos aquí.
type MemberRole = 'primary' | 'companion'
type Locale = 'es' | 'fr' | 'en' | 'de' | 'it'

interface InvitationMemberLean {
  firstName: string
  lastName: string
  targetEmail: string
  age: number
  isChild?: boolean
  role: MemberRole
  token: string
  sentAt?: Date
}

interface InvitationLean {
  groupId: string
  preferredLanguage?: Locale
  members: InvitationMemberLean[]
}

const resend = new Resend(process.env.RESEND_API_KEY)
const EMAIL_FROM = process.env.EMAIL_FROM || 'Romina & Sebas <contact@romyseb.ch>'
const APP_URL = (process.env.APP_URL || 'https://romyseb.ch').replace(/\/+$/, '')

// Helper para formatear errores sin `any`
function toErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message
  if (typeof err === 'string') return err
  try {
    return JSON.stringify(err)
  } catch {
    return 'error'
  }
}

export async function POST(req: NextRequest) {
  try {
    const { email } = (await req.json()) as { email?: string }
    if (!email) {
      return NextResponse.json({ message: 'Email requerido' }, { status: 400 })
    }

    const emailLc = email.toLowerCase()

    await connectDB()

    // Recupera solo lo necesario y en lean (POJO) con tipado
    const doc = await Invitation.findOne(
      { 'members.targetEmail': emailLc },
      { groupId: 1, preferredLanguage: 1, members: 1 }
    ).lean<InvitationLean | null>()

    if (!doc) {
      return NextResponse.json({ message: 'Invitación no encontrada para ese email' }, { status: 404 })
    }

    // Busca el miembro por email (case-insensitive al comparar)
    const member = doc.members.find((m) => m.targetEmail.toLowerCase() === emailLc)
    if (!member) {
      return NextResponse.json({ message: 'Miembro no encontrado' }, { status: 404 })
    }

    // Genera token NUEVO (rotación) y link
    const token = await signGuestToken({
      email: member.targetEmail,
      firstName: member.firstName,
      lastName: member.lastName,
      age: member.age,
      isChild: member.isChild,
      groupId: doc.groupId,
      role: member.role,
    })
    const accessLink = buildAccessLink(token, APP_URL)

    // Persiste el nuevo token en el miembro correspondiente (sin `any`)
    // Usamos updateOne con filtro posicional para no mutar objetos lean en memoria.
    await Invitation.updateOne(
      { 'members.targetEmail': emailLc },
      {
        $set: {
          'members.$.token': token,
          'members.$.sentAt': new Date(),
        },
      }
    )

    // Envía email
    const html = await render(InviteMagicLinkEmail({ firstName: member.firstName, link: accessLink }))
    const { error } = await resend.emails.send({
      from: EMAIL_FROM,
      to: member.targetEmail,
      subject: 'Tu nuevo enlace de acceso',
      html,
    })
    if (error) {
      throw new Error(toErrorMessage(error))
    }

    return NextResponse.json({ ok: true })
  } catch (err: unknown) {
    const msg = toErrorMessage(err)
    console.error('[resend]', msg)
    return NextResponse.json({ message: 'Error reenviando enlace', detail: msg }, { status: 500 })
  }
}

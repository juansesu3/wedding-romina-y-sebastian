import { NextResponse } from 'next/server'
import { getDb } from '@/lib/mongodb'
import { generateCode, hashCode } from '@/lib/invite'
import { sendInviteCodeEmail } from '@/lib/mailer'
import { randomUUID } from 'crypto'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  try {
    const body = await req.json() as {
      household: {
        street: string; city: string; postalCode: string; country: string
        phone?: string; preferredLanguage?: string; contactChannel?: string; notes?: string
      },
      guests: Array<{
        firstName: string; lastName: string; email: string; phone?: string
        allergies?: string; dietary?: string; dietaryOther?: string
        children?: boolean; mobilityNeeds?: string; songSuggestion?: string
      }>
    }

    // Validaciones básicas
    if (!body?.household || !Array.isArray(body?.guests) || body.guests.length === 0) {
      return NextResponse.json({ message: 'Datos inválidos' }, { status: 400 })
    }

    const { household, guests } = body
    if (!household.street || !household.city || !household.postalCode || !household.country) {
      return NextResponse.json({ message: 'Dirección incompleta' }, { status: 400 })
    }
    for (const g of guests) {
      if (!g.firstName || !g.lastName || !g.email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(g.email)) {
        return NextResponse.json({ message: 'Revisa nombre, apellidos y email de cada invitado' }, { status: 400 })
      }
    }

    const db = await getDb()
    const coll = db.collection('guests')

    // opcional: rate limit por email (similar a lo que ya hicimos)
    const householdId = randomUUID()
    const now = new Date()

    // genera y envía códigos a todos
    for (const g of guests) {
      const emailLc = g.email.trim().toLowerCase()
      const code = generateCode(6)
      const inviteCodeHash = await hashCode(code)

      await coll.updateOne(
        { email: emailLc },
        {
          $set: {
            email: emailLc,
            firstName: g.firstName,
            lastName: g.lastName,
            phone: g.phone || null,
            allergies: g.allergies || null,
            dietary: g.dietary || 'none',
            dietaryOther: g.dietaryOther || null,
            children: !!g.children,
            mobilityNeeds: g.mobilityNeeds || null,
            songSuggestion: g.songSuggestion || null,
            householdId,
            address: {
              street: household.street,
              city: household.city,
              postalCode: household.postalCode,
              country: household.country,
            },
            householdPhone: household.phone || null,
            preferredLanguage: household.preferredLanguage || 'es',
            contactChannel: household.contactChannel || 'email',
            notes: household.notes || null,
            inviteCodeHash,
            lastRequestAt: now,
          },
          $setOnInsert: { createdAt: now }
        },
        { upsert: true }
      )

      // Enviar email con el código
      await sendInviteCodeEmail(emailLc, `${g.firstName} ${g.lastName}`, code)
    }

    return NextResponse.json({ ok: true, householdId })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ message: 'Error interno' }, { status: 500 })
  }
}

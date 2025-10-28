// --------------------------------------------------------
// app/api/invite/resend/route.ts — reenviar magic link
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { connectDB } from '@/lib/mongoose'
import Invitation from '@/models/Invitado'
import { Resend } from 'resend'
import { render } from '@react-email/render'
import InviteMagicLinkEmail from '@/lib/emails'
import { signGuestToken, buildAccessLink } from '@/lib/jwt'


const resend = new Resend(process.env.RESEND_API_KEY)
const EMAIL_FROM = process.env.EMAIL_FROM || 'Romina & Sebas <contact@romyseb.ch>'
const APP_URL = (process.env.APP_URL || 'http://localhost:3000').replace(/\/+$/, '')


export const runtime = 'nodejs'


export async function POST(req: NextRequest) {
try {
const { email } = await req.json() as { email?: string }
if (!email) return NextResponse.json({ message: 'Email requerido' }, { status: 400 })


await connectDB()
const doc = await Invitation.findOne({ 'members.targetEmail': email.toLowerCase() }, {
groupId: 1,
preferredLanguage: 1,
members: 1,
})
if (!doc) return NextResponse.json({ message: 'Invitación no encontrada para ese email' }, { status: 404 })


// Generar un token NUEVO para ese miembro (rotación)
const member = doc.members.find((m: any) => m.targetEmail.toLowerCase() === email.toLowerCase())
if (!member) return NextResponse.json({ message: 'Miembro no encontrado' }, { status: 404 })


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


// Persistir el nuevo token en la invitación (opcional: mantener histórico)
member.token = token
member.sentAt = new Date()
await doc.save()


const html = await render(InviteMagicLinkEmail({ firstName: member.firstName, link: accessLink }))
const { error } = await resend.emails.send({ from: EMAIL_FROM, to: member.targetEmail, subject: 'Tu nuevo enlace de acceso', html })
if (error) throw new Error(String(error))


return NextResponse.json({ ok: true })
} catch (e: any) {
console.error('[resend]', e?.message)
return NextResponse.json({ message: 'Error reenviando enlace' }, { status: 500 })
}
}
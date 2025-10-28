// app/[locale]/acces/route.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { verifyGuestToken, type GuestTokenPayload } from '@/lib/jwt'
import { connectDB } from '@/lib/mongoose'
import Invitation from '@/models/Invitado'


export const runtime = 'nodejs'


export async function GET(req: NextRequest, { params }: { params: { locale: string } }) {
const url = new URL(req.url)
const token = url.searchParams.get('token') || ''
const locale = params.locale || 'es'


// If no token, send to re-send flow
if (!token) {
return NextResponse.redirect(new URL(`/${locale}/reenvio`, req.url))
}


// Verify JWT
const result = await verifyGuestToken(token)
if (!result.ok) {
const u = new URL(`/${locale}/reenvio`, req.url)
u.searchParams.set('reason', 'invalid')
return NextResponse.redirect(u)
}


// Check token exists in DB (and get language if needed)
await connectDB()
const doc = await Invitation.findOne({ 'members.token': token }, { preferredLanguage: 1 }).lean()
if (!doc) {
const u = new URL(`/${locale}/reenvio`, req.url)
u.searchParams.set('reason', 'not_found')
return NextResponse.redirect(u)
}


// Set HTTP-only cookie here (allowed in route handler)
const res = NextResponse.redirect(new URL(`/${locale}/invitation`, req.url))
res.cookies.set('guest_token', token, {
httpOnly: true,
sameSite: 'lax',
secure: req.headers.get('x-forwarded-proto') === 'https',
maxAge: 60 * 60 * 24 * 14, // 14 days
path: '/',
})
return res
}
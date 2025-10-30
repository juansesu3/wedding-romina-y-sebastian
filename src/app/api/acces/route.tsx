// app/api/acces/route.ts
import { NextResponse, type NextRequest } from 'next/server'
import { verifyGuestToken } from '@/lib/jwt'
import { connectDB } from '@/lib/mongoose'
import Invitation from '@/models/Invitado'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365

export async function GET(req: NextRequest) {
  const url = new URL(req.url)
  const token = url.searchParams.get('token') ?? ''
  const locale = url.searchParams.get('locale') ?? 'es'

  if (!token) {
    return NextResponse.json(
      { ok: false, reason: 'missing_token', redirect: `/${locale}/reenvio?reason=missing` },
      { status: 400 }
    )
  }

  const result = await verifyGuestToken(token)
  if (!result.ok) {
    return NextResponse.json(
      { ok: false, reason: 'invalid_token', redirect: `/${locale}/reenvio?reason=invalid` },
      { status: 401 }
    )
  }

  await connectDB()
  const doc = await Invitation.findOne({ 'members.token': token }, { preferredLanguage: 1 }).lean()
  if (!doc) {
    return NextResponse.json(
      { ok: false, reason: 'not_found', redirect: `/${locale}/reenvio?reason=not_found` },
      { status: 404 }
    )
  }

  const res = NextResponse.json({
    ok: true,
    redirect: `/${locale}/invitation`, // 👈 usa el slug correcto
  })

  // 🍪 Cookie por 1 año
  res.cookies.set('guest_token', token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: req.headers.get('x-forwarded-proto') === 'https',
    maxAge: ONE_YEAR_SECONDS,
    path: '/',
  })

  return res
}

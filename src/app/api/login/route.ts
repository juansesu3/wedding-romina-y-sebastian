// app/api/login/route.ts
import { connectDB } from '@/lib/mongoose'
import Invitation from '@/models/Invitado'
import jwt from 'jsonwebtoken'
import { NextRequest, NextResponse } from 'next/server'

const JWT_SECRET = process.env.JWT_SECRET!
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365

export async function POST(req: NextRequest) {
  await connectDB()

  const { token, locale: forcedLocale } = (await req.json()) || {}
  if (!token) {
    return NextResponse.json({ success: false, message: 'Token requerido' }, { status: 400 })
  }

  const updated = await Invitation.findOneAndUpdate(
    { 'members.token': token },
    {
      $set: {
        'members.$.used': true,
        'members.$.status': 'confirmed',
        'members.$.confirmedAt': new Date(),
      },
    },
    {
      new: true,
      projection: {
        groupId: 1,
        preferredLanguage: 1,
        members: { $elemMatch: { token } },
      },
    }
  ).lean()

  if (!updated || !updated.members?.[0]) {
    return NextResponse.json({ success: false, message: 'Token inválido' }, { status: 401 })
  }

  const m = updated.members[0]
  const locale = forcedLocale || updated.preferredLanguage || 'es'

  // 🔐 JWT válido por 1 año
  const authToken = jwt.sign(
    {
      invitationId: String(updated._id),
      memberId: String(m._id),
      groupId: updated.groupId,
      firstName: m.firstName,
      lastName: m.lastName,
      locale,
    },
    JWT_SECRET,
    { expiresIn: '365d' } // 👈 1 año
  )

  const res = NextResponse.json({ success: true, redirect: `/${locale}/invitation` })

  // 🍪 Cookie válida por 1 año
  res.cookies.set('guest_token', authToken, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: ONE_YEAR_SECONDS,
    path: '/',
  })

  return res
}

import { SignJWT, jwtVerify } from 'jose'

const secret = new TextEncoder().encode(process.env.JWT_SECRET)
const ALG = 'HS256'

export type GuestTokenPayload = {
  email: string
  firstName?: string
  lastName?: string
  age?: number
  isChild?: boolean
}

export async function signGuestToken(payload: GuestTokenPayload, expMinutes = 60 * 24 * 14) { // 14 días
  const now = Math.floor(Date.now() / 1000)
  return await new SignJWT(payload as any)
    .setProtectedHeader({ alg: ALG })
    .setIssuedAt()
    .setNotBefore(now)
    .setExpirationTime(`${expMinutes}m`)
    .sign(secret)
}

export async function verifyGuestToken(token: string) {
  const { payload } = await jwtVerify(token, secret, { algorithms: [ALG] })
  return payload as GuestTokenPayload
}

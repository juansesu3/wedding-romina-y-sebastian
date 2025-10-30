// lib/jwt.ts
import { SignJWT, jwtVerify, JWTPayload } from 'jose'
import { createSecretKey } from 'crypto'
import { nanoid } from 'nanoid'

// === Config ===
const ALG = 'HS256'
const ISSUER = 'romyseb.ch'          // cámbialo si quieres
const AUDIENCE = 'guest'              // “aud” esperada para enlaces de invitado
const DEFAULT_EXP_MIN = 60 * 24 * 365 // 1 año
const CLOCK_TOLERANCE_SEC = 60        // tolerancia de reloj

// Carga y valida el secreto una sola vez
const RAW_SECRET = process.env.JWT_SECRET
if (!RAW_SECRET) {
  throw new Error('Missing JWT_SECRET env var')
}
const secret = createSecretKey(Buffer.from(RAW_SECRET, 'utf-8'))

// === Tipos ===
export type GuestRole = 'primary' | 'companion'

export interface GuestTokenPayload extends JWTPayload {
  email: string                // email de entrega (sendTo)
  firstName?: string
  lastName?: string
  age?: number
  isChild?: boolean

  groupId?: string             // para relacionar al grupo
  role?: GuestRole             // primary/companion

  // jti, iss, aud, iat, nbf, exp los maneja jose/SignJWT,
  // pero los incluimos en el tipo para intellisense.
  jti?: string
  iss?: string
  aud?: string | string[]
}

// === Helpers ===
export function buildAccessLink(token: string, appUrl = process.env.APP_URL || 'https://romyseb.ch') {
  const base = String(appUrl).replace(/\/+$/, '')
  return `${base}/acces?token=${encodeURIComponent(token)}`
}

function errorMessage(err: unknown): string {
  if (err instanceof Error) return err.message
  try {
    return JSON.stringify(err)
  } catch {
    return 'Token inválido'
  }
}

// === Firma ===
export async function signGuestToken(
  payload: Omit<GuestTokenPayload, 'iss' | 'aud' | 'jti' | 'iat' | 'nbf' | 'exp'>,
  expMinutes = DEFAULT_EXP_MIN
) {
  // Validaciones mínimas
  if (!payload?.email) {
    throw new Error('signGuestToken: email requerido')
  }

  const jti = nanoid(16)
  const now = Math.floor(Date.now() / 1000)

  return await new SignJWT({
    ...payload,
    iss: ISSUER,
    aud: AUDIENCE,
    jti,
  })
    .setProtectedHeader({ alg: ALG })
    .setIssuedAt(now)
    .setNotBefore(now)
    .setExpirationTime(`${expMinutes}m`)
    .sign(secret)
}

// === Verificación ===
// Devuelve objeto “seguro”: no lanza error; te dice si es válido.
export async function verifyGuestToken(token: string): Promise<
  | { ok: true; payload: GuestTokenPayload }
  | { ok: false; error: string }
> {
  try {
    const { payload } = await jwtVerify(token, secret, {
      algorithms: [ALG],
      issuer: ISSUER,
      audience: AUDIENCE,
      clockTolerance: CLOCK_TOLERANCE_SEC,
    })

    // Chequeos extra de dominio de negocio
    if (typeof payload.email !== 'string' || !payload.email.includes('@')) {
      return { ok: false, error: 'Payload inválido: email' }
    }

    return { ok: true, payload: payload as GuestTokenPayload }
  } catch (e: unknown) {
    return { ok: false, error: errorMessage(e) }
  }
}

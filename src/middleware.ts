// --------------------------------------------------------
// middleware.ts — COMBINADO: next-intl + guardia del portal de invitados
import { NextResponse, type NextRequest } from 'next/server'
import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'


// 1) Inicializa el middleware de i18n de next-intl
const handleI18nRouting = createMiddleware(routing)


// 2) Middleware combinado
export default function middleware(req: NextRequest) {
// Aplica i18n (redirige / reescribe locales si hace falta)
const i18nResponse = handleI18nRouting(req)


// Ruta actual solicitada
const pathname = req.nextUrl.pathname


// Coincide rutas protegidas del portal
const protectedLocalized = /^\/(es|fr|en|de|it)\/(invitacion|invitation)(?:\/.*)?$/
const protectedUnlocalized = /^\/(invitacion|invitation)(?:\/.*)?$/


// Si la ruta no está localizada aún (p.ej. /invitacion), dejamos que next-intl haga su redirect
if (protectedUnlocalized.test(pathname)) {
return i18nResponse
}


if (protectedLocalized.test(pathname)) {
const locale = pathname.split('/')[1] || 'es'
const token = req.cookies.get('guest_token')?.value
if (!token) {
const url = req.nextUrl.clone()
url.pathname = `/${locale}/acces`
url.search = ''
return NextResponse.redirect(url)
}
}


// Para el resto de rutas, devolvemos la respuesta de next-intl
return i18nResponse
}


// 3) Matcher recomendado por next-intl (omite estáticos y rutas internas)
export const config = {
matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
}
// middleware.ts
import createMiddleware from 'next-intl/middleware'
import {routing} from './i18n/routing'

// ✅ Solo i18n (locales y defaultLocale) — sin auth, sin redirects custom
export default createMiddleware(routing)

// ✅ Matcher recomendado por next-intl (omite archivos estáticos y rutas internas)
export const config = {
  matcher: [
    '/((?!api|_next|_vercel|.*\\..*).*)',
  ],
}

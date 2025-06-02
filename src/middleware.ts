import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";

const supportedLocales = ["es", "fr"];
const defaultLocale = "fr";

// Middleware de internacionalización
const intlMiddleware = createMiddleware(routing);

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Archivos estáticos permitidos sin restricción
  const staticFiles = [
    "/favicon.ico",
    "/_next",
    "/static",
    "/fonts",
    "/images",
    "/messages",
    "/placeholder.png",
  ];
  if (staticFiles.some((path) => pathname.startsWith(path))) {
    return NextResponse.next();
  }

  // Obtener locale de la URL
  function getLocale(pathname: string) {
    const firstSegment = pathname.split("/")[1];
    return supportedLocales.includes(firstSegment) ? firstSegment : defaultLocale;
  }

  const locale = getLocale(pathname);
  const token = req.cookies.get("user_token")?.value;

  const isLoginPage = pathname === `/${locale}/login`;

  // 🔒 Solo proteger la ruta raíz de cada locale
  const isProtectedRoot = pathname === `/${locale}` || pathname === `/${locale}/`;

  if (isProtectedRoot && !token && !isLoginPage) {
    const url = req.nextUrl.clone();
    url.pathname = `/${locale}/login`;
    return NextResponse.redirect(url);
  }

  // Continuar con middleware de next-intl
  return intlMiddleware(req);
}

export const config = {
  matcher: [
    "/", // redirige la raíz a /[locale]
    "/:locale(es|fr)", // protege /es o /fr
    "/:locale(es|fr)/", // protege /es/ o /fr/
    "/:locale(es|fr)/:path*", // todas las subrutas (solo usadas para intl)
  ],
};

import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";

const supportedLocales = [ "es", "fr"];
const defaultLocale = "fr";



// Definir las rutas privadas que requieren autenticación
const privateRoutes = ["/order"];

const intlMiddleware = createMiddleware(routing);

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Redirigir desde la raíz '/' al locale predeterminado
  if (pathname === "/") {
    return NextResponse.redirect(new URL(`/${defaultLocale}/`, req.url));
  }

  // Permitir el acceso a recursos estáticos y rutas internas de Next.js (_next)
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
  const token = req.cookies.get("user_token");

  // Function to get the locale from the pathname
  function getLocale(pathname: string) {
    const firstSegment = pathname.split("/")[1];
    if (supportedLocales.includes(firstSegment)) {
      return firstSegment;
    }
    return defaultLocale;
  }

  // Get the locale safely
  const locale = getLocale(pathname);

  // Check if the current route is public (no authentication required)
 

  // Check if the current route is private (requires authentication)
  const isPrivateRoute =
    privateRoutes.some(
      (route) =>
        pathname.startsWith(route) ||
        pathname.startsWith(`/${locale}${route}`) ||
        pathname.startsWith(`/${locale}/${route}`)
    ) || /^\/(es|fr)\/(order|profile)/.test(pathname);

  if (isPrivateRoute && !token) {
    // Redirect unauthenticated users trying to access private routes to the login page
    return NextResponse.redirect(new URL(`/${locale}/login`, req.url));
  }

  // Proceed with the request
  return intlMiddleware(req);
}

export const config = {
  matcher: [
    "/", // Redirigir la raíz
    "/:locale(es|fr)", // Locales principales
    "/:locale(es|fr)/", // Específicamente para /shop
    "/:locale(es|fr)/:path*", // Todas las subrutas
    "/(es|fr)/:path*",
  ],
};
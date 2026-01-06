import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const userId = request.cookies.get("user_id")?.value;
  const { pathname } = request.nextUrl;

  // Rotas públicas
  const publicRoutes = ["/login", "/registro"];
  const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));

  // Se não está autenticado e tenta acessar rota protegida
  if (!userId && !isPublicRoute) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Se está autenticado e tenta acessar login/registro, redireciona para home
  if (userId && isPublicRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};

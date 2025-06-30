import { type NextRequest, NextResponse } from "next/server"

export function middleware(request: NextRequest) {
  // Log da requisição para debug
  if (process.env.NODE_ENV === "production") {
    console.log(`[S4FT] ${request.method} ${request.nextUrl.pathname} - ${new Date().toISOString()}`)
  } else {
    console.log(`${request.method} ${request.url}`)
  }

  // Criar resposta
  const response = NextResponse.next()

  // Headers de segurança
  response.headers.set("X-Frame-Options", "DENY")
  response.headers.set("X-Content-Type-Options", "nosniff")
  response.headers.set("Referrer-Policy", "origin-when-cross-origin")
  response.headers.set("X-XSS-Protection", "1; mode=block")

  // Headers específicos do S4FT Framework
  response.headers.set("X-S4FT-Framework", "v1.0.1")
  response.headers.set("X-Powered-By", "S4FT Framework")
  response.headers.set("X-Made-In", "Brazil 🇧🇷")

  // CORS para desenvolvimento e S4FT API
  if (process.env.NODE_ENV === "development" || request.nextUrl.pathname.startsWith("/s4ft-api/")) {
    response.headers.set("Access-Control-Allow-Origin", "*")
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization")
  }
  if (request.nextUrl.pathname.startsWith("/s4ft-api/")) {
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-S4FT-Token")
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
    "/s4ft-api/:path*",
  ],
}

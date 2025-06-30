import { type NextRequest, NextResponse } from "next/server"

export function middleware(request: NextRequest) {
  // Log da requisição
  console.log(`${request.method} ${request.url}`)

  // Adicionar headers de segurança
  const response = NextResponse.next()

  response.headers.set("X-Frame-Options", "DENY")
  response.headers.set("X-Content-Type-Options", "nosniff")
  response.headers.set("Referrer-Policy", "origin-when-cross-origin")

  return response
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}

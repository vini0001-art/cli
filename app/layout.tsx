import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "S4FT Framework - Simple And Fast Templates",
  description:
    "O futuro do desenvolvimento web brasileiro. Framework moderno com Islands Architecture, IA integrada e deploy automático.",
  keywords: ["framework", "javascript", "typescript", "react", "nextjs", "brasileiro"],
  authors: [{ name: "Marcos Dresbach" }],
  openGraph: {
    title: "S4FT Framework",
    description: "O futuro do desenvolvimento web brasileiro",
    type: "website",
    locale: "pt_BR",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>{children}</body>
    </html>
  )
}

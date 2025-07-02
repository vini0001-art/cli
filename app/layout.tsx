import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  metadataBase: new URL('https://www.s4ft.fun'),
  title: 'S4FT App',
  description: 'Aplicação criada com o S4FT Framework. Simples, rápida e moderna para web.',
  openGraph: {
    title: 'S4FT App',
    description: 'Aplicação criada com o S4FT Framework. Simples, rápida e moderna para web.',
    url: 'https://www.s4ft.fun',
    siteName: 'S4FT App',
    images: [
      {
        url: '/placeholder-logo.png',
        width: 800,
        height: 600,
        alt: 'Logo S4FT'
      }
    ],
    locale: 'pt_BR',
    type: 'website'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'S4FT App',
    description: 'Aplicação criada com o S4FT Framework.',
    images: ['/placeholder-logo.png']
  },
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
};

export const viewport = {
  themeColor: "#0ea5e9"
};

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

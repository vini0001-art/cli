import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  metadataBase: new URL('https://www.sua-url.com'),
  title: 'S4FT App',
  description: 'Aplicação criada com o S4FT Framework. Simples, rápida e moderna para web.',
  openGraph: {
    title: 'S4FT App',
    description: 'Aplicação criada com o S4FT Framework. Simples, rápida e moderna para web.',
    url: 'https://www.sua-url.com',
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
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#0ea5e9" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content="Aplicação criada com o S4FT Framework. Simples, rápida e moderna para web." />
        <meta property="og:title" content="S4FT App" />
        <meta property="og:description" content="Aplicação criada com o S4FT Framework. Simples, rápida e moderna para web." />
        <meta property="og:image" content="/placeholder-logo.png" />
        <meta property="og:type" content="website" />
        <meta property="og:locale" content="pt_BR" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="S4FT App" />
        <meta name="twitter:description" content="Aplicação criada com o S4FT Framework." />
        <meta name="twitter:image" content="/placeholder-logo.png" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}

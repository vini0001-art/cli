import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "S4FT Framework - Simple And Fast Templates",
  description:
    "Framework brasileiro para desenvolvimento web moderno com IA integrada e arquitetura de ilhas. Simples, rápido e poderoso.",
  keywords: [
    "s4ft",
    "framework",
    "javascript",
    "typescript",
    "react",
    "nextjs",
    "web development",
    "brazilian framework",
    "islands architecture",
    "ai assistant",
  ],
  authors: [{ name: "S4FT Team", url: "https://s4ft.fun" }],
  creator: "S4FT Team",
  publisher: "S4FT Framework",
  openGraph: {
    type: "website",
    locale: "pt_BR",
    url: "https://s4ft.fun",
    title: "S4FT Framework - Simple And Fast Templates",
    description: "Framework brasileiro para desenvolvimento web moderno com IA integrada e arquitetura de ilhas.",
    siteName: "S4FT Framework",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "S4FT Framework",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "S4FT Framework - Simple And Fast Templates",
    description: "Framework brasileiro para desenvolvimento web moderno com IA integrada e arquitetura de ilhas.",
    images: ["/og-image.png"],
    creator: "@s4ft_framework",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
    yandex: "your-yandex-verification-code",
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
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#3b82f6" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  )
}

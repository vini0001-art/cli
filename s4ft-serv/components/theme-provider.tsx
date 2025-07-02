'use client'


import * as React from 'react'


// Provedor de tema genérico (ajuste conforme seu tema real)
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>
}

import type { Metadata } from 'next'
import './globals.css'
import { path, fs } from 'fs'
import { renderToString } from 'react-dom/server'

export const metadata: Metadata = {
  title: 'v0 App',
  description: 'Created with v0',
  generator: 'v0.dev',
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  // Pseudocódigo para compor layouts
  let layouts: any[] = [];
  let dir = path.dirname(sftFile);
  while (dir !== this.options.appDir) {
    const layoutFile = path.join(dir, "layout.sft");
    if (await fs.pathExists(layoutFile)) {
      // transpile e importe o layout, adicione ao array
      layouts.unshift(importedLayout);
    }
    dir = path.dirname(dir);
  }
  // Renderize layouts aninhando o componente da página
  let content = <PageComponent {...params} />;
  for (const Layout of layouts) {
    content = <Layout>{content}</Layout>;
  }
  const html = renderToString(content);

  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

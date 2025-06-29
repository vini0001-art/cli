import './globals.css'
import fs from 'fs-extra'
import path from 'path'
import { renderToString } from 'react-dom/server'

export const metadata = {
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
  // Defina sftFile como o arquivo atual
  const sftFile = __filename;
  let dir = path.dirname(sftFile);
  while (dir !== this.options.appDir) {
    const layoutFile = path.join(dir, "layout.sft");
    if (await fs.pathExists(layoutFile)) {
      // Transpila e importa dinamicamente o layout, adicionando ao array
      const importedModule = await import(layoutFile);
      const importedLayout = importedModule.default || importedModule.Layout;
      layouts.unshift(importedLayout);
    }
    dir = path.dirname(dir);
  }
  // Renderize layouts aninhando o componente da página
  let content = children;
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

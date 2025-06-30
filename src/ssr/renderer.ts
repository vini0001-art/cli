import React from "react"
import { renderToString } from "react-dom/server"
import { parseS4FT } from "../parser/parser.js"
import { transpileS4FT } from "../transpiler/transpiler.js"
import fs from "fs-extra"
import path from "path"

export interface SSROptions {
  title?: string
  meta?: Record<string, string>
  scripts?: string[]
  styles?: string[]
  lang?: string
  dir?: "ltr" | "rtl"
}

export interface SSGOptions extends SSROptions {
  outputDir?: string
  staticPaths?: string[]
  generateSitemap?: boolean
}

export class SSRRenderer {
  private componentCache = new Map<string, React.ComponentType>()

  // Server-side render a S4FT component
  async renderPage(filePath: string, props: any = {}, options: SSROptions = {}): Promise<string> {
    try {
      // Read and parse S4FT file
      const s4ftContent = await fs.readFile(filePath, "utf-8")
      const ast = parseS4FT(s4ftContent)
      const reactCode = transpileS4FT(ast)

      // Create React component
      const Component = await this.createComponent(reactCode, filePath)

      // Render to string
      const html = renderToString(React.createElement(Component, props))

      // Generate full HTML document
      return this.generateHTML(html, options)
    } catch (error) {
      console.error("SSR Error:", error)
      return this.generateErrorHTML(error, options)
    }
  }

  // Static site generation
  async generateStaticSite(pagesDir: string, options: SSGOptions = {}): Promise<void> {
    const outputDir = options.outputDir || "dist"
    await fs.ensureDir(outputDir)

    // Find all S4FT pages
    const pages = await this.findPages(pagesDir)

    console.log(`📄 Generating ${pages.length} static pages...`)

    // Generate each page
    for (const page of pages) {
      await this.generateStaticPage(page, outputDir, options)
    }

    // Generate sitemap if requested
    if (options.generateSitemap) {
      await this.generateSitemap(pages, outputDir)
    }

    console.log(`✅ Static site generated in ${outputDir}`)
  }

  // Generate single static page
  private async generateStaticPage(pagePath: string, outputDir: string, options: SSGOptions): Promise<void> {
    try {
      const html = await this.renderPage(pagePath, {}, options)
      const outputPath = this.getOutputPath(pagePath, outputDir)

      await fs.ensureDir(path.dirname(outputPath))
      await fs.writeFile(outputPath, html)

      console.log(`✅ Generated: ${outputPath}`)
    } catch (error) {
      console.error(`❌ Failed to generate ${pagePath}:`, error)
    }
  }

  // Create React component from transpiled code
  private async createComponent(reactCode: string, filePath: string): Promise<React.ComponentType> {
    // Check cache first
    if (this.componentCache.has(filePath)) {
      return this.componentCache.get(filePath)!
    }

    try {
      // Use dynamic import or eval to create component
      // In a real implementation, you'd want to use a more secure method
      const componentModule = new Function(
        "React",
        "useState",
        `
        ${reactCode}
        return typeof ${this.extractComponentName(reactCode)} !== 'undefined' ? ${this.extractComponentName(reactCode)} : (() => React.createElement('div', null, 'Component Error'));
      `,
      )(React, React.useState)

      this.componentCache.set(filePath, componentModule)
      return componentModule
    } catch (error) {
      console.error("Component creation error:", error)
      return () => React.createElement("div", null, "Component Error")
    }
  }

  // Extract component name from transpiled code
  private extractComponentName(reactCode: string): string {
    const match = reactCode.match(/export default function (\w+)/) || reactCode.match(/function (\w+)/)
    return match ? match[1] : "Component"
  }

  // Find all S4FT pages
  private async findPages(dir: string): Promise<string[]> {
    const pages: string[] = []

    if (!(await fs.pathExists(dir))) {
      return pages
    }

    const entries = await fs.readdir(dir, { withFileTypes: true })

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name)

      if (entry.isDirectory()) {
        const subPages = await this.findPages(fullPath)
        pages.push(...subPages)
      } else if (entry.name.endsWith(".s4ft")) {
        pages.push(fullPath)
      }
    }

    return pages
  }

  // Get output path for generated file
  private getOutputPath(pagePath: string, outputDir: string): string {
    const relativePath = path.relative("app", pagePath)
    const htmlPath = relativePath.replace(".s4ft", ".html")

    // Handle index pages
    if (path.basename(htmlPath) === "page.html" || path.basename(htmlPath) === "index.html") {
      return path.join(outputDir, path.dirname(htmlPath), "index.html")
    }

    return path.join(outputDir, htmlPath)
  }

  // Generate HTML document
  private generateHTML(content: string, options: SSROptions): string {
    const { title = "S4FT App", meta = {}, scripts = [], styles = [], lang = "pt-BR", dir = "ltr" } = options

    const metaTags = Object.entries(meta)
      .map(([name, content]) => `<meta name="${name}" content="${content}">`)
      .join("\n    ")

    const styleTags = styles.map((href) => `<link rel="stylesheet" href="${href}">`).join("\n    ")

    const scriptTags = scripts.map((src) => `<script src="${src}"></script>`).join("\n    ")

    return `<!DOCTYPE html>
<html lang="${lang}" dir="${dir}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    ${metaTags}
    ${styleTags}
    <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
    <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
    <script src="https://cdn.tailwindcss.com"></script>
</head>
<body>
    <div id="root">${content}</div>
    ${scriptTags}
    <script>
        // Hydrate the server-rendered content
        if (typeof ReactDOM !== 'undefined' && ReactDOM.hydrate) {
            // Component hydration would go here
        }
    </script>
</body>
</html>`
  }

  // Generate error HTML
  private generateErrorHTML(error: any, options: SSROptions): string {
    return this.generateHTML(
      `<div style="padding: 2rem; background: #fee; border: 1px solid #fcc; border-radius: 8px;">
        <h1 style="color: #c33; margin: 0 0 1rem 0;">SSR Error</h1>
        <pre style="background: #f5f5f5; padding: 1rem; border-radius: 4px; overflow: auto;">${error.toString()}</pre>
      </div>`,
      { ...options, title: "SSR Error - S4FT App" },
    )
  }

  // Generate sitemap.xml
  private async generateSitemap(pages: string[], outputDir: string): Promise<void> {
    const baseUrl = "https://example.com" // Configure this
    const urls = pages
      .map((page) => {
        const url = this.pageToUrl(page)
        return `  <url>
    <loc>${baseUrl}${url}</loc>
    <lastmod>${new Date().toISOString().split("T")[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`
      })
      .join("\n")

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`

    await fs.writeFile(path.join(outputDir, "sitemap.xml"), sitemap)
    console.log("✅ Generated sitemap.xml")
  }

  // Convert page path to URL
  private pageToUrl(pagePath: string): string {
    const relativePath = path.relative("app", pagePath)
    let url = "/" + relativePath.replace(".s4ft", "")

    // Handle index pages
    if (url.endsWith("/page") || url.endsWith("/index")) {
      url = url.replace(/\/(page|index)$/, "") || "/"
    }

    return url
  }
}

// Export default renderer instance
export const ssrRenderer = new SSRRenderer()

// Convenience functions
export async function renderPage(filePath: string, props?: any, options?: SSROptions): Promise<string> {
  return ssrRenderer.renderPage(filePath, props, options)
}

export async function generateStaticSite(pagesDir: string, options?: SSGOptions): Promise<void> {
  return ssrRenderer.generateStaticSite(pagesDir, options)
}

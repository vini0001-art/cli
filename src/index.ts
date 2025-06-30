export { DevServer } from "./dev-server/dev-server.js"
export { Builder } from "./build/builder.js"
export { Parser } from "./parser/parser.js"
export { Transpiler } from "./transpiler/transpiler.js"
export { Lexer } from "./parser/lexer.js"
export * as AST from "./parser/ast.js"

// Funções utilitárias principais
export async function createS4FTProject(name: string, options: any = {}) {
  const { createProject } = await import("./cli/cli.js")
  return createProject({ name, ...options })
}

export async function buildS4FTProject(options: any = {}) {
  const { Builder } = await import("./build/builder.js")
  const { Transpiler } = await import("./transpiler/transpiler.js")

  const transpiler = new Transpiler()
  const builder = new Builder(transpiler, {
    minify: options.minify !== false,
    sourceMaps: !!options.sourceMaps,
  })

  return builder.run()
}

export async function startS4FTDevServer(options: any = {}) {
  const { DevServer } = await import("./dev-server/dev-server.js")
  const path = await import("path")

  const devServer = new DevServer({
    port: options.port || 3000,
    projectRoot: options.projectRoot || process.cwd(),
    appDir: options.appDir || path.join(process.cwd(), "app"),
  })

  return devServer.start()
}

// Versão do framework
export const VERSION = "1.0.1"

// Configuração padrão
export const DEFAULT_CONFIG = {
  build: {
    outDir: "dist",
    minify: true,
    sourceMaps: false,
  },
  dev: {
    port: 3000,
    host: "localhost",
    open: true,
  },
  plugins: [],
}

console.log(`
🇧🇷 S4FT Framework v${VERSION}
Simple And Fast Templates
https://s4ft.fun
`)

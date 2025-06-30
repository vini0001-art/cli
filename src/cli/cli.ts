#!/usr/bin/env node
/**
 * S4FT - Simple And Fast Templates – CLI
 * Pequeno wrapper em torno de commander + chalk
 * Mantém compatibilidade com o restante do framework.
 */

import { Command } from "commander"
import chalk from "chalk"
import fs from "fs-extra"
import path from "path"

/* -------------------------------------------------------------------------- */
/*  Tipos utilitários                                                         */
/* -------------------------------------------------------------------------- */
export interface ProjectConfig {
  name: string
  language: "typescript" | "javascript" | string
  template: string
  features: string[]
  auth: string | null
  database: string | null
  styling: "tailwind" | "css" | string
}

/* -------------------------------------------------------------------------- */
/*  Helpers (importações dinâmicas evitam loop de dependência)                */
/* -------------------------------------------------------------------------- */
async function getInteractiveCreate() {
  const mod = await import("./interactive-cli.js")
  return mod.interactiveCreate as (name?: string) => Promise<ProjectConfig>
}

async function getDeploy() {
  const mod = await import("./deploy.js")
  return mod.deployProject as (platform: string) => Promise<void>
}

/* Geradores embutidos para não depender de outro módulo neste exemplo ------- */
async function ensureDirWrite(filePath: string, contents: string) {
  await fs.ensureDir(path.dirname(filePath))
  await fs.writeFile(filePath, contents)
}

async function generateComponent(name: string) {
  const fp = path.join(process.cwd(), "components", `${name}.s4ft`)
  await ensureDirWrite(
    fp,
    `component ${name} {
props {
  title: string = "${name}"
}
<div className="${name.toLowerCase()}">
  <h2>{title}</h2>
</div>
}`,
  )
  console.log(chalk.green(`✅ componente criado: ${fp}`))
}

async function generatePage(name: string) {
  const fp = path.join(process.cwd(), "app", name.toLowerCase(), "page.s4ft")
  await ensureDirWrite(
    fp,
    `page ${name}Page {
<div className="page-${name.toLowerCase()}">
  <h1>${name} page</h1>
</div>
}`,
  )
  console.log(chalk.green(`✅ página criada: ${fp}`))
}

async function generateAPI(name: string) {
  const fp = path.join(process.cwd(), "app", "api", `${name}.s4ft`)
  await ensureDirWrite(
    fp,
    `// ${name} API
export function GET() {
  return { status: 200, body: { ok: true } }
}`,
  )
  console.log(chalk.green(`✅ rota API criada: ${fp}`))
}

/* -------------------------------------------------------------------------- */
/*  Programa CLI                                                              */
/* -------------------------------------------------------------------------- */
const program = new Command()

program.name("s4ft").description("S4FT – Simple And Fast Templates CLI").version("1.0.1")

/* ------------------------------- create ----------------------------------- */
program
  .command("create [name]")
  .description("Criar novo projeto S4FT")
  .option("-t, --template <template>", "Template (basic, blog, ecommerce, dashboard)")
  .option("-l, --language <language>", "Linguagem", "typescript")
  .option("--no-interactive", "Pular prompts interativos")
  .action(async (name: string | undefined, opts) => {
    const interactiveCreate = await getInteractiveCreate()

    const config =
      opts.interactive === false
        ? ({
            name: name ?? "my-s4ft-app",
            language: opts.language,
            template: opts.template ?? "basic",
            features: [],
            auth: null,
            database: null,
            styling: "tailwind",
          } satisfies ProjectConfig)
        : await interactiveCreate(name)

    const { createProject } = await import("./interactive-cli.js")
    await createProject(config)

    console.log(chalk.green("🚀 Projeto criado com sucesso!"))
  })

/* -------------------------------- dev ------------------------------------ */
program
  .command("dev")
  .description("Iniciar servidor de desenvolvimento")
  .option("-p, --port <port>", "Porta", "3000")
  .action(async ({ port }) => {
    const { startDevServer } = await import("../dev-server/dev-server.js")
    await startDevServer(Number(port))
  })

/* ------------------------------- build ----------------------------------- */
program
  .command("build")
  .description("Build para produção")
  .action(async () => {
    const { buildProject } = await import("../build/builder.js")
    await buildProject()
  })

/* ------------------------------ deploy ----------------------------------- */
program
  .command("deploy")
  .description("Enviar projeto para produção")
  .option("-p, --platform <platform>", "vercel | netlify | s4ft-cloud", "s4ft-cloud")
  .action(async ({ platform }) => {
    const deployProject = await getDeploy()
    await deployProject(platform)
  })

/* ----------------------------- generate ---------------------------------- */
program
  .command("generate <type> <name>")
  .alias("g")
  .description("Gerar component, page ou api")
  .action(async (type: string, name: string) => {
    switch (type) {
      case "component":
        await generateComponent(name)
        break
      case "page":
        await generatePage(name)
        break
      case "api":
        await generateAPI(name)
        break
      default:
        console.log(chalk.red(`Tipo desconhecido: ${type}`))
    }
  })

/* ------------------------------- ask ------------------------------------- */
program
  .command("ask <question...>")
  .description("Perguntar ao assistente IA")
  .action(async (questionParts: string[]) => {
    const { askAI } = await import("./ai-assistant.js")
    await askAI(questionParts.join(" "))
  })

program.parse()

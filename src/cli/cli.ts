import { Command } from "commander"
import chalk from "chalk"
import figlet from "figlet"
import { createProject } from "./project-generator"
import { startDevServer } from "../dev-server/dev-server"
import { buildProject } from "../build/builder"
import { generateComponent, generatePage, generateAPI, generateLayout, generateMiddleware } from "./generators"
import { startInteractiveCLI } from "./interactive-cli"
import { deployProject } from "./deploy"
import { askAI } from "./ai-assistant"
import { aiGenerateCommand, aiChatCommand, aiImageCommand, aiProviderCommand, aiOptimizeCommand } from "./ai-commands"

const program = new Command()

// Banner do S4FT
function showBanner() {
  console.log(chalk.cyan(figlet.textSync("S4FT", { horizontalLayout: "full" })))
  console.log(chalk.yellow("🇧🇷 Simple And Fast Templates - Framework Web Brasileiro"))
  console.log(chalk.gray("v1.0.0 - Powered by AI\n"))
}

// Comando principal
program
  .name("s4ft")
  .description("🇧🇷 S4FT Framework - Simple And Fast Templates")
  .version("1.0.0")
  .hook("preAction", () => {
    showBanner()
  })

// Criar projeto
program
  .command("create <name>")
  .description("Criar novo projeto S4FT")
  .option("-t, --template <template>", "Template do projeto", "basic")
  .option("-f, --features <features>", "Features separadas por vírgula")
  .option("--no-install", "Não instalar dependências")
  .option("--no-git", "Não inicializar Git")
  .action(async (name, options) => {
    const features = options.features ? options.features.split(",") : []
    await createProject(name, {
      template: options.template,
      features,
      install: options.install,
      git: options.git,
    })
  })

// Servidor de desenvolvimento
program
  .command("dev")
  .description("Iniciar servidor de desenvolvimento")
  .option("-p, --port <port>", "Porta do servidor", "3000")
  .option("-h, --host <host>", "Host do servidor", "localhost")
  .option("--no-open", "Não abrir navegador")
  .action(async (options) => {
    await startDevServer({
      port: Number.parseInt(options.port),
      host: options.host,
      open: options.open,
    })
  })

// Build do projeto
program
  .command("build")
  .description("Fazer build do projeto")
  .option("-o, --output <dir>", "Diretório de saída", "dist")
  .option("--no-minify", "Não minificar código")
  .option("--sourcemap", "Gerar source maps")
  .action(async (options) => {
    await buildProject({
      outDir: options.output,
      minify: options.minify,
      sourceMaps: options.sourcemap,
    })
  })

// Deploy
program
  .command("deploy")
  .description("Deploy do projeto")
  .option("-p, --platform <platform>", "Plataforma de deploy", "s4ft-cloud")
  .option("-d, --domain <domain>", "Domínio customizado")
  .action(async (options) => {
    await deployProject({
      platform: options.platform,
      domain: options.domain,
    })
  })

// Geradores
const generateCmd = program.command("generate").alias("g").description("Gerar código automaticamente")

generateCmd
  .command("component <name>")
  .description("Gerar componente")
  .option("-p, --props <props>", "Props do componente")
  .option("-s, --state <state>", "Estado do componente")
  .option("-e, --events <events>", "Eventos do componente")
  .option("-d, --directory <dir>", "Diretório de destino")
  .action(async (name, options) => {
    const props = options.props ? options.props.split(",") : []
    const state = options.state ? options.state.split(",") : []
    const events = options.events ? options.events.split(",") : []

    await generateComponent(name, {
      props,
      state,
      events,
      directory: options.directory,
    })
  })

generateCmd
  .command("page <name>")
  .description("Gerar página")
  .option("-s, --state <state>", "Estado da página")
  .option("-e, --events <events>", "Eventos da página")
  .option("-d, --directory <dir>", "Diretório de destino")
  .action(async (name, options) => {
    const state = options.state ? options.state.split(",") : []
    const events = options.events ? options.events.split(",") : []

    await generatePage(name, {
      state,
      events,
      directory: options.directory,
    })
  })

generateCmd
  .command("api <name>")
  .description("Gerar API route")
  .option("-d, --directory <dir>", "Diretório de destino")
  .action(async (name, options) => {
    await generateAPI(name, {
      directory: options.directory,
    })
  })

generateCmd
  .command("layout <name>")
  .description("Gerar layout")
  .option("-d, --directory <dir>", "Diretório de destino")
  .action(async (name, options) => {
    await generateLayout(name, {
      directory: options.directory,
    })
  })

generateCmd
  .command("middleware <name>")
  .description("Gerar middleware")
  .option("-d, --directory <dir>", "Diretório de destino")
  .action(async (name, options) => {
    await generateMiddleware(name, {
      directory: options.directory,
    })
  })

// Comandos de IA
const aiCmd = program.command("ai").description("🤖 Comandos de IA")

aiCmd
  .command("generate <type> <name>")
  .description("Gerar código com IA")
  .option("-p, --prompt <prompt>", "Prompt personalizado")
  .option("--provider <provider>", "Provider de IA (groq, grok, fal, deepinfra)")
  .option("-d, --directory <dir>", "Diretório de destino")
  .option("--preview", "Mostrar preview do código")
  .action(aiGenerateCommand)

aiCmd.command("chat").description("Conversar com assistente IA").action(aiChatCommand)

aiCmd
  .command("image <prompt>")
  .description("Gerar imagem com IA")
  .option("--provider <provider>", "Provider de IA")
  .option("--save", "Salvar imagem no projeto")
  .action(aiImageCommand)

aiCmd.command("provider [action] [name]").description("Gerenciar providers de IA").action(aiProviderCommand)

aiCmd.command("optimize <file>").description("Otimizar código com IA").action(aiOptimizeCommand)

// CLI Interativo
program
  .command("interactive")
  .alias("i")
  .description("Modo interativo completo")
  .action(async () => {
    await startInteractiveCLI()
  })

// Assistente IA (comando legado)
program
  .command("ask <question>")
  .description("Perguntar ao assistente IA")
  .action(async (question) => {
    await askAI(question)
  })

// Comandos de utilitários
program
  .command("info")
  .description("Informações do projeto")
  .action(() => {
    console.log(chalk.blue("📊 Informações do S4FT Framework:"))
    console.log(chalk.white("• Versão: 1.0.0"))
    console.log(chalk.white("• Linguagem: TypeScript"))
    console.log(chalk.white("• UI: Tailwind CSS + shadcn/ui"))
    console.log(chalk.white("• IA: Groq, Grok, Fal, Deep Infra"))
    console.log(chalk.white("• Deploy: S4FT Cloud, Vercel, Netlify"))
    console.log(chalk.white("• Documentação: https://s4ft.dev"))
  })

program
  .command("doctor")
  .description("Verificar saúde do projeto")
  .action(async () => {
    console.log(chalk.blue("🔍 Verificando projeto S4FT..."))

    // Verificações básicas
    const checks = [
      { name: "package.json", path: "package.json" },
      { name: "s4ft.config.ts", path: "s4ft.config.ts" },
      { name: "tailwind.config.js", path: "tailwind.config.js" },
      { name: "tsconfig.json", path: "tsconfig.json" },
    ]

    for (const check of checks) {
      try {
        const fs = await import("fs-extra")
        const exists = await fs.pathExists(check.path)
        const status = exists ? chalk.green("✅") : chalk.red("❌")
        console.log(`${status} ${check.name}`)
      } catch {
        console.log(`${chalk.red("❌")} ${check.name}`)
      }
    }
  })

// Tratamento de erros
program.on("command:*", () => {
  console.error(chalk.red("❌ Comando inválido: %s"), program.args.join(" "))
  console.log(chalk.yellow('💡 Use "s4ft --help" para ver comandos disponíveis'))
  process.exit(1)
})

export { program }

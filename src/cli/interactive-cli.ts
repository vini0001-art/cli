import inquirer from "inquirer"
import chalk from "chalk"

export interface ProjectConfig {
  name: string
  language: "pt-br" | "en" | "es"
  template: "basic" | "blog" | "ecommerce" | "dashboard"
  features: string[]
  styling: "tailwind" | "css" | "styled-components"
  packageManager: "npm" | "yarn" | "pnpm"
  auth?: string
  database?: string
}

export async function interactiveCreate(projectName?: string): Promise<ProjectConfig> {
  console.log(chalk.cyan.bold("\n🇧🇷 Bem-vindo ao S4FT Framework!"))
  console.log(chalk.white("Vamos criar seu projeto passo a passo.\n"))

  // Detectar idioma do sistema
  const systemLang = Intl.DateTimeFormat().resolvedOptions().locale
  const defaultLang = systemLang.startsWith("pt") ? "pt-br" : systemLang.startsWith("es") ? "es" : "en"

  const questions = [
    {
      type: "input",
      name: "name",
      message: "Nome do projeto:",
      default: projectName || "meu-app-s4ft",
      validate: (input: string) => {
        if (!input.trim()) return "Nome é obrigatório"
        if (!/^[a-z0-9-_]+$/.test(input)) return "Use apenas letras minúsculas, números, - e _"
        return true
      },
    },
    {
      type: "list",
      name: "language",
      message: "Idioma do projeto:",
      choices: [
        { name: "🇧🇷 Português (Brasil)", value: "pt-br" },
        { name: "🇺🇸 English", value: "en" },
        { name: "🇪🇸 Español", value: "es" },
      ],
      default: defaultLang,
    },
    {
      type: "list",
      name: "template",
      message: "Escolha um template:",
      choices: [
        { name: "📄 Básico - Projeto simples", value: "basic" },
        { name: "📝 Blog - Site com posts", value: "blog" },
        { name: "🛒 E-commerce - Loja online", value: "ecommerce" },
        { name: "📊 Dashboard - Painel administrativo", value: "dashboard" },
      ],
    },
    {
      type: "checkbox",
      name: "features",
      message: "Recursos adicionais:",
      choices: [
        { name: "🎨 Tailwind CSS", value: "tailwind", checked: true },
        { name: "🔐 Autenticação", value: "auth" },
        { name: "💾 Banco de dados", value: "database" },
        { name: "📱 PWA (Progressive Web App)", value: "pwa" },
        { name: "📊 Analytics", value: "analytics" },
        { name: "💳 Pagamentos", value: "payments" },
      ],
    },
  ]

  // Perguntas condicionais
  const answers = await inquirer.prompt(questions)

  // Se escolheu auth, perguntar provider
  if (answers.features.includes("auth")) {
    const authQuestion = await inquirer.prompt([
      {
        type: "list",
        name: "auth",
        message: "Provedor de autenticação:",
        choices: [
          { name: "🔑 Google", value: "google" },
          { name: "🐙 GitHub", value: "github" },
          { name: "📘 Facebook", value: "facebook" },
          { name: "🔐 Auth0", value: "auth0" },
        ],
      },
    ])
    answers.auth = authQuestion.auth
  }

  // Se escolheu database, perguntar qual
  if (answers.features.includes("database")) {
    const dbQuestion = await inquirer.prompt([
      {
        type: "list",
        name: "database",
        message: "Banco de dados:",
        choices: [
          { name: "🟢 Supabase", value: "supabase" },
          { name: "🐘 PostgreSQL", value: "postgresql" },
          { name: "🍃 MongoDB", value: "mongodb" },
          { name: "⚡ PlanetScale", value: "planetscale" },
        ],
      },
    ])
    answers.database = dbQuestion.database
  }

  // Gerenciador de pacotes
  const pmQuestion = await inquirer.prompt([
    {
      type: "list",
      name: "packageManager",
      message: "Gerenciador de pacotes:",
      choices: [
        { name: "📦 npm", value: "npm" },
        { name: "🧶 yarn", value: "yarn" },
        { name: "⚡ pnpm", value: "pnpm" },
      ],
    },
  ])

  return {
    ...answers,
    packageManager: pmQuestion.packageManager,
    styling: answers.features.includes("tailwind") ? "tailwind" : "css",
  }
}

export function showNextSteps(config: ProjectConfig) {
  const isPortuguese = config.language === "pt-br"

  console.log(chalk.green.bold("\n✅ Projeto criado com sucesso!"))
  console.log(chalk.cyan(`\n📁 ${config.name}/`))

  console.log(chalk.yellow.bold(isPortuguese ? "\n🚀 Próximos passos:" : "\n🚀 Next steps:"))
  console.log(chalk.white(`  cd ${config.name}`))
  console.log(chalk.white(`  ${config.packageManager} install`))
  console.log(chalk.white(`  ${config.packageManager} run dev`))

  console.log(chalk.blue.bold(isPortuguese ? "\n📚 Recursos úteis:" : "\n📚 Useful resources:"))
  console.log(chalk.gray("  📖 Documentação: https://s4ft.fun/docs"))
  console.log(chalk.gray("  💬 Discord: https://discord.gg/s4ft"))
  console.log(chalk.gray("  🐙 GitHub: https://github.com/s4ft-framework"))

  console.log(chalk.magenta.bold(isPortuguese ? "\n💝 Ajude o S4FT:" : "\n💝 Support S4FT:"))
  console.log(chalk.gray("  ⭐ Star no GitHub"))
  console.log(chalk.gray("  💰 PIX: doacao@s4ft.fun"))
  console.log(chalk.gray("  🌟 Compartilhe com amigos"))

  console.log(chalk.green("\n🇧🇷 Obrigado por escolher o S4FT! 🚀\n"))
}

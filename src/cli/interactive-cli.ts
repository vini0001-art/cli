"use client"

import inquirer from "inquirer"
import chalk from "chalk"
import ora from "ora"
import { generateComponent, generatePage, generateAPI, generateLayout, generateMiddleware } from "./generators.js"
import { createProject } from "./project-generator.js"
import { startDevServer } from "../dev-server/dev-server.js"
import { buildProject } from "../build/builder.js"

export interface InteractiveOptions {
  projectName?: string
  template?: string
  features?: string[]
}

export async function startInteractiveCLI(): Promise<void> {
  console.log(
    chalk.cyan(`
╔══════════════════════════════════════════════════════════════╗
║                    🇧🇷 S4FT Framework                        ║
║              Simple And Fast Templates                       ║
║                                                              ║
║  Bem-vindo ao modo interativo do S4FT!                      ║
║  Vamos criar algo incrível juntos! 🚀                       ║
╚══════════════════════════════════════════════════════════════╝
    `),
  )

  try {
    const mainAction = await inquirer.prompt([
      {
        type: "list",
        name: "action",
        message: "🤔 O que você gostaria de fazer?",
        choices: [
          { name: "🆕 Criar novo projeto", value: "create" },
          { name: "⚡ Gerar código (componente, página, API)", value: "generate" },
          { name: "🔥 Iniciar servidor de desenvolvimento", value: "dev" },
          { name: "📦 Fazer build do projeto", value: "build" },
          { name: "ℹ️ Informações do S4FT", value: "info" },
          { name: "❌ Sair", value: "exit" },
        ],
      },
    ])

    switch (mainAction.action) {
      case "create":
        await handleCreateProject()
        break
      case "generate":
        await handleGenerate()
        break
      case "dev":
        await handleDevServer()
        break
      case "build":
        await handleBuild()
        break
      case "info":
        await handleInfo()
        break
      case "exit":
        console.log(chalk.yellow("👋 Até logo! Obrigado por usar o S4FT Framework!"))
        return
    }

    // Ask if user wants to continue
    const continueAction = await inquirer.prompt([
      {
        type: "confirm",
        name: "continue",
        message: "🔄 Deseja fazer mais alguma coisa?",
        default: true,
      },
    ])

    if (continueAction.continue) {
      await startInteractiveCLI()
    } else {
      console.log(chalk.green("✨ Obrigado por usar o S4FT Framework! Até a próxima! 🇧🇷"))
    }
  } catch (error) {
    console.error(chalk.red("❌ Erro no modo interativo:"), error)
  }
}

async function handleCreateProject(): Promise<void> {
  console.log(chalk.blue("\n📦 Vamos criar um novo projeto S4FT!"))

  const projectConfig = await inquirer.prompt([
    {
      type: "input",
      name: "name",
      message: "📝 Nome do projeto:",
      validate: (input) => {
        if (!input.trim()) return "Nome do projeto é obrigatório"
        if (!/^[a-zA-Z0-9-_]+$/.test(input)) return "Use apenas letras, números, hífens e underscores"
        return true
      },
    },
    {
      type: "list",
      name: "template",
      message: "🎨 Escolha um template:",
      choices: [
        { name: "🏠 Básico - Projeto simples para começar", value: "basic" },
        { name: "📝 Blog - Site de blog com posts", value: "blog" },
        { name: "🛒 E-commerce - Loja virtual completa", value: "ecommerce" },
        { name: "📊 Dashboard - Painel administrativo", value: "dashboard" },
        { name: "🌐 Landing Page - Página de apresentação", value: "landing" },
        { name: "📱 PWA - Progressive Web App", value: "pwa" },
      ],
    },
    {
      type: "checkbox",
      name: "features",
      message: "🔧 Recursos adicionais:",
      choices: [
        { name: "🔐 Autenticação", value: "auth" },
        { name: "🗄️ Banco de dados (Supabase)", value: "database" },
        { name: "💳 Pagamentos (Stripe)", value: "payments" },
        { name: "📧 Email (Resend)", value: "email" },
        { name: "🌍 Internacionalização", value: "i18n" },
        { name: "📊 Analytics", value: "analytics" },
        { name: "🎨 Tema escuro", value: "darkmode" },
        { name: "📱 PWA", value: "pwa" },
      ],
    },
    {
      type: "confirm",
      name: "typescript",
      message: "📘 Usar TypeScript?",
      default: true,
    },
    {
      type: "confirm",
      name: "tailwind",
      message: "🎨 Incluir Tailwind CSS?",
      default: true,
    },
    {
      type: "confirm",
      name: "eslint",
      message: "🔍 Configurar ESLint?",
      default: true,
    },
  ])

  const spinner = ora("🚀 Criando projeto...").start()

  try {
    await createProject(projectConfig.name, projectConfig.template, {
      features: projectConfig.features,
      typescript: projectConfig.typescript,
      tailwind: projectConfig.tailwind,
      eslint: projectConfig.eslint,
    })

    spinner.succeed(chalk.green(`✅ Projeto ${projectConfig.name} criado com sucesso!`))

    console.log(
      chalk.cyan(`
📁 Próximos passos:
   cd ${projectConfig.name}
   npm install
   npm run dev

🌟 Seu projeto está pronto! Comece a desenvolver com S4FT!
      `),
    )
  } catch (error) {
    spinner.fail(chalk.red("❌ Erro ao criar projeto"))
    console.error(error)
  }
}

async function handleGenerate(): Promise<void> {
  console.log(chalk.blue("\n⚡ Vamos gerar código S4FT!"))

  const generateConfig = await inquirer.prompt([
    {
      type: "list",
      name: "type",
      message: "🎯 O que você quer gerar?",
      choices: [
        { name: "🧩 Componente", value: "component" },
        { name: "📄 Página", value: "page" },
        { name: "🔌 API Route", value: "api" },
        { name: "🎨 Layout", value: "layout" },
        { name: "🔧 Middleware", value: "middleware" },
      ],
    },
    {
      type: "input",
      name: "name",
      message: "📝 Nome:",
      validate: (input) => {
        if (!input.trim()) return "Nome é obrigatório"
        return true
      },
    },
  ])

  // Type-specific questions
  let additionalConfig = {}

  if (generateConfig.type === "component") {
    additionalConfig = await inquirer.prompt([
      {
        type: "input",
        name: "props",
        message: "🔧 Props (ex: title:string, onClick:function):",
      },
      {
        type: "input",
        name: "state",
        message: "📊 Estado (ex: count:number:0, loading:boolean:false):",
      },
      {
        type: "input",
        name: "events",
        message: "⚡ Eventos (ex: handleClick, handleSubmit):",
      },
    ])
  }

  if (generateConfig.type === "page") {
    additionalConfig = await inquirer.prompt([
      {
        type: "input",
        name: "state",
        message: "📊 Estado da página (ex: data:array:[], loading:boolean:false):",
      },
      {
        type: "input",
        name: "events",
        message: "⚡ Eventos da página (ex: loadData, handleSubmit):",
      },
    ])
  }

  const spinner = ora(`⚡ Gerando ${generateConfig.type}...`).start()

  try {
    const options = {
      props: additionalConfig.props ? additionalConfig.props.split(",").map((p: string) => p.trim()) : [],
      state: additionalConfig.state ? additionalConfig.state.split(",").map((s: string) => s.trim()) : [],
      events: additionalConfig.events ? additionalConfig.events.split(",").map((e: string) => e.trim()) : [],
    }

    switch (generateConfig.type) {
      case "component":
        await generateComponent(generateConfig.name, options)
        break
      case "page":
        await generatePage(generateConfig.name, options)
        break
      case "api":
        await generateAPI(generateConfig.name, options)
        break
      case "layout":
        await generateLayout(generateConfig.name, options)
        break
      case "middleware":
        await generateMiddleware(generateConfig.name, options)
        break
    }

    spinner.succeed(chalk.green(`✅ ${generateConfig.type} ${generateConfig.name} gerado com sucesso!`))
  } catch (error) {
    spinner.fail(chalk.red(`❌ Erro ao gerar ${generateConfig.type}`))
    console.error(error)
  }
}

async function handleDevServer(): Promise<void> {
  console.log(chalk.blue("\n🔥 Iniciando servidor de desenvolvimento..."))

  const devConfig = await inquirer.prompt([
    {
      type: "number",
      name: "port",
      message: "🌐 Porta do servidor:",
      default: 3000,
      validate: (input) => {
        if (input < 1 || input > 65535) return "Porta deve estar entre 1 e 65535"
        return true
      },
    },
    {
      type: "confirm",
      name: "open",
      message: "🌐 Abrir no navegador automaticamente?",
      default: true,
    },
  ])

  try {
    console.log(chalk.cyan(`🚀 Iniciando servidor na porta ${devConfig.port}...`))
    await startDevServer(devConfig.port)

    if (devConfig.open) {
      const open = await import("open")
      await open.default(`http://localhost:${devConfig.port}`)
    }
  } catch (error) {
    console.error(chalk.red("❌ Erro ao iniciar servidor:"), error)
  }
}

async function handleBuild(): Promise<void> {
  console.log(chalk.blue("\n📦 Fazendo build do projeto..."))

  const buildConfig = await inquirer.prompt([
    {
      type: "list",
      name: "mode",
      message: "🎯 Tipo de build:",
      choices: [
        { name: "🏗️ Produção - Build otimizado", value: "production" },
        { name: "🔍 Desenvolvimento - Build com debug", value: "development" },
        { name: "📊 Análise - Build com análise de bundle", value: "analyze" },
      ],
    },
    {
      type: "confirm",
      name: "clean",
      message: "🧹 Limpar diretório de build antes?",
      default: true,
    },
  ])

  const spinner = ora("📦 Fazendo build...").start()

  try {
    // Set environment
    process.env.NODE_ENV = buildConfig.mode === "production" ? "production" : "development"

    await buildProject()

    spinner.succeed(chalk.green("✅ Build concluído com sucesso!"))

    console.log(
      chalk.cyan(`
📦 Build finalizado!
📁 Arquivos gerados em: ./dist
🚀 Pronto para deploy!
      `),
    )
  } catch (error) {
    spinner.fail(chalk.red("❌ Erro no build"))
    console.error(error)
  }
}

async function handleInfo(): Promise<void> {
  console.log(
    chalk.cyan(`
╔══════════════════════════════════════════════════════════════╗
║                    🇧🇷 S4FT Framework                        ║
║              Simple And Fast Templates                       ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║  📊 Versão: 1.0.0                                           ║
║  🇧🇷 Feito no Brasil, para brasileiros                      ║
║  🚀 Framework web moderno e simples                         ║
║                                                              ║
║  ✅ Recursos implementados:                                 ║
║  • Parser e Transpiler S4FT → React                        ║
║  • Hot Reload automático                                     ║
║  • Sistema de roteamento                                     ║
║  • SSR/SSG integrado                                        ║
║  • Gerenciamento de estado                                   ║
║  • Sistema de plugins                                        ║
║  • Internacionalização                                       ║
║  • CLI interativa                                           ║
║  • Testes automatizados                                     ║
║  • Build otimizado                                          ║
║                                                              ║
║  🌟 Próximas funcionalidades:                               ║
║  • IA Assistant integrada                                   ║
║  • Deploy automático                                        ║
║  • Mais templates                                           ║
║  • Marketplace de plugins                                   ║
║                                                              ║
║  📚 Links úteis:                                            ║
║  • Documentação: https://s4ft.dev                          ║
║  • GitHub: https://github.com/s4ft/s4ft                    ║
║  • Discord: https://discord.gg/s4ft                        ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
    `),
  )

  const infoAction = await inquirer.prompt([
    {
      type: "list",
      name: "action",
      message: "📚 O que você gostaria de saber mais?",
      choices: [
        { name: "📖 Ver exemplos de código S4FT", value: "examples" },
        { name: "🔧 Comandos disponíveis", value: "commands" },
        { name: "🎨 Templates disponíveis", value: "templates" },
        { name: "🔌 Plugins disponíveis", value: "plugins" },
        { name: "🆘 Obter ajuda", value: "help" },
        { name: "⬅️ Voltar", value: "back" },
      ],
    },
  ])

  switch (infoAction.action) {
    case "examples":
      showExamples()
      break
    case "commands":
      showCommands()
      break
    case "templates":
      showTemplates()
      break
    case "plugins":
      showPlugins()
      break
    case "help":
      showHelp()
      break
    case "back":
      return
  }
}

function showExamples(): void {
  console.log(
    chalk.cyan(`
📖 Exemplos de código S4FT:

🧩 Componente simples:
${chalk.gray(`
component Button(props: { text: string, onClick: function }) {
  state {
    loading: boolean = false
  }
  
  event handleClick() {
    setLoading(true)
    props.onClick()
    setTimeout(() => setLoading(false), 1000)
  }
  
  <button 
    onClick={handleClick}
    disabled={loading}
    className="bg-blue-500 text-white px-4 py-2 rounded"
  >
    {loading ? "Carregando..." : props.text}
  </button>
}
`)}

📄 Página com estado:
${chalk.gray(`
page TodoList {
  state {
    todos: array = [],
    newTodo: string = ""
  }
  
  event addTodo() {
    if (newTodo.trim()) {
      setTodos([...todos, { id: Date.now(), text: newTodo, done: false }])
      setNewTodo("")
    }
  }
  
  <div className="max-w-md mx-auto p-4">
    <h1 className="text-2xl font-bold mb-4">Lista de Tarefas</h1>
    
    <div className="flex gap-2 mb-4">
      <input 
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
        className="flex-1 border rounded px-2 py-1"
        placeholder="Nova tarefa..."
      />
      <button onClick={addTodo} className="bg-green-500 text-white px-4 py-1 rounded">
        Adicionar
      </button>
    </div>
    
    <ul className="space-y-2">
      {todos.map(todo => (
        <li key={todo.id} className="flex items-center gap-2">
          <input type="checkbox" checked={todo.done} />
          <span className={todo.done ? "line-through" : ""}>{todo.text}</span>
        </li>
      ))}
    </ul>
  </div>
}
`)}
    `),
  )
}

function showCommands(): void {
  console.log(
    chalk.cyan(`
🔧 Comandos disponíveis:

📦 Projeto:
  s4ft create <nome>              Criar novo projeto
  s4ft dev                        Servidor de desenvolvimento
  s4ft build                      Build de produção
  s4ft deploy                     Deploy automático

⚡ Geração de código:
  s4ft generate component <nome>  Gerar componente
  s4ft generate page <nome>       Gerar página
  s4ft generate api <nome>        Gerar API route
  s4ft generate layout <nome>     Gerar layout
  s4ft generate middleware <nome> Gerar middleware

🤖 Interativo:
  s4ft interactive               Modo interativo
  s4ft i                         Alias para interactive

ℹ️ Informações:
  s4ft info                      Informações do framework
  s4ft --help                    Ajuda geral
  s4ft <comando> --help          Ajuda específica

🔧 Utilitários:
  s4ft lint                      Verificar código
  s4ft test                      Executar testes
  s4ft clean                     Limpar cache
    `),
  )
}

function showTemplates(): void {
  console.log(
    chalk.cyan(`
🎨 Templates disponíveis:

🏠 basic
   Projeto básico para começar
   • Página inicial simples
   • Componentes básicos
   • Configuração mínima

📝 blog
   Site de blog completo
   • Sistema de posts
   • Páginas de categoria
   • SEO otimizado

🛒 ecommerce
   Loja virtual completa
   • Catálogo de produtos
   • Carrinho de compras
   • Checkout integrado

📊 dashboard
   Painel administrativo
   • Gráficos e métricas
   • Tabelas de dados
   • Sistema de usuários

🌐 landing
   Página de apresentação
   • Hero section
   • Seções de features
   • Call-to-actions

📱 pwa
   Progressive Web App
   • Service Worker
   • Offline support
   • App-like experience
    `),
  )
}

function showPlugins(): void {
  console.log(
    chalk.cyan(`
🔌 Plugins disponíveis:

🔐 auth
   Sistema de autenticação
   • Login/logout
   • Proteção de rotas
   • Gerenciamento de sessão

🎨 theme
   Sistema de temas
   • Modo claro/escuro
   • Personalização de cores
   • Troca dinâmica

📊 analytics
   Analytics integrado
   • Tracking de páginas
   • Eventos customizados
   • Relatórios

🗄️ database
   Integração com banco
   • Supabase
   • PostgreSQL
   • MongoDB

💳 payments
   Sistema de pagamentos
   • Stripe
   • PayPal
   • PIX

📧 email
   Envio de emails
   • Resend
   • SendGrid
   • Templates
    `),
  )
}

function showHelp(): void {
  console.log(
    chalk.cyan(`
🆘 Precisa de ajuda?

📚 Documentação completa:
   https://s4ft.dev

💬 Comunidade Discord:
   https://discord.gg/s4ft

🐛 Reportar bugs:
   https://github.com/s4ft/s4ft/issues

📧 Contato direto:
   team@s4ft.dev

🎥 Tutoriais no YouTube:
   https://youtube.com/@s4ft

📱 Siga no Twitter:
   @s4ft_framework

🇧🇷 Feito com ❤️ no Brasil
    `),
  )
}

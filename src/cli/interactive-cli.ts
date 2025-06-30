"use client"

import inquirer from "inquirer"
import chalk from "chalk"
import fs from "fs-extra"
import path from "path"

export interface ProjectConfig {
  name: string
  language: "typescript" | "javascript"
  template: "basic" | "blog" | "ecommerce" | "dashboard"
  features: string[]
  auth: string | null
  database: string | null
  styling: "tailwind" | "css"
}

export async function createProject(initialConfig?: Partial<ProjectConfig>) {
  console.log(chalk.blue.bold("\n🚀 Bem-vindo ao S4FT Framework!\n"))

  const config: ProjectConfig = await inquirer.prompt([
    {
      type: "input",
      name: "name",
      message: "📁 Nome do projeto:",
      default: initialConfig?.name || "meu-projeto-s4ft",
      validate: (input: string) => {
        if (!input.trim()) return "Nome do projeto é obrigatório"
        if (!/^[a-zA-Z0-9-_]+$/.test(input)) return "Use apenas letras, números, - e _"
        return true
      },
    },
    {
      type: "list",
      name: "language",
      message: "🔧 Linguagem:",
      choices: [
        { name: "TypeScript (recomendado)", value: "typescript" },
        { name: "JavaScript", value: "javascript" },
      ],
      default: initialConfig?.language || "typescript",
    },
    {
      type: "list",
      name: "template",
      message: "📋 Template do projeto:",
      choices: [
        { name: "🏠 Básico - Página simples", value: "basic" },
        { name: "📝 Blog - Site com posts", value: "blog" },
        { name: "🛒 E-commerce - Loja online", value: "ecommerce" },
        { name: "📊 Dashboard - Painel administrativo", value: "dashboard" },
      ],
      default: initialConfig?.template || "basic",
    },
    {
      type: "checkbox",
      name: "features",
      message: "✨ Funcionalidades extras:",
      choices: [
        { name: "🔐 Autenticação", value: "auth" },
        { name: "💾 Banco de dados", value: "database" },
        { name: "📱 PWA", value: "pwa" },
        { name: "📈 Analytics", value: "analytics" },
        { name: "🌙 Dark mode", value: "darkmode" },
      ],
    },
    {
      type: "list",
      name: "auth",
      message: "🔐 Provedor de autenticação:",
      choices: [
        { name: "Nenhum", value: null },
        { name: "Google", value: "google" },
        { name: "GitHub", value: "github" },
        { name: "Auth0", value: "auth0" },
      ],
      when: (answers: any) => answers.features.includes("auth"),
    },
    {
      type: "list",
      name: "database",
      message: "💾 Banco de dados:",
      choices: [
        { name: "Nenhum", value: null },
        { name: "Supabase", value: "supabase" },
        { name: "MongoDB", value: "mongodb" },
        { name: "PostgreSQL", value: "postgresql" },
      ],
      when: (answers: any) => answers.features.includes("database"),
    },
  ])

  // Adicionar configurações padrão
  const fullConfig: ProjectConfig = {
    ...config,
    styling: "tailwind",
    features: config.features || [],
    auth: config.auth || null,
    database: config.database || null,
  }

  console.log(chalk.yellow("\n📦 Criando projeto..."))

  await createProjectStructure(fullConfig)

  console.log(chalk.green.bold("\n✅ Projeto criado com sucesso!"))
  console.log(
    chalk.cyan(`
📁 Próximos passos:
   cd ${fullConfig.name}
   npm install
   npm run dev

🚀 Comandos disponíveis:
   s4ft dev          - Servidor de desenvolvimento
   s4ft build        - Build para produção
   s4ft generate     - Gerar componentes/páginas
   s4ft ask          - AI Assistant
   s4ft deploy       - Deploy automático
  `),
  )
}

async function createProjectStructure(config: ProjectConfig) {
  const projectPath = path.join(process.cwd(), config.name)

  // Criar estrutura de pastas
  await fs.ensureDir(projectPath)
  await fs.ensureDir(path.join(projectPath, "app"))
  await fs.ensureDir(path.join(projectPath, "components"))
  await fs.ensureDir(path.join(projectPath, "public"))
  await fs.ensureDir(path.join(projectPath, "styles"))

  // Criar package.json
  const packageJson = {
    name: config.name,
    version: "1.0.0",
    private: true,
    scripts: {
      dev: "s4ft dev",
      build: "s4ft build",
      start: "s4ft serve",
      deploy: "s4ft deploy",
    },
    dependencies: {
      "s4ft-framework": "^1.0.1",
      react: "^18.2.0",
      "react-dom": "^18.2.0",
    },
    devDependencies: {
      "@types/react": "^18.2.0",
      "@types/react-dom": "^18.2.0",
      typescript: config.language === "typescript" ? "^5.0.0" : undefined,
    },
  }

  await fs.writeJSON(path.join(projectPath, "package.json"), packageJson, { spaces: 2 })

  // Criar s4ft.config.ts
  const configFile = `export default {
  build: {
    outDir: 'dist',
    minify: true,
    sourceMaps: false,
  },
  dev: {
    port: 3000,
    open: true,
  },
  plugins: [
    ${config.features.includes("pwa") ? "'s4ft-plugin-pwa'," : ""}
    ${config.features.includes("analytics") ? "'s4ft-plugin-analytics'," : ""}
    ${config.auth ? `['s4ft-plugin-auth', { provider: '${config.auth}' }],` : ""}
    ${config.database ? `['s4ft-plugin-database', { type: '${config.database}' }],` : ""}
  ],
  deploy: {
    target: 's4ft-cloud',
    domain: '${config.name}.s4ft.fun'
  }
}`

  await fs.writeFile(path.join(projectPath, "s4ft.config.ts"), configFile)

  // Criar arquivos baseados no template
  await createTemplateFiles(projectPath, config)
}

async function createTemplateFiles(projectPath: string, config: ProjectConfig) {
  const templates = {
    basic: {
      "app/page.s4ft": `page Home {
  state {
    count: number = 0
  }
  
  event increment() {
    count = count + 1
  }
  
  <div className="home-page">
    <h1>Bem-vindo ao S4FT!</h1>
    <p>Contador: {count}</p>
    <button onClick={increment}>Incrementar</button>
  </div>
}`,
      "app/layout.s4ft": `layout RootLayout {
  <html lang="pt-BR">
    <head>
      <title>${config.name}</title>
      <meta name="description" content="Projeto criado com S4FT Framework" />
    </head>
    <body>
      <header>
        <nav>
          <a href="/">Início</a>
          <a href="/about">Sobre</a>
        </nav>
      </header>
      <main>{children}</main>
      <footer>
        <p>&copy; 2024 ${config.name}</p>
      </footer>
    </body>
  </html>
}`,
      "components/Button.s4ft": `component Button {
  <button 
    className="btn btn-primary"
    onClick={props.onClick}
  >
    {props.children}
  </button>
}`,
    },
    blog: {
      "app/page.s4ft": `page BlogHome {
  state {
    posts: array = []
  }
  
  event async loadPosts() {
    const response = await fetch('/api/posts')
    posts = await response.json()
  }
  
  <div className="blog-home">
    <h1>Meu Blog</h1>
    <div className="posts-grid">
      {posts.map(post => (
        <article key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.excerpt}</p>
          <a href={"/posts/" + post.slug}>Ler mais</a>
        </article>
      ))}
    </div>
  </div>
}`,
      "app/posts/[slug]/page.s4ft": `page BlogPost {
  state {
    post: object = null,
    loading: boolean = true
  }
  
  event async loadPost() {
    const response = await fetch("/api/posts/" + params.slug)
    post = await response.json()
    loading = false
  }
  
  <div className="blog-post">
    {loading ? (
      <p>Carregando...</p>
    ) : (
      <article>
        <h1>{post.title}</h1>
        <div className="content" dangerouslySetInnerHTML={{__html: post.content}} />
      </article>
    )}
  </div>
}`,
    },
  }

  const templateFiles = templates[config.template] || templates.basic

  for (const [filePath, content] of Object.entries(templateFiles)) {
    const fullPath = path.join(projectPath, filePath)
    await fs.ensureDir(path.dirname(fullPath))
    await fs.writeFile(fullPath, content)
  }

  // Criar arquivo de estilos
  const stylesContent = `/* Estilos globais do ${config.name} */
@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';

.home-page {
  @apply container mx-auto px-4 py-8 text-center;
}

.btn {
  @apply px-4 py-2 rounded font-medium transition-colors;
}

.btn-primary {
  @apply bg-blue-600 text-white hover:bg-blue-700;
}`

  await fs.writeFile(path.join(projectPath, "styles/globals.css"), stylesContent)
}

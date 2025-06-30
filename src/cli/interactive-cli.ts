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
  packageManager: "npm" | "yarn" | "pnpm"
}

export async function createProject(projectName?: string, options: any = {}): Promise<void> {
  console.log(chalk.blue.bold("\n🚀 Bem-vindo ao S4FT Framework!\n"))

  const config: ProjectConfig = {
    name: projectName || "",
    language: options.language === "js" ? "javascript" : "typescript",
    template: options.template || "basic",
    features: [],
    auth: null,
    database: null,
    styling: "tailwind",
    packageManager: "npm",
  }

  if (!config.name) {
    const nameAnswer = await inquirer.prompt([
      {
        type: "input",
        name: "name",
        message: "Nome do projeto:",
        validate: (input: string) => {
          if (!input.trim()) return "Nome é obrigatório"
          if (!/^[a-zA-Z0-9-_]+$/.test(input)) return "Use apenas letras, números, - e _"
          return true
        },
      },
    ])
    config.name = nameAnswer.name
  }

  const answers = await inquirer.prompt([
    {
      type: "list",
      name: "template",
      message: "Escolha um template:",
      choices: [
        { name: "📄 Básico - Página simples", value: "basic" },
        { name: "📝 Blog - Site com posts", value: "blog" },
        { name: "🛒 E-commerce - Loja online", value: "ecommerce" },
        { name: "📊 Dashboard - Painel admin", value: "dashboard" },
      ],
      default: config.template,
    },
    {
      type: "list",
      name: "language",
      message: "Linguagem:",
      choices: [
        { name: "TypeScript (recomendado)", value: "typescript" },
        { name: "JavaScript", value: "javascript" },
      ],
      default: config.language,
    },
    {
      type: "checkbox",
      name: "features",
      message: "Recursos extras:",
      choices: [
        { name: "🔐 Autenticação", value: "auth" },
        { name: "💾 Banco de dados", value: "database" },
        { name: "📱 PWA", value: "pwa" },
        { name: "📈 Analytics", value: "analytics" },
      ],
    },
    {
      type: "list",
      name: "packageManager",
      message: "Gerenciador de pacotes:",
      choices: ["npm", "yarn", "pnpm"],
      default: "npm",
    },
  ])

  Object.assign(config, answers)

  console.log(chalk.yellow("\n📦 Criando projeto..."))

  await generateProject(config)

  console.log(chalk.green.bold(`\n✅ Projeto ${config.name} criado com sucesso!`))
  console.log(chalk.cyan(`\nPróximos passos:`))
  console.log(chalk.white(`  cd ${config.name}`))
  console.log(chalk.white(`  ${config.packageManager} install`))
  console.log(chalk.white(`  ${config.packageManager} run dev`))
}

async function generateProject(config: ProjectConfig): Promise<void> {
  const projectPath = path.join(process.cwd(), config.name)

  await fs.ensureDir(projectPath)

  // Package.json
  const packageJson = {
    name: config.name,
    version: "0.1.0",
    private: true,
    scripts: {
      dev: "s4ft dev",
      build: "s4ft build",
      start: "s4ft serve",
      deploy: "s4ft deploy",
    },
    dependencies: {
      "s4ft-framework": "^1.0.0",
      react: "^18.0.0",
      "react-dom": "^18.0.0",
    },
    devDependencies: {
      "@types/react": "^18.0.0",
      "@types/react-dom": "^18.0.0",
      typescript: "^5.0.0",
    },
  }

  await fs.writeJSON(path.join(projectPath, "package.json"), packageJson, { spaces: 2 })

  // Configuração S4FT
  const s4ftConfig = `export default {
  build: {
    outDir: 'dist',
    minify: true
  },
  dev: {
    port: 3000,
    open: true
  },
  plugins: ${JSON.stringify(
    config.features.map((f) => `s4ft-plugin-${f}`),
    null,
    2,
  )}
}`

  await fs.writeFile(path.join(projectPath, "s4ft.config.ts"), s4ftConfig)

  // Estrutura de pastas
  await fs.ensureDir(path.join(projectPath, "app"))
  await fs.ensureDir(path.join(projectPath, "components"))
  await fs.ensureDir(path.join(projectPath, "public"))

  // Página inicial
  const pageContent = getTemplateContent(config.template)
  await fs.writeFile(path.join(projectPath, "app", "page.s4ft"), pageContent)

  console.log(chalk.green(`📁 Estrutura criada em ${projectPath}`))
}

function getTemplateContent(template: string): string {
  const templates = {
    basic: `page Home {
  state {
    message: string = "Bem-vindo ao S4FT!"
  }
  
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-900 mb-4">{message}</h1>
      <p className="text-gray-600">Seu projeto S4FT está funcionando!</p>
    </div>
  </div>
}`,
    blog: `page Blog {
  state {
    posts: array = [
      { id: 1, title: "Primeiro Post", content: "Conteúdo do post..." },
      { id: 2, title: "Segundo Post", content: "Mais conteúdo..." }
    ]
  }
  
  <div className="container mx-auto px-4 py-8">
    <h1 className="text-3xl font-bold mb-8">Meu Blog</h1>
    {posts.map(post => (
      <article key={post.id} className="mb-6 p-4 border rounded">
        <h2 className="text-xl font-semibold">{post.title}</h2>
        <p>{post.content}</p>
      </article>
    ))}
  </div>
}`,
    ecommerce: `page Store {
  state {
    products: array = [
      { id: 1, name: "Produto 1", price: 99.90 },
      { id: 2, name: "Produto 2", price: 149.90 }
    ]
  }
  
  <div className="container mx-auto px-4 py-8">
    <h1 className="text-3xl font-bold mb-8">Minha Loja</h1>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map(product => (
        <div key={product.id} className="border rounded p-4">
          <h3 className="font-semibold">{product.name}</h3>
          <p className="text-green-600">R$ {product.price}</p>
          <button className="mt-2 bg-blue-500 text-white px-4 py-2 rounded">
            Comprar
          </button>
        </div>
      ))}
    </div>
  </div>
}`,
    dashboard: `page Dashboard {
  state {
    stats: object = {
      users: 1250,
      sales: 89500,
      orders: 342
    }
  }
  
  <div className="min-h-screen bg-gray-100">
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-lg font-semibold">Usuários</h3>
          <p className="text-2xl font-bold text-blue-600">{stats.users}</p>
        </div>
        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-lg font-semibold">Vendas</h3>
          <p className="text-2xl font-bold text-green-600">R$ {stats.sales}</p>
        </div>
        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-lg font-semibold">Pedidos</h3>
          <p className="text-2xl font-bold text-purple-600">{stats.orders}</p>
        </div>
      </div>
    </div>
  </div>
}`,
  }

  return templates[template as keyof typeof templates] || templates.basic
}

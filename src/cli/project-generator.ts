"use client"

import fs from "fs-extra"
import path from "path"
import chalk from "chalk"
import { execSync } from "child_process"

export interface ProjectOptions {
  template?: string
  features?: string[]
  typescript?: boolean
  tailwind?: boolean
  eslint?: boolean
  git?: boolean
}

export async function createProject(name: string, template = "basic", options: ProjectOptions = {}): Promise<void> {
  const projectPath = path.join(process.cwd(), name)

  // Check if directory already exists
  if (await fs.pathExists(projectPath)) {
    throw new Error(`Diretório ${name} já existe`)
  }

  console.log(chalk.blue(`📦 Criando projeto ${name}...`))

  // Create project directory
  await fs.ensureDir(projectPath)

  // Generate base structure
  await generateBaseStructure(projectPath, options)

  // Generate template-specific files
  await generateTemplate(projectPath, template, options)

  // Add features
  if (options.features && options.features.length > 0) {
    await addFeatures(projectPath, options.features)
  }

  // Generate package.json
  await generatePackageJson(projectPath, name, options)

  // Generate configuration files
  await generateConfigFiles(projectPath, options)

  // Initialize git repository
  if (options.git !== false) {
    await initializeGit(projectPath)
  }

  console.log(chalk.green(`✅ Projeto ${name} criado com sucesso!`))
}

async function generateBaseStructure(projectPath: string, options: ProjectOptions): Promise<void> {
  const directories = ["app", "components", "public", "styles", "lib", "hooks", "types", "utils", "middleware", "tests"]

  // Create directories
  for (const dir of directories) {
    await fs.ensureDir(path.join(projectPath, dir))
  }

  // Create basic files
  await fs.writeFile(path.join(projectPath, ".gitignore"), generateGitignore())
  await fs.writeFile(path.join(projectPath, "README.md"), generateReadme(path.basename(projectPath)))
  await fs.writeFile(path.join(projectPath, "s4ft.config.ts"), generateS4FTConfig())

  if (options.typescript !== false) {
    await fs.writeFile(path.join(projectPath, "tsconfig.json"), generateTSConfig())
  }
}

async function generateTemplate(projectPath: string, template: string, options: ProjectOptions): Promise<void> {
  switch (template) {
    case "basic":
      await generateBasicTemplate(projectPath, options)
      break
    case "blog":
      await generateBlogTemplate(projectPath, options)
      break
    case "ecommerce":
      await generateEcommerceTemplate(projectPath, options)
      break
    case "dashboard":
      await generateDashboardTemplate(projectPath, options)
      break
    case "landing":
      await generateLandingTemplate(projectPath, options)
      break
    case "pwa":
      await generatePWATemplate(projectPath, options)
      break
    default:
      await generateBasicTemplate(projectPath, options)
  }
}

async function generateBasicTemplate(projectPath: string, options: ProjectOptions): Promise<void> {
  // Home page
  await fs.writeFile(
    path.join(projectPath, "app", "page.s4ft"),
    `page Home {
  state {
    message: string = "Bem-vindo ao S4FT Framework! 🇧🇷"
  }

  <div className="min-h-screen bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
    <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4 text-center">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">🚀 S4FT</h1>
      <p className="text-gray-600 mb-6">{message}</p>
      
      <div className="space-y-4">
        <div className="bg-gray-50 p-4 rounded">
          <h3 className="font-semibold text-gray-800">Próximos passos:</h3>
          <ul className="text-sm text-gray-600 mt-2 space-y-1 text-left">
            <li>• Edite app/page.s4ft</li>
            <li>• Crie componentes em components/</li>
            <li>• Execute npm run dev</li>
          </ul>
        </div>
        
        <a 
          href="https://s4ft.dev" 
          className="inline-block bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition-colors"
        >
          📚 Documentação
        </a>
      </div>
    </div>
  </div>
}`,
  )

  // Layout
  await fs.writeFile(
    path.join(projectPath, "app", "layout.s4ft"),
    `component RootLayout(props: { children: any }) {
  <html lang="pt-BR">
    <head>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>S4FT App</title>
    </head>
    <body>
      {props.children}
    </body>
  </html>
}`,
  )

  // Basic component
  await fs.writeFile(
    path.join(projectPath, "components", "Button.s4ft"),
    `component Button(props: { 
  text: string, 
  onClick?: function,
  variant?: string 
}) {
  state {
    loading: boolean = false
  }

  event handleClick() {
    if (props.onClick) {
      setLoading(true)
      props.onClick()
      setTimeout(() => setLoading(false), 1000)
    }
  }

  <button 
    onClick={handleClick}
    disabled={loading}
    className={
      "px-4 py-2 rounded font-medium transition-colors " +
      (props.variant === "secondary" 
        ? "bg-gray-200 text-gray-800 hover:bg-gray-300" 
        : "bg-blue-500 text-white hover:bg-blue-600"
      ) +
      (loading ? " opacity-50 cursor-not-allowed" : "")
    }
  >
    {loading ? "Carregando..." : props.text}
  </button>
}`,
  )
}

async function generateBlogTemplate(projectPath: string, options: ProjectOptions): Promise<void> {
  // Blog home page
  await fs.writeFile(
    path.join(projectPath, "app", "page.s4ft"),
    `page BlogHome {
  state {
    posts: array = [
      { id: 1, title: "Primeiro Post", excerpt: "Este é o primeiro post do blog", date: "2024-01-01" },
      { id: 2, title: "Segundo Post", excerpt: "Mais conteúdo interessante", date: "2024-01-02" }
    ]
  }

  <div className="min-h-screen bg-gray-50">
    <header className="bg-white shadow-sm">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold text-gray-900">Meu Blog</h1>
        <p className="text-gray-600 mt-2">Compartilhando conhecimento com S4FT</p>
      </div>
    </header>
    
    <main className="max-w-4xl mx-auto px-4 py-8">
      <div className="grid gap-6">
        {posts.map(post => (
          <article key={post.id} className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-2">{post.title}</h2>
            <p className="text-gray-600 mb-4">{post.excerpt}</p>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-500">{post.date}</span>
              <a href={"/posts/" + post.id} className="text-blue-500 hover:text-blue-600">
                Ler mais →
              </a>
            </div>
          </article>
        ))}
      </div>
    </main>
  </div>
}`,
  )

  // Blog post page
  await fs.ensureDir(path.join(projectPath, "app", "posts", "[id]"))
  await fs.writeFile(
    path.join(projectPath, "app", "posts", "[id]", "page.s4ft"),
    `page BlogPost {
  state {
    post: object = { title: "Post não encontrado", content: "", date: "" },
    loading: boolean = true
  }

  event loadPost() {
    // Simular carregamento do post
    setTimeout(() => {
      setPost({
        title: "Exemplo de Post",
        content: "Este é o conteúdo do post. Aqui você pode escrever sobre qualquer assunto!",
        date: "2024-01-01"
      })
      setLoading(false)
    }, 1000)
  }

  <div className="min-h-screen bg-gray-50">
    <header className="bg-white shadow-sm">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <a href="/" className="text-blue-500 hover:text-blue-600 mb-4 inline-block">← Voltar</a>
        {loading ? (
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          </div>
        ) : (
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{post.title}</h1>
            <p className="text-gray-600 mt-2">{post.date}</p>
          </div>
        )}
      </div>
    </header>
    
    <main className="max-w-4xl mx-auto px-4 py-8">
      <article className="bg-white rounded-lg shadow p-8">
        {loading ? (
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            <div className="h-4 bg-gray-200 rounded w-4/6"></div>
          </div>
        ) : (
          <div className="prose max-w-none">
            <p>{post.content}</p>
          </div>
        )}
      </article>
    </main>
  </div>
}`,
  )
}

async function generateEcommerceTemplate(projectPath: string, options: ProjectOptions): Promise<void> {
  // E-commerce home page
  await fs.writeFile(
    path.join(projectPath, "app", "page.s4ft"),
    `page EcommerceHome {
  state {
    products: array = [
      { id: 1, name: "Produto 1", price: 99.90, image: "/placeholder.jpg" },
      { id: 2, name: "Produto 2", price: 149.90, image: "/placeholder.jpg" },
      { id: 3, name: "Produto 3", price: 199.90, image: "/placeholder.jpg" }
    ],
    cart: array = []
  }

  event addToCart(product) {
    setCart([...cart, product])
    alert("Produto adicionado ao carrinho!")
  }

  <div className="min-h-screen bg-gray-50">
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Minha Loja</h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">Carrinho ({cart.length})</span>
          </div>
        </div>
      </div>
    </header>
    
    <main className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(product => (
          <div key={product.id} className="bg-white rounded-lg shadow overflow-hidden">
            <img src={product.image || "/placeholder.svg"} alt={product.name} className="w-full h-48 object-cover" />
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-900">{product.name}</h3>
              <p className="text-2xl font-bold text-green-600 mt-2">
                R$ {product.price.toFixed(2)}
              </p>
              <button 
                onClick={() => addToCart(product)}
                className="w-full mt-4 bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition-colors"
              >
                Adicionar ao Carrinho
              </button>
            </div>
          </div>
        ))}
      </div>
    </main>
  </div>
}`,
  )
}

async function generateDashboardTemplate(projectPath: string, options: ProjectOptions): Promise<void> {
  // Dashboard page
  await fs.writeFile(
    path.join(projectPath, "app", "page.s4ft"),
    `page Dashboard {
  state {
    stats: object = {
      users: 1234,
      sales: 5678,
      revenue: 12345.67,
      growth: 12.5
    },
    loading: boolean = false
  }

  event refreshData() {
    setLoading(true)
    setTimeout(() => {
      setStats({
        users: Math.floor(Math.random() * 10000),
        sales: Math.floor(Math.random() * 10000),
        revenue: Math.random() * 50000,
        growth: (Math.random() * 30) - 10
      })
      setLoading(false)
    }, 1000)
  }

  <div className="min-h-screen bg-gray-100">
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <button 
            onClick={refreshData}
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? "Atualizando..." : "Atualizar"}
          </button>
        </div>
      </div>
    </header>
    
    <main className="max-w-7xl mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Usuários</h3>
          <p className="text-3xl font-bold text-gray-900">{stats.users.toLocaleString()}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Vendas</h3>
          <p className="text-3xl font-bold text-gray-900">{stats.sales.toLocaleString()}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Receita</h3>
          <p className="text-3xl font-bold text-gray-900">R$ {stats.revenue.toFixed(2)}</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Crescimento</h3>
          <p className={"text-3xl font-bold " + (stats.growth >= 0 ? "text-green-600" : "text-red-600")}>
            {stats.growth >= 0 ? "+" : ""}{stats.growth.toFixed(1)}%
          </p>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Gráfico de Vendas</h2>
        <div className="h-64 bg-gray-100 rounded flex items-center justify-center">
          <p className="text-gray-500">Gráfico será implementado aqui</p>
        </div>
      </div>
    </main>
  </div>
}`,
  )
}

async function generateLandingTemplate(projectPath: string, options: ProjectOptions): Promise<void> {
  // Landing page
  await fs.writeFile(
    path.join(projectPath, "app", "page.s4ft"),
    `page LandingPage {
  state {
    email: string = "",
    subscribed: boolean = false
  }

  event handleSubscribe() {
    if (email.trim()) {
      setSubscribed(true)
      setEmail("")
      alert("Obrigado por se inscrever!")
    }
  }

  <div className="min-h-screen bg-white">
    {/* Hero Section */}
    <section className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
      <div className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-6">
            Bem-vindo ao Futuro
          </h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Descubra como nossa solução pode transformar seu negócio e 
            levar sua empresa para o próximo nível.
          </p>
          <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors">
            Começar Agora
          </button>
        </div>
      </div>
    </section>

    {/* Features Section */}
    <section className="py-20">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Por que escolher nossa solução?
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🚀</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Rápido</h3>
            <p className="text-gray-600">Performance otimizada para resultados instantâneos</p>
          </div>
          
          <div className="text-center">
            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🔒</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Seguro</h3>
            <p className="text-gray-600">Máxima segurança para seus dados</p>
          </div>
          
          <div className="text-center">
            <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">💡</span>
            </div>
            <h3 className="text-xl font-semibold mb-2">Inteligente</h3>
            <p className="text-gray-600">IA integrada para melhores decisões</p>
          </div>
        </div>
      </div>
    </section>

    {/* Newsletter Section */}
    <section className="bg-gray-50 py-20">
      <div className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Fique por dentro das novidades
        </h2>
        <p className="text-gray-600 mb-8">
          Receba atualizações exclusivas e conteúdo premium diretamente no seu email.
        </p>
        
        {!subscribed ? (
          <div className="flex max-w-md mx-auto">
            <input 
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Seu melhor email"
              className="flex-1 px-4 py-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button 
              onClick={handleSubscribe}
              className="bg-blue-600 text-white px-6 py-3 rounded-r-lg hover:bg-blue-700 transition-colors"
            >
              Inscrever
            </button>
          </div>
        ) : (
          <div className="bg-green-100 text-green-800 px-6 py-3 rounded-lg inline-block">
            ✅ Obrigado! Você foi inscrito com sucesso.
          </div>
        )}
      </div>
    </section>

    {/* Footer */}
    <footer className="bg-gray-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <p>&copy; 2024 Minha Empresa. Todos os direitos reservados.</p>
        <p className="text-gray-400 mt-2">Feito com ❤️ usando S4FT Framework</p>
      </div>
    </footer>
  </div>
}`,
  )
}

async function generatePWATemplate(projectPath: string, options: ProjectOptions): Promise<void> {
  // PWA home page
  await fs.writeFile(
    path.join(projectPath, "app", "page.s4ft"),
    `page PWAHome {
  state {
    isOnline: boolean = true,
    installPrompt: object = null
  }

  event handleInstall() {
    if (installPrompt) {
      installPrompt.prompt()
    }
  }

  <div className="min-h-screen bg-gray-50">
    <header className="bg-blue-600 text-white">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Meu PWA</h1>
          <div className="flex items-center space-x-2">
            <span className={"w-3 h-3 rounded-full " + (isOnline ? "bg-green-400" : "bg-red-400")}></span>
            <span className="text-sm">{isOnline ? "Online" : "Offline"}</span>
          </div>
        </div>
      </div>
    </header>
    
    <main className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Progressive Web App</h2>
        <p className="text-gray-600 mb-4">
          Este é um exemplo de PWA criado com S4FT Framework. 
          Funciona offline e pode ser instalado como um app nativo!
        </p>
        
        {installPrompt && (
          <button 
            onClick={handleInstall}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            📱 Instalar App
          </button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">🔄 Funciona Offline</h3>
          <p className="text-gray-600">Acesse o conteúdo mesmo sem internet</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">📱 Instalável</h3>
          <p className="text-gray-600">Instale como um app nativo</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">⚡ Rápido</h3>
          <p className="text-gray-600">Carregamento instantâneo</p>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">🔔 Notificações</h3>
          <p className="text-gray-600">Push notifications integradas</p>
        </div>
      </div>
    </main>
  </div>
}`,
  )

  // Service Worker
  await fs.writeFile(
    path.join(projectPath, "public", "sw.js"),
    `const CACHE_NAME = 'pwa-cache-v1'
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json'
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .  (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache)
      })
  )
})

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        if (response) {
          return response
        }
        return fetch(event.request)
      })
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
})`,
  )

  // PWA Manifest
  await fs.writeFile(
    path.join(projectPath, "public", "manifest.json"),
    JSON.stringify(
      {
        name: "Meu PWA",
        short_name: "PWA",
        description: "Progressive Web App criado com S4FT",
        start_url: "/",
        display: "standalone",
        background_color: "#ffffff",
        theme_color: "#2563eb",
        icons: [
          {
            src: "/icon-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "/icon-512.png",
            sizes: "512x512",
            type: "image/png",
          },
        ],
      },
      null,
      2,
    ),
  )
}

async function addFeatures(projectPath: string, features: string[]): Promise<void> {
  for (const feature of features) {
    switch (feature) {
      case "auth":
        await addAuthFeature(projectPath)
        break
      case "database":
        await addDatabaseFeature(projectPath)
        break
      case "payments":
        await addPaymentsFeature(projectPath)
        break
      case "email":
        await addEmailFeature(projectPath)
        break
      case "i18n":
        await addI18nFeature(projectPath)
        break
      case "analytics":
        await addAnalyticsFeature(projectPath)
        break
      case "darkmode":
        await addDarkModeFeature(projectPath)
        break
      case "pwa":
        await addPWAFeature(projectPath)
        break
    }
  }
}

async function addAuthFeature(projectPath: string): Promise<void> {
  // Auth component
  await fs.writeFile(
    path.join(projectPath, "components", "Auth.s4ft"),
    `component Auth {
  state {
    user: object = null,
    email: string = "",
    password: string = "",
    loading: boolean = false,
    mode: string = "login"
  }

  event handleLogin() {
    setLoading(true)
    // Simular login
    setTimeout(() => {
      setUser({ email, name: "Usuário" })
      setLoading(false)
    }, 1000)
  }

  event handleLogout() {
    setUser(null)
    setEmail("")
    setPassword("")
  }

  event toggleMode() {
    setMode(mode === "login" ? "register" : "login")
  }

  {user ? (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-bold mb-4">Bem-vindo, {user.name}!</h2>
      <button 
        onClick={handleLogout}
        className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Sair
      </button>
    </div>
  ) : (
    <div className="bg-white rounded-lg shadow p-6 max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">
        {mode === "login" ? "Entrar" : "Cadastrar"}
      </h2>
      
      <div className="space-y-4">
        <input 
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        
        <input 
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Senha"
          className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        
        <button 
          onClick={handleLogin}
          disabled={loading || !email || !password}
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? "Carregando..." : (mode === "login" ? "Entrar" : "Cadastrar")}
        </button>
        
        <button 
          onClick={toggleMode}
          className="w-full text-blue-500 hover:text-blue-600"
        >
          {mode === "login" ? "Não tem conta? Cadastre-se" : "Já tem conta? Entre"}
        </button>
      </div>
    </div>
  )}
}`,
  )
}

async function addDatabaseFeature(projectPath: string): Promise<void> {
  // Database utility
  await fs.writeFile(
    path.join(projectPath, "lib", "database.ts"),
    `import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseKey)

// Database helpers
export async function getUsers() {
  const { data, error } = await supabase
    .from('users')
    .select('*')
  
  if (error) throw error
  return data
}

export async function createUser(user: any) {
  const { data, error } = await supabase
    .from('users')
    .insert([user])
    .select()
  
  if (error) throw error
  return data[0]
}

export async function updateUser(id: string, updates: any) {
  const { data, error } = await supabase
    .from('users')
    .update(updates)
    .eq('id', id)
    .select()
  
  if (error) throw error
  return data[0]
}

export async function deleteUser(id: string) {
  const { error } = await supabase
    .from('users')
    .delete()
    .eq('id', id)
  
  if (error) throw error
}`,
  )
}

async function addPaymentsFeature(projectPath: string): Promise<void> {
  // Payments component
  await fs.writeFile(
    path.join(projectPath, "components", "Checkout.s4ft"),
    `component Checkout(props: { amount: number, onSuccess?: function }) {
  state {
    loading: boolean = false,
    cardNumber: string = "",
    expiryDate: string = "",
    cvv: string = ""
  }

  event handlePayment() {
    setLoading(true)
    
    // Simular processamento de pagamento
    setTimeout(() => {
      setLoading(false)
      if (props.onSuccess) {
        props.onSuccess()
      }
      alert("Pagamento processado com sucesso!")
    }, 2000)
  }

  <div className="bg-white rounded-lg shadow p-6 max-w-md mx-auto">
    <h2 className="text-xl font-bold mb-4">Finalizar Compra</h2>
    
    <div className="mb-4">
      <p className="text-2xl font-bold text-green-600">
        R$ {props.amount.toFixed(2)}
      </p>
    </div>
    
    <div className="space-y-4">
      <input 
        type="text"
        value={cardNumber}
        onChange={(e) => setCardNumber(e.target.value)}
        placeholder="Número do cartão"
        className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      
      <div className="grid grid-cols-2 gap-4">
        <input 
          type="text"
          value={expiryDate}
          onChange={(e) => setExpiryDate(e.target.value)}
          placeholder="MM/AA"
          className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        
        <input 
          type="text"
          value={cvv}
          onChange={(e) => setCvv(e.target.value)}
          placeholder="CVV"
          className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      
      <button 
        onClick={handlePayment}
        disabled={loading || !cardNumber || !expiryDate || !cvv}
        className="w-full bg-green-500 text-white py-3 rounded font-semibold hover:bg-green-600 disabled:opacity-50"
      >
        {loading ? "Processando..." : "Pagar Agora"}
      </button>
    </div>
    
    <p className="text-xs text-gray-500 mt-4 text-center">
      🔒 Pagamento seguro e criptografado
    </p>
  </div>
}`,
  )
}

async function addEmailFeature(projectPath: string): Promise<void> {
  // Email utility
  await fs.writeFile(
    path.join(projectPath, "lib", "email.ts"),
    `import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendEmail({
  to,
  subject,
  html,
  from = 'noreply@example.com'
}: {
  to: string
  subject: string
  html: string
  from?: string
}) {
  try {
    const { data, error } = await resend.emails.send({
      from,
      to,
      subject,
      html,
    })

    if (error) {
      throw error
    }

    return data
  } catch (error) {
    console.error('Email error:', error)
    throw error
  }
}

export async function sendWelcomeEmail(email: string, name: string) {
  return sendEmail({
    to: email,
    subject: 'Bem-vindo!',
    html: \`
      <h1>Olá, \${name}!</h1>
      <p>Bem-vindo à nossa plataforma!</p>
      <p>Estamos muito felizes em tê-lo conosco.</p>
    \`
  })
}

export async function sendPasswordResetEmail(email: string, resetLink: string) {
  return sendEmail({
    to: email,
    subject: 'Redefinir senha',
    html: \`
      <h1>Redefinir sua senha</h1>
      <p>Clique no link abaixo para redefinir sua senha:</p>
      <a href="\${resetLink}">Redefinir senha</a>
      <p>Se você não solicitou isso, ignore este email.</p>
    \`
  })
}`,
  )
}

async function addI18nFeature(projectPath: string): Promise<void> {
  // i18n configuration
  await fs.writeFile(
    path.join(projectPath, "lib", "i18n.ts"),
    `import { createI18n } from '../src/i18n/i18n'

export const i18n = createI18n({
  locale: 'pt-BR',
  fallbackLocale: 'en',
  messages: {
    'pt-BR': {
      welcome: 'Bem-vindo',
      hello: 'Olá, {name}!',
      loading: 'Carregando...',
      save: 'Salvar',
      cancel: 'Cancelar',
      delete: 'Excluir',
      edit: 'Editar',
      create: 'Criar',
      update: 'Atualizar'
    },
    'en': {
      welcome: 'Welcome',
      hello: 'Hello, {name}!',
      loading: 'Loading...',
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      create: 'Create',
      update: 'Update'
    },
    'es': {
      welcome: 'Bienvenido',
      hello: '¡Hola, {name}!',
      loading: 'Cargando...',
      save: 'Guardar',
      cancel: 'Cancelar',
      delete: 'Eliminar',
      edit: 'Editar',
      create: 'Crear',
      update: 'Actualizar'
    }
  }
})

export const t = i18n.t.bind(i18n)
export const setLocale = i18n.setLocale.bind(i18n)
export const getLocale = i18n.getLocale.bind(i18n)`,
  )
}

async function addAnalyticsFeature(projectPath: string): Promise<void> {
  // Analytics utility
  await fs.writeFile(
    path.join(projectPath, "lib", "analytics.ts"),
    `declare global {
  interface Window {
    gtag: (...args: any[]) => void
  }
}

export function trackEvent(eventName: string, parameters?: Record<string, any>) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, parameters)
  }
  
  console.log('📊 Analytics Event:', eventName, parameters)
}

export function trackPageView(url: string) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', process.env.NEXT_PUBLIC_GA_ID, {
      page_path: url,
    })
  }
  
  console.log('📊 Page View:', url)
}

export function trackPurchase(transactionId: string, value: number, currency = 'BRL') {
  trackEvent('purchase', {
    transaction_id: transactionId,
    value,
    currency,
  })
}

export function trackSignUp(method: string) {
  trackEvent('sign_up', {
    method,
  })
}

export function trackLogin(method: string) {
  trackEvent('login', {
    method,
  })
}`,
  )
}

async function addDarkModeFeature(projectPath: string): Promise<void> {
  // Dark mode component
  await fs.writeFile(
    path.join(projectPath, "components", "ThemeToggle.s4ft"),
    `component ThemeToggle {
  state {
    isDark: boolean = false
  }

  event toggleTheme() {
    setIsDark(!isDark)
    
    if (typeof document !== 'undefined') {
      if (!isDark) {
        document.documentElement.classList.add('dark')
        localStorage.setItem('theme', 'dark')
      } else {
        document.documentElement.classList.remove('dark')
        localStorage.setItem('theme', 'light')
      }
    }
  }

  <button 
    onClick={toggleTheme}
    className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
    title={isDark ? "Modo claro" : "Modo escuro"}
  >
    {isDark ? "☀️" : "🌙"}
  </button>
}`,
  )
}

async function addPWAFeature(projectPath: string): Promise<void> {
  // Already implemented in generatePWATemplate
  console.log("PWA feature added")
}

async function generatePackageJson(projectPath: string, name: string, options: ProjectOptions): Promise<void> {
  const packageJson = {
    name: name.toLowerCase().replace(/\s+/g, "-"),
    version: "0.1.0",
    private: true,
    scripts: {
      dev: "s4ft dev",
      build: "s4ft build",
      start: "s4ft start",
      lint: "eslint . --ext .ts,.tsx,.s4ft",
      "lint:fix": "eslint . --ext .ts,.tsx,.s4ft --fix",
      test: "jest",
      "test:watch": "jest --watch",
      "type-check": "tsc --noEmit",
    },
    dependencies: {
      "s4ft-framework": "^1.0.0",
      react: "^18.2.0",
      "react-dom": "^18.2.0",
      next: "^14.0.0",
    },
    devDependencies: {},
  }

  // Add TypeScript dependencies
  if (options.typescript !== false) {
    packageJson.devDependencies = {
      ...packageJson.devDependencies,
      typescript: "^5.0.0",
      "@types/react": "^18.0.0",
      "@types/react-dom": "^18.0.0",
      "@types/node": "^20.0.0",
    }
  }

  // Add Tailwind CSS
  if (options.tailwind !== false) {
    packageJson.devDependencies = {
      ...packageJson.devDependencies,
      tailwindcss: "^3.0.0",
      autoprefixer: "^10.0.0",
      postcss: "^8.0.0",
    }
  }

  // Add ESLint
  if (options.eslint !== false) {
    packageJson.devDependencies = {
      ...packageJson.devDependencies,
      eslint: "^8.0.0",
      "eslint-config-next": "^14.0.0",
      "@typescript-eslint/eslint-plugin": "^6.0.0",
      "@typescript-eslint/parser": "^6.0.0",
    }
  }

  // Add feature-specific dependencies
  if (options.features?.includes("database")) {
    packageJson.dependencies = {
      ...packageJson.dependencies,
      "@supabase/supabase-js": "^2.0.0",
    }
  }

  if (options.features?.includes("payments")) {
    packageJson.dependencies = {
      ...packageJson.dependencies,
      stripe: "^14.0.0",
    }
  }

  if (options.features?.includes("email")) {
    packageJson.dependencies = {
      ...packageJson.dependencies,
      resend: "^2.0.0",
    }
  }

  await fs.writeFile(path.join(projectPath, "package.json"), JSON.stringify(packageJson, null, 2))
}

async function generateConfigFiles(projectPath: string, options: ProjectOptions): Promise<void> {
  // Tailwind config
  if (options.tailwind !== false) {
    await fs.writeFile(
      path.join(projectPath, "tailwind.config.js"),
      `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,s4ft}',
    './components/**/*.{js,ts,jsx,tsx,s4ft}',
    './pages/**/*.{js,ts,jsx,tsx,s4ft}',
  ],
  darkMode: 'class',
  theme: {
    extend: {},
  },
  plugins: [],
}`,
    )

    await fs.writeFile(
      path.join(projectPath, "postcss.config.js"),
      `module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}`,
    )
  }

  // ESLint config
  if (options.eslint !== false) {
    await fs.writeFile(
      path.join(projectPath, ".eslintrc.json"),
      JSON.stringify(
        {
          extends: ["next/core-web-vitals", "@typescript-eslint/recommended"],
          parser: "@typescript-eslint/parser",
          plugins: ["@typescript-eslint"],
          rules: {
            "@typescript-eslint/no-unused-vars": "error",
            "@typescript-eslint/no-explicit-any": "warn",
          },
        },
        null,
        2,
      ),
    )
  }

  // Environment variables template
  await fs.writeFile(
    path.join(projectPath, ".env.example"),
    `# S4FT Framework Environment Variables

# Database (Supabase)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Email (Resend)
RESEND_API_KEY=your_resend_api_key

# Payments (Stripe)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key

# Analytics (Google Analytics)
NEXT_PUBLIC_GA_ID=your_google_analytics_id

# Other
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
`,
  )
}

async function initializeGit(projectPath: string): Promise<void> {
  try {
    execSync("git init", { cwd: projectPath, stdio: "ignore" })
    execSync("git add .", { cwd: projectPath, stdio: "ignore" })
    execSync('git commit -m "Initial commit with S4FT Framework"', { cwd: projectPath, stdio: "ignore" })
    console.log(chalk.green("✅ Repositório Git inicializado"))
  } catch (error) {
    console.log(chalk.yellow("⚠️ Não foi possível inicializar o Git"))
  }
}

function generateGitignore(): string {
  return `# Dependencies
node_modules/
.pnp
.pnp.js

# Testing
coverage/

# Next.js
.next/
out/

# Production
build/
dist/

# Misc
.DS_Store
*.tsbuildinfo
next-env.d.ts

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Local env files
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Vercel
.vercel

# S4FT
.s4ft/
*.s4ft.cache
`
}

function generateReadme(projectName: string): string {
  return `# ${projectName}

Projeto criado com [S4FT Framework](https://s4ft.dev) 🇧🇷

## 🚀 Como usar

### Desenvolvimento

\`\`\`bash
npm install
npm run dev
\`\`\`

### Build

\`\`\`bash
npm run build
\`\`\`

### Deploy

\`\`\`bash
npm run deploy
\`\`\`

## 📁 Estrutura do projeto

\`\`\`
${projectName}/
├── app/                 # Páginas da aplicação
├── components/          # Componentes reutilizáveis
├── lib/                 # Utilitários e configurações
├── public/              # Arquivos estáticos
├── styles/              # Estilos globais
└── s4ft.config.ts       # Configuração do S4FT
\`\`\`

## 📚 Documentação

- [S4FT Framework](https://s4ft.dev)
- [Guia de início rápido](https://s4ft.dev/docs/getting-started)
- [API Reference](https://s4ft.dev/docs/api)

## 🤝 Contribuindo

Contribuições são bem-vindas! Veja nosso [guia de contribuição](https://github.com/s4ft/s4ft/blob/main/CONTRIBUTING.md).

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

Feito com ❤️ usando S4FT Framework 🇧🇷
`
}

function generateS4FTConfig(): string {
  return `import { defineConfig } from 's4ft-framework'

export default defineConfig({
  // Configurações do S4FT Framework
  
  // Diretórios
  srcDir: 'app',
  componentsDir: 'components',
  publicDir: 'public',
  
  // Build
  build: {
    outDir: 'dist',
    target: 'es2020',
    minify: true,
    sourcemap: true,
  },
  
  // Desenvolvimento
  dev: {
    port: 3000,
    host: 'localhost',
    open: true,
    hotReload: true,
  },
  
  // SSR/SSG
  ssr: {
    enabled: true,
    prerender: ['/'],
  },
  
  // Plugins
  plugins: [
    // 'auth',
    // 'theme',
    // 'analytics',
  ],
  
  // Roteamento
  router: {
    mode: 'history',
    base: '/',
    trailingSlash: false,
  },
  
  // SEO
  seo: {
    title: 'S4FT App',
    description: 'Aplicação criada com S4FT Framework',
    keywords: ['s4ft', 'framework', 'react', 'typescript'],
  },
  
  // PWA
  pwa: {
    enabled: false,
    name: 'S4FT App',
    shortName: 'S4FT',
    description: 'Progressive Web App com S4FT',
    themeColor: '#2563eb',
    backgroundColor: '#ffffff',
  },
})
`
}

function generateTSConfig(): string {
  return JSON.stringify(
    {
      compilerOptions: {
        target: "es5",
        lib: ["dom", "dom.iterable", "es6"],
        allowJs: true,
        skipLibCheck: true,
        strict: true,
        forceConsistentCasingInFileNames: true,
        noEmit: true,
        esModuleInterop: true,
        module: "esnext",
        moduleResolution: "node",
        resolveJsonModule: true,
        isolatedModules: true,
        jsx: "preserve",
        incremental: true,
        plugins: [
          {
            name: "next",
          },
        ],
        baseUrl: ".",
        paths: {
          "@/*": ["./*"],
          "@/components/*": ["./components/*"],
          "@/lib/*": ["./lib/*"],
          "@/utils/*": ["./utils/*"],
          "@/types/*": ["./types/*"],
        },
      },
      include: ["next-env.d.ts", "**/*.ts", "**/*.tsx", "**/*.s4ft", ".next/types/**/*.ts"],
      exclude: ["node_modules"],
    },
    null,
    2,
  )
}

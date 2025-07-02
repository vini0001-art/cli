"use client";
import fs from "fs-extra";
import path from "path";
import chalk from "chalk";
export async function createProject(name, template = "basic") {
    const projectPath = path.join(process.cwd(), name);
    // Verificar se o diretório já existe
    if (await fs.pathExists(projectPath)) {
        throw new Error(`Diretório ${name} já existe`);
    }
    console.log(chalk.blue(`📁 Criando estrutura do projeto...`));
    // Criar estrutura de diretórios
    await fs.ensureDir(projectPath);
    await fs.ensureDir(path.join(projectPath, "app"));
    await fs.ensureDir(path.join(projectPath, "components"));
    await fs.ensureDir(path.join(projectPath, "public"));
    await fs.ensureDir(path.join(projectPath, "styles"));
    // Gerar arquivos baseados no template
    await generateTemplateFiles(projectPath, template, name);
    console.log(chalk.green(`✅ Projeto ${name} criado com sucesso!`));
}
async function generateTemplateFiles(projectPath, template, projectName) {
    // package.json
    const packageJson = {
        name: projectName,
        version: "1.0.0",
        description: `Projeto S4FT - ${projectName}`,
        main: "index.js",
        scripts: {
            dev: "s4ft dev",
            build: "s4ft build",
            start: "s4ft start",
            lint: "s4ft lint",
        },
        dependencies: {
            s4ft: "^1.0.0",
            react: "^18.0.0",
            "react-dom": "^18.0.0",
            typescript: "^5.0.0",
        },
        devDependencies: {
            "@types/node": "^20.0.0",
            "@types/react": "^18.0.0",
            "@types/react-dom": "^18.0.0",
            tailwindcss: "^3.0.0",
            autoprefixer: "^10.0.0",
            postcss: "^8.0.0",
        },
    };
    await fs.writeJson(path.join(projectPath, "package.json"), packageJson, { spaces: 2 });
    // tsconfig.json
    const tsConfig = {
        compilerOptions: {
            target: "es5",
            lib: ["dom", "dom.iterable", "es6"],
            allowJs: true,
            skipLibCheck: true,
            strict: true,
            forceConsistentCasingInFileNames: true,
            noEmit: true,
            esModuleInterop: true,
            module: "ess4ft",
            moduleResolution: "bundler",
            resolveJsonModule: true,
            isolatedModules: true,
            jsx: "preserve",
            incremental: true,
            plugins: [{ name: "s4ft" }],
            baseUrl: ".",
            paths: {
                "@/*": ["./*"],
            },
        },
        include: ["s4ft-env.d.ts", "**/*.ts", "**/*.tsx", ".s4ft/types/**/*.ts"],
        exclude: ["node_modules"],
    };
    await fs.writeJson(path.join(projectPath, "tsconfig.json"), tsConfig, { spaces: 2 });
    // tailwind.config.js
    const tailwindConfig = `/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        's4ft': {
          50: '#f0f9ff',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        }
      }
    },
  },
  plugins: [],
}`;
    await fs.writeFile(path.join(projectPath, "tailwind.config.js"), tailwindConfig);
    // s4ft.config.mjs
    const s4ftConfigMjs = `/** @type {{ experimental: object }} */\nconst s4ftConfig = {\n  experimental: {\n    appDir: true,\n  },\n}\n\nexport default s4ftConfig`;
    await fs.writeFile(path.join(projectPath, "s4ft.config.mjs"), s4ftConfigMjs);
    // s4ft.config.ts
    const s4ftConfigTs = `// Exemplo de configuração S4FT em TypeScript\nexport const config = {\n  framework: 's4ft',\n  typescript: true,\n  tailwind: true,\n  hotReload: true,\n  build: {\n    outDir: 'dist',\n    minify: true,\n    sourcemap: true\n  },\n  dev: {\n    port: 3000,\n    host: 'localhost'\n  }\n}`;
    await fs.writeFile(path.join(projectPath, "s4ft.config.ts"), s4ftConfigTs);
    // Gerar arquivos específicos do template
    switch (template) {
        case "basic":
            await generateBasicTemplate(projectPath, projectName);
            break;
        case "blog":
            await generateBlogTemplate(projectPath, projectName);
            break;
        case "ecommerce":
            await generateEcommerceTemplate(projectPath, projectName);
            break;
        case "dashboard":
            await generateDashboardTemplate(projectPath, projectName);
            break;
        default:
            await generateBasicTemplate(projectPath, projectName);
    }
    // README.md
    const readme = `# ${projectName}

Projeto criado com S4FT Framework 🇧🇷

## 🚀 Como usar

\`\`\`bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev

# Build para produção
npm run build
\`\`\`

## 📁 Estrutura

- \`app/\` - Páginas da aplicação (.s4ft)
- \`components/\` - Componentes reutilizáveis (.s4ft)
- \`public/\` - Arquivos estáticos
- \`styles/\` - Estilos globais

## 🌟 Recursos S4FT

- ✅ Sintaxe declarativa
- ✅ Hot reload automático
- ✅ TypeScript nativo
- ✅ Tailwind CSS
- ✅ Build otimizado

## 📚 Documentação

- [S4FT Docs](https://s4ft.dev)
- [GitHub](https://github.com/s4ft/s4ft)

---

Feito com ❤️ usando S4FT Framework
`;
    await fs.writeFile(path.join(projectPath, "README.md"), readme);
}
async function generateBasicTemplate(projectPath, projectName) {
    // app/page.s4ft
    const mainPage = `page Home {
  state {
    title: string = "Bem-vindo ao ${projectName}!",
    count: number = 0,
    message: string = "Projeto criado com S4FT Framework 🇧🇷"
  }
  
  event increment() {
    setCount(count + 1)
  }
  
  event decrement() {
    setCount(count - 1)
  }
  
  <div className="min-h-screen bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center p-4">
    <div className="bg-white rounded-xl shadow-2xl p-8 max-w-md w-full text-center">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">{title}</h1>
      <p className="text-gray-600 mb-6">{message}</p>
      
      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Contador</h2>
        <div className="text-4xl font-bold text-blue-600 mb-4">{count}</div>
        <div className="flex gap-4 justify-center">
          <button 
            onClick={decrement}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-colors"
          >
            -1
          </button>
          <button 
            onClick={increment}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition-colors"
          >
            +1
          </button>
        </div>
      </div>
      
      <div className="text-sm text-gray-500">
        <p>🚀 Powered by S4FT Framework</p>
        <p>🇧🇷 Made in Brazil</p>
      </div>
    </div>
  </div>
}`;
    await fs.writeFile(path.join(projectPath, "app", "page.s4ft"), mainPage);
    // components/Button.s4ft
    const buttonComponent = `component Button(props: {
  children: string,
  onClick?: () => void,
  variant?: string,
  disabled?: boolean
}) {
  state {
    isPressed: boolean = false
  }
  
  event handleClick() {
    if (!props.disabled && props.onClick) {
      setIsPressed(true)
      props.onClick()
      setTimeout(() => setIsPressed(false), 150)
    }
  }
  
  <button
    onClick={handleClick}
    disabled={props.disabled}
    className={
      "px-4 py-2 rounded font-medium transition-all duration-150 " +
      (props.variant === "primary" ? "bg-blue-500 hover:bg-blue-600 text-white " : "") +
      (props.variant === "secondary" ? "bg-gray-500 hover:bg-gray-600 text-white " : "") +
      (props.disabled ? "opacity-50 cursor-not-allowed " : "cursor-pointer ") +
      (isPressed ? "scale-95 " : "")
    }
  >
    {props.children}
  </button>
}`;
    await fs.writeFile(path.join(projectPath, "components", "Button.s4ft"), buttonComponent);
}
async function generateBlogTemplate(projectPath, projectName) {
    // app/page.s4ft - Blog home
    const blogHome = `page BlogHome {
  state {
    posts: array = [
      {
        id: 1,
        title: "Primeiro Post do Blog",
        excerpt: "Este é o primeiro post do seu novo blog criado com S4FT!",
        date: "2024-01-01",
        author: "S4FT Team"
      },
      {
        id: 2,
        title: "Como usar S4FT Framework",
        excerpt: "Aprenda a criar sites incríveis com a sintaxe declarativa do S4FT.",
        date: "2024-01-02", 
        author: "Dev Brasileiro"
      }
    ],
    loading: boolean = false
  }
  
  <div className="min-h-screen bg-gray-50">
    <header className="bg-white shadow-sm">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold text-gray-900">${projectName}</h1>
        <p className="text-gray-600 mt-2">Blog criado com S4FT Framework 🇧🇷</p>
      </div>
    </header>
    
    <main className="max-w-4xl mx-auto px-4 py-8">
      <div className="grid gap-6">
        {posts.map(post => (
          <article key={post.id} className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{post.title}</h2>
            <div className="text-sm text-gray-500 mb-4">
              Por {post.author} • {post.date}
            </div>
            <p className="text-gray-700 mb-4">{post.excerpt}</p>
            <a href="#" className="text-blue-600 hover:text-blue-800 font-medium">
              Ler mais →
            </a>
          </article>
        ))}
      </div>
    </main>
  </div>
}`;
    await fs.writeFile(path.join(projectPath, "app", "page.s4ft"), blogHome);
}
async function generateEcommerceTemplate(projectPath, projectName) {
    // app/page.s4ft - E-commerce home
    const ecommercePage = `page EcommerceHome {
  state {
    products: array = [
      {
        id: 1,
        name: "Produto Incrível",
        price: 99.90,
        image: "/placeholder.jpg",
        description: "Um produto fantástico para você!"
      },
      {
        id: 2,
        name: "Super Produto",
        price: 149.90,
        image: "/placeholder.jpg", 
        description: "O melhor produto da categoria!"
      }
    ],
    cart: array = [],
    cartTotal: number = 0
  }
  
  event addToCart(product) {
    setCart([...cart, product])
    setCartTotal(cartTotal + product.price)
  }
  
  <div className="min-h-screen bg-gray-50">
    <header className="bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">${projectName}</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-600">Carrinho: {cart.length} itens</span>
          <span className="font-bold text-green-600">R$ {cartTotal.toFixed(2)}</span>
        </div>
      </div>
    </header>
    
    <main className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-8">Produtos em Destaque</h2>
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(product => (
          <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <img 
              src={product.image || "/placeholder.svg"} 
              alt={product.name}
              className="w-full h-48 object-cover bg-gray-200"
            />
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{product.name}</h3>
              <p className="text-gray-600 mb-4">{product.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-2xl font-bold text-green-600">
                  R$ {product.price.toFixed(2)}
                </span>
                <button 
                  onClick={() => addToCart(product)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors"
                >
                  Adicionar ao Carrinho
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </main>
  </div>
}`;
    await fs.writeFile(path.join(projectPath, "app", "page.s4ft"), ecommercePage);
}
async function generateDashboardTemplate(projectPath, projectName) {
    // app/page.s4ft - Dashboard
    const dashboardPage = `page Dashboard {
  state {
    stats: object = {
      users: 1234,
      sales: 5678,
      revenue: 12345.67,
      growth: 15.5
    },
    recentActivity: array = [
      { id: 1, action: "Novo usuário cadastrado", time: "2 min atrás" },
      { id: 2, action: "Venda realizada", time: "5 min atrás" },
      { id: 3, action: "Produto adicionado", time: "10 min atrás" }
    ]
  }
  
  <div className="min-h-screen bg-gray-100">
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <h1 className="text-2xl font-bold text-gray-900">${projectName} - Dashboard</h1>
      </div>
    </header>
    
    <main className="max-w-7xl mx-auto px-4 py-8">
      {/* Stats Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
          <p className="text-3xl font-bold text-green-600">R$ {stats.revenue.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-sm font-medium text-gray-500">Crescimento</h3>
          <p className="text-3xl font-bold text-blue-600">{stats.growth}%</p>
        </div>
      </div>
      
      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Atividade Recente</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {recentActivity.map(activity => (
              <div key={activity.id} className="flex justify-between items-center py-2">
                <span className="text-gray-900">{activity.action}</span>
                <span className="text-sm text-gray-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  </div>
}`;
    await fs.writeFile(path.join(projectPath, "app", "page.s4ft"), dashboardPage);
}

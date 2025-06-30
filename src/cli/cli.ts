"use client"

import { Command } from "commander"
import chalk from "chalk"
import ora from "ora"
import fs from "fs-extra"
import path from "path"
import { DevServer } from "../dev-server/dev-server.js"
import { Builder } from "../build/builder.js"
import { Transpiler } from "../transpiler/transpiler.js"
import { interactiveCreate, showNextSteps } from "./interactive-cli.js"
import type { ProjectConfig } from "./interactive-cli.js"

const program = new Command()

program.name("s4ft").description("s4ft - A declarative web development framework").version("1.0.0")

program
  .command("create [project-name]")
  .description("Create a new s4ft project")
  .option("--template <template>", "Project template")
  .option("--no-interactive", "Skip interactive prompts")
  .action(async (projectName: string, options) => {
    try {
      let config: ProjectConfig

      if (options.interactive !== false) {
        config = await interactiveCreate(projectName)
      } else {
        config = {
          name: projectName || "my-s4ft-app",
          language: "en",
          template: options.template || "basic",
          features: [],
          auth: undefined,
          database: undefined,
          styling: "tailwind",
          packageManager: "npm",
        }
      }

      const spinner = ora("Creating s4ft project...").start()
      await createProject(config)
      spinner.succeed()

      showNextSteps(config)
    } catch (error) {
      console.error(chalk.red("❌ Failed to create project"))
      console.error(error)
      process.exit(1)
    }
  })

program
  .command("dev")
  .description("Start development server")
  .option("-p, --port <port>", "Port to run on", "3000")
  .action(async (options) => {
    const port = Number.parseInt(options.port)
    const projectRoot = process.cwd()
    const appDir = path.join(projectRoot, "app")

    if (!(await fs.pathExists(appDir))) {
      console.error(chalk.red("❌ No app directory found. Make sure you're in a s4ft project."))
      process.exit(1)
    }

    const devServer = new DevServer({
      port,
      projectRoot,
      appDir,
    })

    try {
      await devServer.start()
    } catch (error) {
      console.error(chalk.red("❌ Failed to start dev server:"), error)
      process.exit(1)
    }
  })

program
  .command("build")
  .description("Build for production")
  .option("-o, --output <dir>", "Output directory", "dist")
  .option("--no-minify", "Disable minification")
  .option("--source-maps", "Generate source maps")
  .action(async (options) => {
    const projectRoot = process.cwd()
    const appDir = path.join(projectRoot, "app")
    const outputDir = path.join(projectRoot, options.output)

    if (!(await fs.pathExists(appDir))) {
      console.error(chalk.red("❌ No app directory found. Make sure you're in a s4ft project."))
      process.exit(1)
    }

    const transpiler = new Transpiler()
    const builder = new Builder(transpiler, {
      minify: options.minify !== false,
      sourceMaps: !!options.sourceMaps,
    })

    try {
      await builder.run()
    } catch (error) {
      console.error(chalk.red("❌ Build failed:"), error)
      process.exit(1)
    }
  })

program
  .command("serve")
  .description("Serve production build")
  .option("-p, --port <port>", "Port to run on", "3000")
  .option("-d, --dir <dir>", "Build directory", "dist")
  .action(async (options) => {
    const express = require("express")
    const path = require("path")

    const app = express()
    const port = Number.parseInt(options.port)
    const buildDir = path.join(process.cwd(), options.dir)

    if (!(await fs.pathExists(buildDir))) {
      console.error(chalk.red(`❌ Build directory not found: ${buildDir}`))
      console.log(chalk.gray('Run "s4ft build" first'))
      process.exit(1)
    }

    app.use(express.static(buildDir))

    app.get("*", (_req: any, res: any) => {
      res.sendFile(path.join(buildDir, "public", "index.html"))
    })

    app.listen(port, () => {
      console.log(chalk.green(`🚀 s4ft app serving on http://localhost:${port}`))
    })
  })

program
  .command("generate <type> <name>")
  .alias("g")
  .description("Generate components, pages, or API routes")
  .option("--template <template>", "Use specific template")
  .action(async (type: string, name: string, options) => {
    const spinner = ora(`Generating ${type}: ${name}...`).start()

    try {
      await generateFile(type, name, options)
      spinner.succeed(chalk.green(`✅ Generated ${type}: ${name}`))
    } catch (error) {
      spinner.fail(chalk.red(`❌ Failed to generate ${type}: ${name}`))
      console.error(error)
      process.exit(1)
    }
  })

program
  .command("new <app-name>")
  .option("--layout <layout>", "Escolha o layout", "system")
  .option("--auth <provider>", "Adicione autenticação", "github")
  .action(async (appName, options) => {
    const projectPath = path.join(process.cwd(), appName)

    await fs.ensureDir(projectPath)
    await fs.ensureDir(path.join(projectPath, "system"))
    await fs.ensureDir(path.join(projectPath, "auth"))

    const layoutFile = `// Layout principal gerado automaticamente
layout SystemLayout {
  props {
    children: ReactNode
  }
  <div className="system-layout">
    <header>S4FT System Layout</header>
    <main>{children}</main>
    <footer>Rodapé do sistema</footer>
  </div>
}
export SystemLayout;
`
    await fs.writeFile(path.join(projectPath, "system", "layout.sft"), layoutFile)

    const authFile = `// Provider de autenticação gerado automaticamente
auth ${options.auth.charAt(0).toUpperCase() + options.auth.slice(1)}Auth {
  // Configuração do provedor ${options.auth}
  // Exemplo: clientId, clientSecret, redirectUri, etc.
}
export ${options.auth.charAt(0).toUpperCase() + options.auth.slice(1)}Auth;
`
    await fs.writeFile(path.join(projectPath, "auth", `${options.auth}.sft`), authFile)

    console.log(`Novo projeto ${appName} com layout ${options.layout} e auth ${options.auth}`)
    console.log(chalk.blue("Estrutura criada:"))
    console.log(chalk.gray(`  ${appName}/system/layout.sft`))
    console.log(chalk.gray(`  ${appName}/auth/${options.auth}.sft`))
  })

program
  .command("deploy")
  .option("--target <target>", "Destino do deploy", "s4ft.fun")
  .action((options) => {
    console.log(`Deploy para ${options.target} iniciado!`)
  })

async function generateFile(type: string, name: string, options: any): Promise<void> {
  const projectRoot = process.cwd()

  switch (type) {
    case "component":
      await generateComponent(projectRoot, name, options)
      break
    case "page":
      await generatePage(projectRoot, name, options)
      break
    case "api":
      await generateAPI(projectRoot, name, options)
      break
    case "layout":
      await generateLayout(projectRoot, name, options)
      break
    default:
      throw new Error(`Unknown type: ${type}. Use: component, page, api, or layout`)
  }
}

async function generateComponent(projectRoot: string, name: string, options: any): Promise<void> {
  const componentPath = path.join(projectRoot, "components", `${name}.sft`)

  const template = `// ${name} component
component ${name} {
  props {
    // Add your props here
  }
  
  state {
    // Add your state here
  }
  
  event handleClick() {
    // Add your event handlers here
  }
  
  <div className="${name.toLowerCase()}">
    <h2>${name} Component</h2>
    <p>This is the ${name} component.</p>
  </div>
}

export ${name};
`

  await fs.ensureDir(path.dirname(componentPath))
  await fs.writeFile(componentPath, template)
}

async function generatePage(projectRoot: string, name: string, options: any): Promise<void> {
  const pagePath = path.join(projectRoot, "app", `${name}`, "page.sft")

  const template = `// ${name} page
page ${name}Page {
  state {
    // Add your state here
  }
  
  <div className="${name.toLowerCase()}-page">
    <h1>${name} Page</h1>
    <p>Welcome to the ${name} page.</p>
  </div>
}

export ${name}Page;
`

  await fs.ensureDir(path.dirname(pagePath))
  await fs.writeFile(pagePath, template)
}

async function generateAPI(projectRoot: string, name: string, options: any): Promise<void> {
  const apiPath = path.join(projectRoot, "app", "api", `${name}.sft`)

  const template = `// ${name} API route
export function GET(request) {
  return {
    status: 200,
    body: {
      message: "Hello from ${name} API!",
      timestamp: new Date().toISOString()
    }
  };
}

export function POST(request) {
  const { body } = request;
  
  return {
    status: 200,
    body: {
      message: "Data received in ${name} API",
      data: body
    }
  };
}
`

  await fs.ensureDir(path.dirname(apiPath))
  await fs.writeFile(apiPath, template)
}

async function generateLayout(projectRoot: string, name: string, options: any): Promise<void> {
  const layoutPath = path.join(projectRoot, "app", `${name}`, "layout.sft")

  const template = `// ${name} layout
layout ${name}Layout {
  props {
    children: ReactNode
  }
  
  <div className="${name.toLowerCase()}-layout">
    <header>
      <h1>${name} Layout</h1>
    </header>
    <main>
      {children}
    </main>
    <footer>
      <p>© 2024 ${name}</p>
    </footer>
  </div>
}

export ${name}Layout;
`

  await fs.ensureDir(path.dirname(layoutPath))
  await fs.writeFile(layoutPath, template)
}

async function createProject(config: any): Promise<void> {
  const projectPath = path.join(process.cwd(), config.name)

  // Create project structure
  await fs.ensureDir(projectPath)
  await fs.ensureDir(path.join(projectPath, "app"))
  await fs.ensureDir(path.join(projectPath, "app", "api"))
  await fs.ensureDir(path.join(projectPath, "components"))
  await fs.ensureDir(path.join(projectPath, "styles"))
  await fs.ensureDir(path.join(projectPath, "public"))
  await fs.ensureDir(path.join(projectPath, "scripts"))
  await fs.ensureDir(path.join(projectPath, "docs"))

  // Create package.json with selected features
  const packageJson = {
    name: config.name,
    version: "0.1.0",
    private: true,
    scripts: {
      dev: "s4ft dev",
      build: "s4ft build",
      start: "s4ft serve",
      generate: "s4ft generate",
    },
    dependencies: {
      "s4ft-framework": "^1.0.0",
      ...(config.styling === "tailwind" && { tailwindcss: "^3.0.0" }),
      ...(config.features.includes("auth") && { [`s4ft-plugin-auth-${config.auth}`]: "^1.0.0" }),
      ...(config.features.includes("database") && { [`s4ft-plugin-${config.database}`]: "^1.0.0" }),
    },
  }

  await fs.writeFile(path.join(projectPath, "package.json"), JSON.stringify(packageJson, null, 2))
  await createExampleFiles(projectPath, config)
  await createReadme(projectPath, config.name, config.language)
}

async function createExampleFiles(projectPath: string, config: any): Promise<void> {
  const isPortuguese = config.language === "pt-br"

  // Create main page
  const mainPage = `// ${isPortuguese ? "Componente da página principal" : "Main page component"}
page HomePage {
  state {
    count: number = 0,
    message: string = "${isPortuguese ? "Bem-vindo ao s4ft!" : "Welcome to s4ft!"}"
  }
  
  event handleClick() {
    count = count + 1
  }
  
  <div className="container">
    <h1>{message}</h1>
    <p>${isPortuguese ? "Você clicou" : "You clicked"} {count} ${isPortuguese ? "vezes" : "times"}</p>
    <button onClick={handleClick}>
      ${isPortuguese ? "Clique aqui!" : "Click me!"}
    </button>
  </div>
}

export HomePage;
`

  await fs.writeFile(path.join(projectPath, "app", "page.sft"), mainPage)

  // Create layout
  const layout = `// ${isPortuguese ? "Layout raiz do componente" : "Root layout component"}
layout RootLayout {
  props {
    children: ReactNode
  }
  
  <html lang="${isPortuguese ? "pt-br" : "en"}">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>s4ft App</title>
    </head>
    <body>
      <div id="app">
        {children}
      </div>
    </body>
  </html>
}

export RootLayout;
`

  await fs.writeFile(path.join(projectPath, "app", "layout.sft"), layout)

  // Create example component
  const component = `// ${isPortuguese ? "Componente de botão reutilizável" : "Reusable button component"}
component Button {
  props {
    text: string = "${isPortuguese ? "Clique aqui" : "Click me"}",
    variant: string = "primary",
    onClick: function
  }
  
  event handleClick() {
    if (onClick) {
      onClick();
    }
  }
  
  <button 
    className={\`btn btn-\${variant}\`}
    onClick={handleClick}
  >
    {text}
  </button>
}

export Button;
`

  await fs.writeFile(path.join(projectPath, "components", "Button.sft"), component)

  // Create API route example
  const apiRoute = `// ${isPortuguese ? "Exemplo de rota da API" : "Example API route"}
export function GET(request) {
  return {
    status: 200,
    body: {
      message: "${isPortuguese ? "Olá da API s4ft!" : "Hello from s4ft API!"}",
      timestamp: new Date().toISOString()
    }
  };
}

export function POST(request) {
  const { body } = request;
  
  return {
    status: 200,
    body: {
      message: "${isPortuguese ? "Dados recebidos" : "Data received"}",
      data: body
    }
  };
}
`

  await fs.writeFile(path.join(projectPath, "app", "api", "hello.sft"), apiRoute)

  // Create CSS file
  const styles = `/* ${isPortuguese ? "Estilos globais" : "Global styles"} */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  line-height: 1.6;
  color: #333;
  background: #f9f9f9;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  margin-top: 2rem;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.375rem;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  font-weight: 600;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea, #764ba2);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn-secondary {
  background-color: #6b7280;
  color: white;
}

.btn-secondary:hover {
  background-color: #4b5563;
}

h1 {
  color: #2d3748;
  margin-bottom: 1rem;
  font-size: 2.5rem;
}

p {
  margin-bottom: 1.5rem;
  font-size: 1.1rem;
  color: #4a5568;
}
`

  await fs.writeFile(path.join(projectPath, "styles", "globals.css"), styles)

  // Create s4ft config
  const s4ftConfig = `// S4FT Configuration
export default {
  // ${isPortuguese ? "Configurações do projeto" : "Project settings"}
  name: "${config.name}",
  version: "1.0.0",
  
  // ${isPortuguese ? "Configurações de build" : "Build settings"}
  build: {
    outDir: "dist",
    minify: true,
    sourceMaps: false,
  },
  
  // ${isPortuguese ? "Configurações do servidor de desenvolvimento" : "Dev server settings"}
  dev: {
    port: 3000,
    host: "localhost",
    open: true,
  },
  
  // ${isPortuguese ? "Plugins" : "Plugins"}
  plugins: [
    ${config.features.map((feature: string) => `"s4ft-plugin-${feature}"`).join(",\n    ")}
  ],
  
  // ${isPortuguese ? "Configurações de deploy" : "Deploy settings"}
  deploy: {
    target: "s4ft.fun",
    domain: "${config.name}.s4ft.fun"
  }
};
`

  await fs.writeFile(path.join(projectPath, "s4ft.config.ts"), s4ftConfig)
}

async function createReadme(projectPath: string, projectName: string, language: string): Promise<void> {
  const isPortuguese = language === "pt-br"

  const readme = `# ${projectName}

${isPortuguese ? "Uma aplicação web s4ft (Simple And Fast Templates)." : "A s4ft (Simple And Fast Templates) web application."}

## ${isPortuguese ? "Começando" : "Getting Started"}

${isPortuguese ? "Primeiro, execute o servidor de desenvolvimento:" : "First, run the development server:"}

\`\`\`bash
npm run dev
# ${isPortuguese ? "ou" : "or"}
s4ft dev
\`\`\`

${isPortuguese ? "Abra [http://localhost:3000](http://localhost:3000) no seu navegador para ver o resultado." : "Open [http://localhost:3000](http://localhost:3000) with your browser to see the result."}

## ${isPortuguese ? "Estrutura do Projeto" : "Project Structure"}

\`\`\`
${projectName}/
├── app/                 # ${isPortuguese ? "Páginas e layouts do app router" : "App router pages and layouts"}
│   ├── api/            # ${isPortuguese ? "Rotas da API" : "API routes"}
│   ├── layout.sft      # ${isPortuguese ? "Layout raiz" : "Root layout"}
│   └── page.sft        # ${isPortuguese ? "Página inicial" : "Home page"}
├── components/         # ${isPortuguese ? "Componentes reutilizáveis" : "Reusable components"}
├── styles/            # ${isPortuguese ? "Arquivos CSS" : "CSS files"}
├── public/            # ${isPortuguese ? "Assets estáticos" : "Static assets"}
├── scripts/           # ${isPortuguese ? "Scripts de build e utilitários" : "Build and utility scripts"}
└── docs/              # ${isPortuguese ? "Documentação" : "Documentation"}
\`\`\`

## ${isPortuguese ? "Sintaxe s4ft" : "s4ft Syntax"}

${isPortuguese ? "O s4ft usa uma sintaxe declarativa similar ao React, mas com algumas funcionalidades únicas:" : "s4ft uses a declarative syntax similar to React but with some unique features:"}

### ${isPortuguese ? "Componentes" : "Components"}

\`\`\`s4ft
component MeuComponente {
  props {
    titulo: string = "${isPortuguese ? "Título Padrão" : "Default Title"}",
    contador: number
  }
  
  state {
    visivel: boolean = true
  }
  
  event alternarVisibilidade() {
    // ${isPortuguese ? "Lógica do manipulador de evento" : "Event handler logic"}
  }
  
  <div>
    <h1>{titulo}</h1>
    {visivel && <p>${isPortuguese ? "Contador" : "Count"}: {contador}</p>}
    <button onClick={alternarVisibilidade}>${isPortuguese ? "Alternar" : "Toggle"}</button>
  </div>
}
\`\`\`

### ${isPortuguese ? "Páginas" : "Pages"}

\`\`\`s4ft
page PaginaSobre {
  <div>
    <h1>${isPortuguese ? "Sobre Nós" : "About Us"}</h1>
    <p>${isPortuguese ? "Esta é a página sobre." : "This is the about page."}</p>
  </div>
}
\`\`\`

### Layouts

\`\`\`s4ft
layout LayoutPrincipal {
  props {
    children: ReactNode
  }
  
  <div className="layout">
    <header>
      <nav>${isPortuguese ? "Navegação" : "Navigation"}</nav>
    </header>
    <main>
      {children}
    </main>
    <footer>${isPortuguese ? "Rodapé" : "Footer"}</footer>
  </div>
}
\`\`\`

## ${isPortuguese ? "Comandos" : "Commands"}

- \`s4ft dev\` - ${isPortuguese ? "Iniciar servidor de desenvolvimento" : "Start development server"}
- \`s4ft build\` - ${isPortuguese ? "Build para produção" : "Build for production"}
- \`s4ft serve\` - ${isPortuguese ? "Servir build de produção" : "Serve production build"}
- \`s4ft generate <tipo> <nome>\` - ${isPortuguese ? "Gerar componentes, páginas ou APIs" : "Generate components, pages or APIs"}

## ${isPortuguese ? "Saiba Mais" : "Learn More"}

${isPortuguese ? "Para saber mais sobre o s4ft, confira a [documentação](./docs/)." : "To learn more about s4ft, check out the [documentation](./docs/)."}

---

🌟 ${isPortuguese ? "Obrigado por usar o S4FT!" : "Thank you for using S4FT!"} 🌟

${isPortuguese ? "Ajude o projeto a crescer! Doe via PIX (doacao@s4ft.fun) ou Stripe:" : "Help the project grow! Donate via PIX (doacao@s4ft.fun) or Stripe:"}
- ${isPortuguese ? "Brasileiros" : "Brazilians"}: https://buy.stripe.com/4gM5kE16MfCb4b72C60sU00
- ${isPortuguese ? "Não brasileiros" : "Non-Brazilians"}: https://buy.stripe.com/fZu7sMg1G3Tt7nj4Ke0sU01

${isPortuguese ? "Hospede grátis ou profissionalmente em" : "Host for free or professionally at"} https://www.s4ft.fun 🚀
`

  await fs.writeFile(path.join(projectPath, "README.md"), readme)
}

program.parse()

export { createProject }

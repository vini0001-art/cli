"use client"

import { Command } from "commander"
import chalk from "chalk"
import ora from "ora"
import fs from "fs-extra"
import path from "path"
import { DevServer } from "../dev-server/dev-server.js"
import { Builder } from "../build/builder.js"
import { Transpiler } from "../transpiler/transpiler.js"

const program = new Command()

program.name("s4ft").description("s4ft - A declarative web development framework").version("1.0.0")

program
  .command("create <project-name>")
  .description("Create a new s4ft project")
  .action(async (projectName: string) => {
    const spinner = ora("Creating s4ft project...").start()

    try {
      await createProject(projectName)
      spinner.succeed(chalk.green(`✅ Created project: ${projectName}`))

      console.log("\n" + chalk.blue("Next steps:"))
      console.log(chalk.gray(`  cd ${projectName}`))
      console.log(chalk.gray("  s4ft dev"))
    } catch (error) {
      spinner.fail(chalk.red("❌ Failed to create project"))
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

    // Corrigir: criar uma instância de Transpiler e passar para Builder
    const transpiler = new Transpiler() // Corrigido: sem argumentos
    const builder = new Builder(transpiler, {
      minify: options.minify !== false,
      sourceMaps: !!options.sourceMaps,
      // Adicione outras opções válidas de BuilderOptions se necessário
    })

    try {
      await builder.run() // Alterado de build() para run()
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
    const express = require("express");
    const path = require("path");

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
  .command("new <app-name>")
  .option("--layout <layout>", "Escolha o layout", "system")
  .option("--auth <provider>", "Adicione autenticação", "github")
  .action(async (appName, options) => {
    const projectPath = path.join(process.cwd(), appName);

    // Cria estrutura básica
    await fs.ensureDir(projectPath);
    await fs.ensureDir(path.join(projectPath, "system"));
    await fs.ensureDir(path.join(projectPath, "auth"));

    // Cria arquivo de layout em /system
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
`;
    await fs.writeFile(path.join(projectPath, "system", "layout.sft"), layoutFile);

    // Cria arquivo de autenticação em /auth
    const authFile = `// Provider de autenticação gerado automaticamente
auth ${options.auth.charAt(0).toUpperCase() + options.auth.slice(1)}Auth {
  // Configuração do provedor ${options.auth}
  // Exemplo: clientId, clientSecret, redirectUri, etc.
}
export ${options.auth.charAt(0).toUpperCase() + options.auth.slice(1)}Auth;
`;
    await fs.writeFile(path.join(projectPath, "auth", `${options.auth}.sft`), authFile);

    // Mensagem de sucesso
    console.log(`Novo projeto ${appName} com layout ${options.layout} e auth ${options.auth}`);
    console.log(chalk.blue("Estrutura criada:"));
    console.log(chalk.gray(`  ${appName}/system/layout.sft`));
    console.log(chalk.gray(`  ${appName}/auth/${options.auth}.sft`));
  });

program
  .command("deploy")
  .option("--target <target>", "Destino do deploy", "s4ft.fun")
  .action((options) => {
    // Lógica para build e deploy usando as configs do s4ft.config.ts
    console.log(`Deploy para ${options.target} iniciado!`);
  });

async function createProject(projectName: string): Promise<void> {
  const projectPath = path.join(process.cwd(), projectName)

  // Create project structure
  await fs.ensureDir(projectPath)
  await fs.ensureDir(path.join(projectPath, "app"))
  await fs.ensureDir(path.join(projectPath, "app", "api"))
  await fs.ensureDir(path.join(projectPath, "components"))
  await fs.ensureDir(path.join(projectPath, "styles"))
  await fs.ensureDir(path.join(projectPath, "public"))
  await fs.ensureDir(path.join(projectPath, "scripts"))
  await fs.ensureDir(path.join(projectPath, "docs"))

  // Create package.json
  const packageJson = {
    name: projectName,
    version: "0.1.0",
    private: true,
    scripts: {
      dev: "s4ft dev",
      build: "s4ft build",
      start: "s4ft serve",
    },
    dependencies: {
      "s4ft-framework": "^1.0.0",
    },
  }

  await fs.writeFile(path.join(projectPath, "package.json"), JSON.stringify(packageJson, null, 2))

  // Create example files
  await createExampleFiles(projectPath)

  // Create README
  await createReadme(projectPath, projectName)
}

async function createExampleFiles(projectPath: string): Promise<void> {
  // Create main page
  const mainPage = `// Main page component
page HomePage {
  state {
    count: number = 0,
    message: string = "Welcome to s4ft!"
  }
  
  event handleClick() {
    // Handle button click
  }
  
  <div className="container">
    <h1>{message}</h1>
    <p>You clicked {count} times</p>
    <button onClick={handleClick}>
      Click me!
    </button>
  </div>
}

export HomePage;
`

  await fs.writeFile(path.join(projectPath, "app", "page.sft"), mainPage)

  // Create layout
  const layout = `// Root layout component
layout RootLayout {
  props {
    children: ReactNode
  }
  
  <html lang="en">
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
  const component = `// Reusable button component
component Button {
  props {
    text: string = "Click me",
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
  const apiRoute = `// Example API route
export function GET(request) {
  return {
    status: 200,
    body: {
      message: "Hello from s4ft API!",
      timestamp: new Date().toISOString()
    }
  };
}

export function POST(request) {
  const { body } = request;
  
  return {
    status: 200,
    body: {
      message: "Data received",
      data: body
    }
  };
}
`

  await fs.writeFile(path.join(projectPath, "app", "api", "hello.sft"), apiRoute)

  // Create CSS file
  const styles = `/* Global styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  line-height: 1.6;
  color: #333;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.375rem;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary {
  background-color: #3b82f6;
  color: white;
}

.btn-primary:hover {
  background-color: #2563eb;
}

.btn-secondary {
  background-color: #6b7280;
  color: white;
}

.btn-secondary:hover {
  background-color: #4b5563;
}
`

  await fs.writeFile(path.join(projectPath, "styles", "globals.css"), styles)
}

async function createReadme(projectPath: string, projectName: string): Promise<void> {
  const readme = `# ${projectName}

A s4ft (Simple And Fast Templates) web application.

## Getting Started

First, run the development server:

\`\`\`bash
npm run dev
# or
s4ft dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

\`\`\`
${projectName}/
├── app/                 # App router pages and layouts
│   ├── api/            # API routes
│   ├── layout.sft      # Root layout
│   └── page.sft        # Home page
├── components/         # Reusable components
├── styles/            # CSS files
├── public/            # Static assets
├── scripts/           # Build and utility scripts
└── docs/              # Documentation
\`\`\`

## s4ft Syntax

s4ft uses a declarative syntax similar to React but with some unique features:

### Components

\`\`\`s4ft
component MyComponent {
  props {
    title: string = "Default Title",
    count: number
  }
  
  state {
    isVisible: boolean = true
  }
  
  event handleToggle() {
    // Event handler logic
  }
  
  <div>
    <h1>{title}</h1>
    {isVisible && <p>Count: {count}</p>}
    <button onClick={handleToggle}>Toggle</button>
  </div>
}
\`\`\`

### Pages

\`\`\`s4ft
page AboutPage {
  <div>
    <h1>About Us</h1>
    <p>This is the about page.</p>
  </div>
}
\`\`\`

### Layouts

\`\`\`s4ft
layout MainLayout {
  props {
    children: ReactNode
  }
  
  <div className="layout">
    <header>
      <nav>Navigation</nav>
    </header>
    <main>
      {children}
    </main>
    <footer>Footer</footer>
  </div>
}
\`\`\`

## Commands

- \`s4ft dev\` - Start development server
- \`s4ft build\` - Build for production
- \`s4ft serve\` - Serve production build

## Learn More

To learn more about s4ft, check out the [documentation](./docs/).


🌟 Obrigado por usar o S4FT! 🌟

Ajude o projeto a crescer! Doe via PIX (doacao@s4ft.fun) ou Stripe:
- Brasileiros: https://buy.stripe.com/4gM5kE16MfCb4b72C60sU00
- Não brasileiros: https://buy.stripe.com/fZu7sMg1G3Tt7nj4Ke0sU01

Hospede grátis ou profissionalmente em https://www.s4ft.fun 🚀
`

  await fs.writeFile(path.join(projectPath, "README.md"), readme)
}

program.parse()

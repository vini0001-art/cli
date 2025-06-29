"use strict";
"use client";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const chalk_1 = __importDefault(require("chalk"));
const ora_1 = __importDefault(require("ora"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const dev_server_js_1 = require("../dev-server/dev-server.js");
const builder_js_1 = require("../build/builder.js");
const transpiler_js_1 = require("../transpiler/transpiler.js");
const program = new commander_1.Command();
program.name("s4ft").description("s4ft - A declarative web development framework").version("1.0.0");
program
    .command("create <project-name>")
    .description("Create a new s4ft project")
    .action(async (projectName) => {
    const spinner = (0, ora_1.default)("Creating s4ft project...").start();
    try {
        await createProject(projectName);
        spinner.succeed(chalk_1.default.green(`✅ Created project: ${projectName}`));
        console.log("\n" + chalk_1.default.blue("Next steps:"));
        console.log(chalk_1.default.gray(`  cd ${projectName}`));
        console.log(chalk_1.default.gray("  s4ft dev"));
    }
    catch (error) {
        spinner.fail(chalk_1.default.red("❌ Failed to create project"));
        console.error(error);
        process.exit(1);
    }
});
program
    .command("dev")
    .description("Start development server")
    .option("-p, --port <port>", "Port to run on", "3000")
    .action(async (options) => {
    const port = Number.parseInt(options.port);
    const projectRoot = process.cwd();
    const appDir = path_1.default.join(projectRoot, "app");
    if (!(await fs_extra_1.default.pathExists(appDir))) {
        console.error(chalk_1.default.red("❌ No app directory found. Make sure you're in a s4ft project."));
        process.exit(1);
    }
    const devServer = new dev_server_js_1.DevServer({
        port,
        projectRoot,
        appDir,
    });
    try {
        await devServer.start();
    }
    catch (error) {
        console.error(chalk_1.default.red("❌ Failed to start dev server:"), error);
        process.exit(1);
    }
});
program
    .command("build")
    .description("Build for production")
    .option("-o, --output <dir>", "Output directory", "dist")
    .option("--no-minify", "Disable minification")
    .option("--source-maps", "Generate source maps")
    .action(async (options) => {
    const projectRoot = process.cwd();
    const appDir = path_1.default.join(projectRoot, "app");
    const outputDir = path_1.default.join(projectRoot, options.output);
    if (!(await fs_extra_1.default.pathExists(appDir))) {
        console.error(chalk_1.default.red("❌ No app directory found. Make sure you're in a s4ft project."));
        process.exit(1);
    }
    // Corrigir: criar uma instância de Transpiler e passar para Builder
    const transpiler = new transpiler_js_1.Transpiler(); // Corrigido: sem argumentos
    const builder = new builder_js_1.Builder(transpiler, {
        minify: options.minify !== false,
        sourceMaps: !!options.sourceMaps,
        // Adicione outras opções válidas de BuilderOptions se necessário
    });
    try {
        await builder.run(); // Alterado de build() para run()
    }
    catch (error) {
        console.error(chalk_1.default.red("❌ Build failed:"), error);
        process.exit(1);
    }
});
program
    .command("serve")
    .description("Serve production build")
    .option("-p, --port <port>", "Port to run on", "3000")
    .option("-d, --dir <dir>", "Build directory", "dist")
    .action(async (options) => {
    const express = require("express");
    const path = require("path");
    const app = express();
    const port = Number.parseInt(options.port);
    const buildDir = path.join(process.cwd(), options.dir);
    if (!(await fs_extra_1.default.pathExists(buildDir))) {
        console.error(chalk_1.default.red(`❌ Build directory not found: ${buildDir}`));
        console.log(chalk_1.default.gray('Run "s4ft build" first'));
        process.exit(1);
    }
    app.use(express.static(buildDir));
    app.get("*", (_req, res) => {
        res.sendFile(path.join(buildDir, "public", "index.html"));
    });
    app.listen(port, () => {
        console.log(chalk_1.default.green(`🚀 s4ft app serving on http://localhost:${port}`));
    });
});
program
    .command("new <app-name>")
    .option("--layout <layout>", "Escolha o layout", "system")
    .option("--auth <provider>", "Adicione autenticação", "github")
    .action(async (appName, options) => {
    const projectPath = path_1.default.join(process.cwd(), appName);
    // Cria estrutura básica
    await fs_extra_1.default.ensureDir(projectPath);
    await fs_extra_1.default.ensureDir(path_1.default.join(projectPath, "system"));
    await fs_extra_1.default.ensureDir(path_1.default.join(projectPath, "auth"));
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
    await fs_extra_1.default.writeFile(path_1.default.join(projectPath, "system", "layout.sft"), layoutFile);
    // Cria arquivo de autenticação em /auth
    const authFile = `// Provider de autenticação gerado automaticamente
auth ${options.auth.charAt(0).toUpperCase() + options.auth.slice(1)}Auth {
  // Configuração do provedor ${options.auth}
  // Exemplo: clientId, clientSecret, redirectUri, etc.
}
export ${options.auth.charAt(0).toUpperCase() + options.auth.slice(1)}Auth;
`;
    await fs_extra_1.default.writeFile(path_1.default.join(projectPath, "auth", `${options.auth}.sft`), authFile);
    // Mensagem de sucesso
    console.log(`Novo projeto ${appName} com layout ${options.layout} e auth ${options.auth}`);
    console.log(chalk_1.default.blue("Estrutura criada:"));
    console.log(chalk_1.default.gray(`  ${appName}/system/layout.sft`));
    console.log(chalk_1.default.gray(`  ${appName}/auth/${options.auth}.sft`));
});
program
    .command("deploy")
    .option("--target <target>", "Destino do deploy", "s4ft.fun")
    .action((options) => {
    // Lógica para build e deploy usando as configs do s4ft.config.ts
    console.log(`Deploy para ${options.target} iniciado!`);
});
async function createProject(projectName) {
    const projectPath = path_1.default.join(process.cwd(), projectName);
    // Create project structure
    await fs_extra_1.default.ensureDir(projectPath);
    await fs_extra_1.default.ensureDir(path_1.default.join(projectPath, "app"));
    await fs_extra_1.default.ensureDir(path_1.default.join(projectPath, "app", "api"));
    await fs_extra_1.default.ensureDir(path_1.default.join(projectPath, "components"));
    await fs_extra_1.default.ensureDir(path_1.default.join(projectPath, "styles"));
    await fs_extra_1.default.ensureDir(path_1.default.join(projectPath, "public"));
    await fs_extra_1.default.ensureDir(path_1.default.join(projectPath, "scripts"));
    await fs_extra_1.default.ensureDir(path_1.default.join(projectPath, "docs"));
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
    };
    await fs_extra_1.default.writeFile(path_1.default.join(projectPath, "package.json"), JSON.stringify(packageJson, null, 2));
    // Create example files
    await createExampleFiles(projectPath);
    // Create README
    await createReadme(projectPath, projectName);
}
async function createExampleFiles(projectPath) {
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
`;
    await fs_extra_1.default.writeFile(path_1.default.join(projectPath, "app", "page.sft"), mainPage);
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
`;
    await fs_extra_1.default.writeFile(path_1.default.join(projectPath, "app", "layout.sft"), layout);
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
`;
    await fs_extra_1.default.writeFile(path_1.default.join(projectPath, "components", "Button.sft"), component);
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
`;
    await fs_extra_1.default.writeFile(path_1.default.join(projectPath, "app", "api", "hello.sft"), apiRoute);
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
`;
    await fs_extra_1.default.writeFile(path_1.default.join(projectPath, "styles", "globals.css"), styles);
}
async function createReadme(projectPath, projectName) {
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
`;
    await fs_extra_1.default.writeFile(path_1.default.join(projectPath, "README.md"), readme);
}
program.parse();
//# sourceMappingURL=cli.js.map
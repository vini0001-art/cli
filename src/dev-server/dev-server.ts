import express from "express"
import { createServer } from "http"
import ws from "ws"
import chokidar from "chokidar"
import path from "path"
import fs from "fs-extra"
import { Parser } from "../parser/parser.js"
import { Transpiler } from "../transpiler/transpiler.js"
import { renderToString } from "react-dom/server"
import middleware from "../middleware.js"; // ajuste: inclua a extensão se estiver usando ES Modules
// import authMiddleware from "../../authMiddleware";
import cors from "cors";
// import config from "../s4ft.config";
let config: any = {};
// Substitua o bloco try/catch por um carregamento dinâmico no construtor

export interface DevServerOptions {
  port: number
  projectRoot: string
  appDir: string
}

export class DevServer {
  private app: express.Application
  private server: any
  private wss: ws.WebSocketServer
  private options: DevServerOptions
  private transpiler: Transpiler

  constructor(options: DevServerOptions) {
    this.options = options
    this.app = express()
    this.app.use(middleware)
    this.app.use(cors());
    // this.app.use(authMiddleware);
    this.transpiler = new Transpiler()

    // Carregue o config dinamicamente se existir
    this.loadConfig();

    this.setupMiddleware()
    this.setupBundleRoute()
    this.setupRoutes()
    this.server = createServer(this.app)
    this.wss = new ws.WebSocketServer({ server: this.server })
    this.setupWebSocket()
    this.setupFileWatcher()
    this.setupPlugins();
  }

  private async loadConfig() {
    // Suporte para s4ft.config.ts (ESM)
    const configPathTs = path.join(this.options.projectRoot, "src", "s4ft.config.ts");
    const configPathRootTs = path.join(this.options.projectRoot, "s4ft.config.ts");
    let configModule;
    try {
      if (await fs.pathExists(configPathTs)) {
        configModule = await import(configPathTs + "?ts");
      } else if (await fs.pathExists(configPathRootTs)) {
        configModule = await import(configPathRootTs + "?ts");
      }
      if (configModule && configModule.default) {
        config = configModule.default;
      } else if (configModule) {
        config = configModule;
      }
    } catch (e) {
      config = {};
    }
  }

  private setupMiddleware(): void {
    this.app.use(express.static(path.join(this.options.projectRoot, "public")))
    this.app.use(express.json())
  }

  private setupBundleRoute(): void {
    this.app.get("/app-bundle.js", async (req, res) => {
      try {
        const bundle = await this.getAppBundle()
        res.type("application/javascript").send(bundle)
      } catch (error) {
        res.status(500).send(`// Error generating bundle: ${(error as Error).message}`)
      }
    })
  }

  private setupRoutes(): void {
    // Remova ou comente as linhas abaixo:
    // this.app.get("/", (req, res) => {
    //   const htmlContent = this.generateIndexHTML()
    //   res.send(htmlContent)
    // })
    this.app.get("/api/:endpoint", this.handleAPIRoutes.bind(this))
    this.app.use(this.handlePageRoutes.bind(this)) // SSR para todas as rotas, inclusive "/"
  }

  private generateIndexHTML(): string {
    return `<!DOCTYPE html>
<html lang="pt-br">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>S4FT - Simple And Fast Templates</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif; 
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .container {
      background: white;
      border-radius: 20px;
      padding: 3rem;
      box-shadow: 0 20px 40px rgba(0,0,0,0.1);
      text-align: center;
      max-width: 600px;
      margin: 2rem;
    }
    .logo {
      width: 120px;
      height: 120px;
      margin: 0 auto 2rem;
      background: linear-gradient(135deg, #667eea, #764ba2);
      border-radius: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 3rem;
      color: white;
      font-weight: bold;
    }
    .title {
      font-size: 2.5rem;
      color: #2d3748;
      margin-bottom: 1rem;
      font-weight: 700;
    }
    .subtitle {
      font-size: 1.2rem;
      color: #667eea;
      margin-bottom: 2rem;
      font-weight: 500;
    }
    .welcome-text {
      font-size: 1.1rem;
      color: #4a5568;
      line-height: 1.6;
      margin-bottom: 2rem;
    }
    .highlight {
      background: linear-gradient(135deg, #667eea, #764ba2);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      font-weight: bold;
    }
    .docs-link {
      display: inline-block;
      background: linear-gradient(135deg, #667eea, #764ba2);
      color: white;
      padding: 12px 24px;
      border-radius: 10px;
      text-decoration: none;
      font-weight: 600;
      transition: transform 0.2s;
      margin: 0.5rem;
    }
    .docs-link:hover {
      transform: translateY(-2px);
    }
    .footer {
      margin-top: 2rem;
      padding-top: 2rem;
      border-top: 1px solid #e2e8f0;
      color: #718096;
      font-size: 0.9rem;
    }
    .status {
      display: inline-block;
      background: #48bb78;
      color: white;
      padding: 4px 12px;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 600;
      margin-bottom: 1rem;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">S4FT</div>
    <div class="status">🚀 Servidor Ativo</div>
    <h1 class="title">Bem-vindo ao S4FT!</h1>
    <p class="subtitle">Simple And Fast Templates</p>
    
    <div class="welcome-text">
      <p>🎉 <strong>Parabéns pela iniciativa!</strong></p>
      <p>Você está usando o <span class="highlight">primeiro framework web brasileiro</span> focado em simplicidade e performance.</p>
      <br>
      <p>🇧🇷 Você faz parte de uma nova geração de desenvolvedores que está mudando o cenário tech nacional!</p>
    </div>

    <div>
      <a href="https://www.s4ft.fun/docs" class="docs-link" target="_blank">
        📚 Documentação
      </a>
      <a href="https://github.com/s4ft-framework" class="docs-link" target="_blank">
        💻 GitHub
      </a>
    </div>

    <div class="footer">
      <p><strong>🌟 Ajude o S4FT a crescer!</strong></p>
      <p>Contribua no GitHub • Doe via PIX: doacao@s4ft.fun</p>
      <p>Deploy gratuito em <a href="https://www.s4ft.fun" style="color: #667eea;">s4ft.fun</a></p>
    </div>
  </div>

  <script>
    // Hot reload WebSocket
    const ws = new WebSocket('ws://localhost:${this.options.port}');
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'reload') {
        window.location.reload();
      }
    };
  </script>
</body>
</html>
    `
  }

  private async handleAPIRoutes(req: express.Request, res: express.Response): Promise<void> {
    const apiPath = req.params.endpoint
    if (!apiPath) {
      res.status(400).json({ error: "API path inválido ou ausente" })
      return
    }
    const apiFile = path.join(this.options.appDir, "api", `${apiPath}.sft`)
    if (await fs.pathExists(apiFile)) {
      try {
        const content = await fs.readFile(apiFile, "utf-8")
        const parser = new Parser(content)
        const ast = parser.parse()
        res.json({ message: "API route handled", path: apiPath })
      } catch (error) {
        res.status(500).json({ error: (error as Error).message })
      }
    } else {
      res.status(404).json({ error: "API route not found" })
    }
  }

  // Adicione este método na classe DevServer:
  private async matchDynamicRoute(reqPath: string): Promise<{ file: string, params: Record<string, string> } | null> {
    const appFiles = await this.finds4ftFiles(this.options.appDir);
    for (const file of appFiles) {
      const relPath = path.relative(this.options.appDir, file).replace(/\\/g, "/");
      // Exemplo: posts/[id].sft vira /posts/:id
      const routePattern = relPath
        .replace(/\.sft$/, "")
        .replace(/\[([^\]]+)\]/g, ":$1");
      // Cria regex para comparar a rota
      const regexPattern = "^/" + routePattern.replace(/:[^/]+/g, "([^/]+)") + "$";
      const regex = new RegExp(regexPattern);
      const match = reqPath.match(regex);
      if (match) {
        // Extrai os nomes dos parâmetros
        const paramNames = [...relPath.matchAll(/\[([^\]]+)\]/g)].map(m => m[1]);
        const paramValues = match.slice(1);
        const params: Record<string, string> = {};
        paramNames.forEach((name, i) => params[name] = paramValues[i]);
        return { file, params };
      }
    }
    return null;
  }

  // Modifique o método handlePageRoutes para usar a busca dinâmica:
  private async handlePageRoutes(req: express.Request, res: express.Response): Promise<void> {
    let pagePath = req.path === "/" ? "/page" : req.path;
    if (pagePath.endsWith("/")) {
      pagePath += "page";
    }
    const pageFile = path.join(this.options.appDir, `${pagePath}.sft`);
    let sftFile = pageFile;
    let params: Record<string, string> = {};

    if (!(await fs.pathExists(pageFile))) {
      // Tenta encontrar rota dinâmica
      const dynamicMatch = await this.matchDynamicRoute(req.path);
      if (dynamicMatch) {
        sftFile = dynamicMatch.file;
        params = dynamicMatch.params;
      } else {
        res.send(this.generateIndexHTML());
        return;
      }
    }

    // Transpile o .sft para React
    const content = await fs.readFile(sftFile, "utf-8");
    const parser = new Parser(content);
    const ast = parser.parse();
    const jsCode = this.transpiler.transpile(ast);

    // Crie o componente React dinamicamente
    // (Aqui é um exemplo simplificado, idealmente use require-from-string ou transpile para um módulo)
    // Supondo que jsCode exporta um componente chamado PageComponent
    let PageComponent;
    try {
      // eslint-disable-next-line no-eval
      PageComponent = eval(`(function(require, module, exports){${jsCode}; return module.exports.PageComponent || module.exports.default;})`)(require, {exports:{}}, {});
    } catch (e) {
      res.status(500).send("Erro ao compilar componente: " + e);
      return;
    }

    // Renderize para HTML usando SSR
    let html = "";
    try {
      html = renderToString(PageComponent ? PageComponent(params) : null);
    } catch (e) {
      res.status(500).send("Erro ao renderizar componente: " + e);
      return;
    }

    // Envie o HTML renderizado
    res.end(`
      <html>
        <body>
          <div id="root">${html}</div>
        </body>
      </html>
    `);
  }

  private setupWebSocket(): void {
    this.wss.on("connection", (ws) => {
      console.log("Client connected for hot reload")
      ws.on("close", () => {
        console.log("Client disconnected")
      })
    })
  }

  private setupFileWatcher(): void {
    const watcher = chokidar.watch([
      path.join(this.options.appDir, "**/*.sft"),
      path.join(this.options.projectRoot, "components/**/*.sft"),
      path.join(this.options.projectRoot, "styles/**/*.css"),
    ])
    watcher.on("change", (filePath) => {
      console.log(`File changed: ${filePath}`)
      this.notifyClients("reload")
    })
    watcher.on("add", (filePath) => {
      console.log(`File added: ${filePath}`)
      this.notifyClients("reload")
    })
    watcher.on("unlink", (filePath) => {
      console.log(`File removed: ${filePath}`)
      this.notifyClients("reload")
    })
  }

  private notifyClients(type: string): void {
    const message = JSON.stringify({ type })
    this.wss.clients.forEach((client) => {
      if (client.readyState === client.OPEN) {
        client.send(message)
      }
    })
  }

  private async getAppBundle(): Promise<string> {
    const appFiles = await this.finds4ftFiles(this.options.appDir)
    let bundleCode = ""

    for (const file of appFiles) {
      try {
        const content = await fs.readFile(file, "utf-8")
        const parser = new Parser(content)
        const ast = parser.parse()
        const jsCode = this.transpiler.transpile(ast)
        bundleCode += jsCode + "\n\n"
      } catch (error) {
        console.error(`Error transpiling ${file}:`, error)
      }
    }

    // Remova ou comente este bloco:
    // bundleCode += `
    // const App = () => {
    //   return React.createElement('div', null, 's4ft App Running!');
    // };
    // ReactDOM.render(React.createElement(App), document.getElementById('root'));
    // `

    return bundleCode
  }

  private async finds4ftFiles(dir: string): Promise<string[]> {
    const files: string[] = []
    if (!(await fs.pathExists(dir))) {
      return files
    }
    const entries = await fs.readdir(dir, { withFileTypes: true })
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        files.push(...(await this.finds4ftFiles(fullPath)))
      } else if (entry.name.endsWith(".sft")) {
        files.push(fullPath)
      }
    }
    return files
  }

  private setupPlugins(): void {
    // Adicione as declarações dos hooks aqui
    const buildHooks: any[] = [];
    const renderHooks: any[] = [];
    const hooks = {
      onRoute: (route: string, handler: express.RequestHandler) => this.app.use(route, handler),
      onBuild: (fn: any) => buildHooks.push(fn),
      onRender: (fn: any) => renderHooks.push(fn),
      // ...outros hooks
    };

    if (Array.isArray(config.plugins)) {
      for (const plugin of config.plugins) {
        let mod = plugin;
        if (typeof plugin === "string") {
          mod = require(plugin); // carrega do node_modules
        }
        if (mod && typeof mod.setup === "function") {
          mod.setup(hooks);
        } else if (typeof mod === "function") {
          mod(hooks);
        }
      }
    }
  }

  public start(): Promise<void> {
    return new Promise((resolve) => {
      this.server.listen(this.options.port, () => {
        console.log(`🚀 s4ft dev server running on http://localhost:${this.options.port}`)
        resolve()
      })
    })
  }

  public stop(): void {
    this.server.close()
    this.wss.close()
  }
}

// Ponto de entrada: só execute se chamado diretamente (não em import)
if (require.main === module) {
  const server = new DevServer({
    projectRoot: process.cwd(),
    appDir: path.join(process.cwd(), "app"),
    port: 3000
  })
  server.start()
}

// No .sft
export async function getServerSideProps(context: any) {
  return { props: {} }
}

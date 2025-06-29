import express from "express"
import { createServer } from "http"
import ws from "ws"
import chokidar from "chokidar"
import path from "path"
import fs from "fs-extra"
import { Parser } from "../parser/parser.js"
import { Transpiler } from "../transpiler/transpiler.js"
import { renderToString } from "react-dom/server";
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
    this.app.get("/", (req, res) => {
      const htmlContent = this.generateIndexHTML()
      res.send(htmlContent)
    })
    this.app.get("/api/:endpoint", this.handleAPIRoutes.bind(this))
    this.app.use(this.handlePageRoutes.bind(this)) // <- Corrigido aqui
  }

  private generateIndexHTML(): string {
    return `
<!DOCTYPE html>
<html lang="pt-br">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>S4FT App</title>
  <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <style>
    body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f9f9f9; }
    #root { min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; }
    .s4ft-logo { width: 120px; margin-bottom: 2rem; }
    .s4ft-title { font-size: 2.2rem; color: #2563eb; margin-bottom: 1rem; }
    .s4ft-desc { font-size: 1.1rem; color: #333; margin-bottom: 2rem; text-align: center; max-width: 400px; }
    .s4ft-link { color: #2563eb; text-decoration: none; font-weight: bold; }
    .s4ft-footer { margin-top: 2rem; color: #888; font-size: 0.95rem; }
    .s4ft-docs { background: #e0f2fe; border: 1px solid #38bdf8; color: #0369a1; padding: 1rem 2rem; border-radius: 8px; margin-bottom: 2rem; font-size: 1.08rem; }
    .s4ft-error { background: #fee; border: 1px solid #fcc; padding: 1rem; margin: 1rem; border-radius: 4px; }
  </style>
</head>
<body>
  <div id="root">
    <img src="/placeholder-logo.svg" alt="Logo S4FT" class="s4ft-logo" />
    <div class="s4ft-title">Bem-vindo ao S4FT 🚀</div>
    <div class="s4ft-docs">
      📚 <b>Documentação:</b> <a href="https://www.s4ft.fun/docs" class="s4ft-link" target="_blank">https://www.s4ft.fun/docs</a>
    </div>
    <div class="s4ft-desc">
      Parabéns! Seu servidor S4FT está rodando.<br>
      Você faz parte de uma nova geração de desenvolvedores brasileiros.<br>
      <br>
      <b>Você não está sozinho!</b> Se precisar de ajuda, visite <a href="https://www.s4ft.fun" class="s4ft-link" target="_blank">nosso site</a>.<br>
      Venha contribuir e tornar realidade essa mudança no desenvolvimento web nacional!
    </div>
    <div class="s4ft-footer">
      <a href="https://www.s4ft.fun" class="s4ft-link" target="_blank">www.s4ft.fun</a>
    </div>
  </div>
  <script>
    // Hot reload WebSocket connection
    const ws = new WebSocket('ws://localhost:${this.options.port}');
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'reload') {
        window.location.reload();
      }
    };
    // Load and render the app
    fetch('/app-bundle.js')
      .then(response => response.text())
      .then(code => {
        try {
          const transformedCode = Babel.transform(code, {
            presets: ['react']
          }).code;
          eval(transformedCode);
        } catch (error) {
          document.getElementById('root').innerHTML += 
            '<div class="s4ft-error"><h2>Compilation Error</h2><pre>' + 
            error.message + '</pre></div>';
        }
      });
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
        res.status(404).send("Page not found");
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
    res.send(`
      <!DOCTYPE html>
      <html lang="pt-br">
        <head>
          <meta charset="UTF-8">
          <title>S4FT SSR</title>
        </head>
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

    // Não crie o App padrão! Apenas renderize o App gerado pelo transpiler
    bundleCode += `
ReactDOM.render(React.createElement(App), document.getElementById('root'));
    `
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
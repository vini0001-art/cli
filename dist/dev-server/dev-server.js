"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DevServer = void 0;
exports.getServerSideProps = getServerSideProps;
const express_1 = __importDefault(require("express"));
const http_1 = require("http");
const ws_1 = __importDefault(require("ws"));
const chokidar_1 = __importDefault(require("chokidar"));
const path_1 = __importDefault(require("path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const parser_js_1 = require("../parser/parser.js");
const transpiler_js_1 = require("../transpiler/transpiler.js");
const server_1 = require("react-dom/server");
const middleware_js_1 = __importDefault(require("../middleware.js")); // ajuste: inclua a extensão se estiver usando ES Modules
// import authMiddleware from "../../authMiddleware";
const cors_1 = __importDefault(require("cors"));
// import config from "../s4ft.config";
let config = {};
class DevServer {
    constructor(options) {
        this.options = options;
        this.app = (0, express_1.default)();
        this.app.use(middleware_js_1.default);
        this.app.use((0, cors_1.default)());
        // this.app.use(authMiddleware);
        this.transpiler = new transpiler_js_1.Transpiler();
        // Carregue o config dinamicamente se existir
        this.loadConfig();
        this.setupMiddleware();
        this.setupBundleRoute();
        this.setupRoutes();
        this.server = (0, http_1.createServer)(this.app);
        this.wss = new ws_1.default.WebSocketServer({ server: this.server });
        this.setupWebSocket();
        this.setupFileWatcher();
        this.setupPlugins();
    }
    async loadConfig() {
        // Suporte para s4ft.config.ts (ESM)
        const configPathTs = path_1.default.join(this.options.projectRoot, "src", "s4ft.config.ts");
        const configPathRootTs = path_1.default.join(this.options.projectRoot, "s4ft.config.ts");
        let configModule;
        try {
            if (await fs_extra_1.default.pathExists(configPathTs)) {
                configModule = await Promise.resolve(`${configPathTs + "?ts"}`).then(s => __importStar(require(s)));
            }
            else if (await fs_extra_1.default.pathExists(configPathRootTs)) {
                configModule = await Promise.resolve(`${configPathRootTs + "?ts"}`).then(s => __importStar(require(s)));
            }
            if (configModule && configModule.default) {
                config = configModule.default;
            }
            else if (configModule) {
                config = configModule;
            }
        }
        catch (e) {
            config = {};
        }
    }
    setupMiddleware() {
        this.app.use(express_1.default.static(path_1.default.join(this.options.projectRoot, "public")));
        this.app.use(express_1.default.json());
    }
    setupBundleRoute() {
        this.app.get("/app-bundle.js", async (req, res) => {
            try {
                const bundle = await this.getAppBundle();
                res.type("application/javascript").send(bundle);
            }
            catch (error) {
                res.status(500).send(`// Error generating bundle: ${error.message}`);
            }
        });
    }
    setupRoutes() {
        // Remova ou comente as linhas abaixo:
        // this.app.get("/", (req, res) => {
        //   const htmlContent = this.generateIndexHTML()
        //   res.send(htmlContent)
        // })
        this.app.get("/api/:endpoint", this.handleAPIRoutes.bind(this));
        this.app.use(this.handlePageRoutes.bind(this)); // SSR para todas as rotas, inclusive "/"
    }
    generateIndexHTML() {
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
    `;
    }
    async handleAPIRoutes(req, res) {
        const apiPath = req.params.endpoint;
        if (!apiPath) {
            res.status(400).json({ error: "API path inválido ou ausente" });
            return;
        }
        const apiFile = path_1.default.join(this.options.appDir, "api", `${apiPath}.sft`);
        if (await fs_extra_1.default.pathExists(apiFile)) {
            try {
                const content = await fs_extra_1.default.readFile(apiFile, "utf-8");
                const parser = new parser_js_1.Parser(content);
                const ast = parser.parse();
                res.json({ message: "API route handled", path: apiPath });
            }
            catch (error) {
                res.status(500).json({ error: error.message });
            }
        }
        else {
            res.status(404).json({ error: "API route not found" });
        }
    }
    // Adicione este método na classe DevServer:
    async matchDynamicRoute(reqPath) {
        const appFiles = await this.finds4ftFiles(this.options.appDir);
        for (const file of appFiles) {
            const relPath = path_1.default.relative(this.options.appDir, file).replace(/\\/g, "/");
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
                const params = {};
                paramNames.forEach((name, i) => params[name] = paramValues[i]);
                return { file, params };
            }
        }
        return null;
    }
    // Modifique o método handlePageRoutes para usar a busca dinâmica:
    async handlePageRoutes(req, res) {
        let pagePath = req.path === "/" ? "/page" : req.path;
        if (pagePath.endsWith("/")) {
            pagePath += "page";
        }
        const pageFile = path_1.default.join(this.options.appDir, `${pagePath}.sft`);
        let sftFile = pageFile;
        let params = {};
        if (!(await fs_extra_1.default.pathExists(pageFile))) {
            // Tenta encontrar rota dinâmica
            const dynamicMatch = await this.matchDynamicRoute(req.path);
            if (dynamicMatch) {
                sftFile = dynamicMatch.file;
                params = dynamicMatch.params;
            }
            else {
                res.send(this.generateIndexHTML());
                return;
            }
        }
        // Transpile o .sft para React
        const content = await fs_extra_1.default.readFile(sftFile, "utf-8");
        const parser = new parser_js_1.Parser(content);
        const ast = parser.parse();
        const jsCode = this.transpiler.transpile(ast);
        // Crie o componente React dinamicamente
        // (Aqui é um exemplo simplificado, idealmente use require-from-string ou transpile para um módulo)
        // Supondo que jsCode exporta um componente chamado PageComponent
        let PageComponent;
        try {
            // eslint-disable-next-line no-eval
            PageComponent = eval(`(function(require, module, exports){${jsCode}; return module.exports.PageComponent || module.exports.default;})`)(require, { exports: {} }, {});
        }
        catch (e) {
            res.status(500).send("Erro ao compilar componente: " + e);
            return;
        }
        // Renderize para HTML usando SSR
        let html = "";
        try {
            html = (0, server_1.renderToString)(PageComponent ? PageComponent(params) : null);
        }
        catch (e) {
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
    setupWebSocket() {
        this.wss.on("connection", (ws) => {
            console.log("Client connected for hot reload");
            ws.on("close", () => {
                console.log("Client disconnected");
            });
        });
    }
    setupFileWatcher() {
        const watcher = chokidar_1.default.watch([
            path_1.default.join(this.options.appDir, "**/*.sft"),
            path_1.default.join(this.options.projectRoot, "components/**/*.sft"),
            path_1.default.join(this.options.projectRoot, "styles/**/*.css"),
        ]);
        watcher.on("change", (filePath) => {
            console.log(`File changed: ${filePath}`);
            this.notifyClients("reload");
        });
        watcher.on("add", (filePath) => {
            console.log(`File added: ${filePath}`);
            this.notifyClients("reload");
        });
        watcher.on("unlink", (filePath) => {
            console.log(`File removed: ${filePath}`);
            this.notifyClients("reload");
        });
    }
    notifyClients(type) {
        const message = JSON.stringify({ type });
        this.wss.clients.forEach((client) => {
            if (client.readyState === client.OPEN) {
                client.send(message);
            }
        });
    }
    async getAppBundle() {
        const appFiles = await this.finds4ftFiles(this.options.appDir);
        let bundleCode = "";
        for (const file of appFiles) {
            try {
                const content = await fs_extra_1.default.readFile(file, "utf-8");
                const parser = new parser_js_1.Parser(content);
                const ast = parser.parse();
                const jsCode = this.transpiler.transpile(ast);
                bundleCode += jsCode + "\n\n";
            }
            catch (error) {
                console.error(`Error transpiling ${file}:`, error);
            }
        }
        // Remova ou comente este bloco:
        // bundleCode += `
        // const App = () => {
        //   return React.createElement('div', null, 's4ft App Running!');
        // };
        // ReactDOM.render(React.createElement(App), document.getElementById('root'));
        // `
        return bundleCode;
    }
    async finds4ftFiles(dir) {
        const files = [];
        if (!(await fs_extra_1.default.pathExists(dir))) {
            return files;
        }
        const entries = await fs_extra_1.default.readdir(dir, { withFileTypes: true });
        for (const entry of entries) {
            const fullPath = path_1.default.join(dir, entry.name);
            if (entry.isDirectory()) {
                files.push(...(await this.finds4ftFiles(fullPath)));
            }
            else if (entry.name.endsWith(".sft")) {
                files.push(fullPath);
            }
        }
        return files;
    }
    setupPlugins() {
        // Adicione as declarações dos hooks aqui
        const buildHooks = [];
        const renderHooks = [];
        const hooks = {
            onRoute: (route, handler) => this.app.use(route, handler),
            onBuild: (fn) => buildHooks.push(fn),
            onRender: (fn) => renderHooks.push(fn),
            // ...outros hooks
        };
        for (const plugin of config.plugins) {
            let mod = plugin;
            if (typeof plugin === "string") {
                mod = require(plugin); // carrega do node_modules
            }
            if (mod && typeof mod.setup === "function") {
                mod.setup(hooks);
            }
            else if (typeof mod === "function") {
                mod(hooks);
            }
        }
    }
    start() {
        return new Promise((resolve) => {
            this.server.listen(this.options.port, () => {
                console.log(`🚀 s4ft dev server running on http://localhost:${this.options.port}`);
                resolve();
            });
        });
    }
    stop() {
        this.server.close();
        this.wss.close();
    }
}
exports.DevServer = DevServer;
// Ponto de entrada: só execute se chamado diretamente (não em import)
if (require.main === module) {
    const server = new DevServer({
        projectRoot: process.cwd(),
        appDir: path_1.default.join(process.cwd(), "app"),
        port: 3000
    });
    server.start();
}
// No .sft
async function getServerSideProps(context) {
    return { props: {} };
}
//# sourceMappingURL=dev-server.js.map

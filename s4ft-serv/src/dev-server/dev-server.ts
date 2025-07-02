import express from "express"
import path from "path"
import fs from "fs-extra"
import chokidar from "chokidar"
import { WebSocketServer } from "ws"
import { createServer } from "http"
import chalk from "chalk"
import { parseS4FT } from "../parser/parser.js"
import { transpileS4FT } from "../transpiler/transpiler.js"
import net from "net"

export async function startDevServer(port = 3000) {
  const app = express()
  const server = createServer(app)
  const wss = new WebSocketServer({ server })

  console.log(chalk.blue("🚀 Iniciando servidor de desenvolvimento S4FT..."))

  // Middleware para servir arquivos estáticos
  app.use(express.static("public"))
  app.use("/assets", express.static("assets"))

  // Middleware para processar arquivos .s4ft
  app.use(async (req, res, s4ft) => {
    try {
      if (req.path.endsWith(".js") || req.path.endsWith(".tsx")) {
        const s4ftPath = req.path.replace(/\.(js|tsx)$/, ".s4ft")
        const fullS4ftPath = path.join(process.cwd(), "app", s4ftPath)

        if (await fs.pathExists(fullS4ftPath)) {
          const s4ftContent = await fs.readFile(fullS4ftPath, "utf-8")
          const ast = parseS4FT(s4ftContent)
          const reactCode = transpileS4FT(ast)

          res.setHeader("Content-Type", "application/javascript")
          res.send(reactCode)
          return
        }
      }

      s4ft()
    } catch (error) {
      console.error(chalk.red("Erro ao processar arquivo S4FT:"), error)
      res.status(500).send(`Erro de compilação: ${error}`)
    }
  })

  // Rota principal
  app.get("/", async (req, res) => {
    try {
      const indexPath = path.join(process.cwd(), "app", "page.s4ft")

      if (await fs.pathExists(indexPath)) {
        const s4ftContent = await fs.readFile(indexPath, "utf-8")
        const ast = parseS4FT(s4ftContent)
        const reactCode = transpileS4FT(ast)

        const html = generateHTML(reactCode)
        res.send(html)
      } else {
        res.send(generateWelcomeHTML())
      }
    } catch (error) {
      console.error(chalk.red("Erro ao servir página:"), error)
      res.status(500).send(`Erro: ${error}`)
    }
  })

  // WebSocket para hot reload
  wss.on("connection", (ws) => {
    console.log(chalk.green("🔌 Cliente conectado para hot reload"))

    ws.on("close", () => {
      console.log(chalk.yellow("🔌 Cliente desconectado"))
    })
  })

  // Watcher para hot reload
  const watcher = chokidar.watch(["app/**/*.s4ft", "components/**/*.s4ft"], {
    ignored: /node_modules/,
    persistent: true,
  })

  watcher.on("change", (filePath) => {
    console.log(chalk.cyan(`📝 Arquivo alterado: ${filePath}`))

    // Notificar todos os clientes conectados
    wss.clients.forEach((client) => {
      if (client.readyState === 1) {
        // WebSocket.OPEN
        client.send(JSON.stringify({ type: "reload" }))
      }
    })
  })

  server.listen(port, () => {
    console.log(chalk.green.bold(`✅ Servidor S4FT rodando em http://localhost:${port}`))
    console.log(chalk.cyan("📁 Watching for changes in .s4ft files..."))
    console.log(chalk.gray("Press Ctrl+C to stop"))
  })
}

function generateHTML(reactCode: string): string {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>S4FT App</title>
  <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    body { margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
  </style>
</head>
<body>
  <div id="root"></div>
  
  <script type="text/babel">
    ${reactCode}
    
    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(React.createElement(${getComponentName(reactCode)}));
  </script>
  
  <script>
    // Hot reload WebSocket
    const ws = new WebSocket('ws://localhost:${3000}');
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'reload') {
        window.location.reload();
      }
    };
  </script>
</body>
</html>`
}

function generateWelcomeHTML(): string {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bem-vindo ao S4FT</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gradient-to-br from-blue-400 to-purple-500 min-h-screen flex items-center justify-center">
  <div class="bg-white rounded-lg shadow-xl p-8 max-w-md w-full mx-4 text-center">
    <h1 class="text-3xl font-bold text-gray-800 mb-4">🇧🇷 S4FT Framework</h1>
    <p class="text-gray-600 mb-6">Simple And Fast Templates</p>
    <div class="space-y-4 text-left">
      <div class="bg-gray-50 p-4 rounded">
        <h3 class="font-semibold text-gray-800">Para começar:</h3>
        <ol class="list-decimal list-inside text-sm text-gray-600 mt-2 space-y-1">
          <li>Crie um arquivo <code class="bg-gray-200 px-1 rounded">app/page.s4ft</code></li>
          <li>Escreva seu primeiro componente S4FT</li>
          <li>Salve e veja a mágica acontecer! ✨</li>
        </ol>
      </div>
      <div class="bg-blue-50 p-4 rounded">
        <h3 class="font-semibold text-blue-800">Exemplo:</h3>
        <pre class="text-xs text-blue-600 mt-2 overflow-x-auto"><code>page Home {
  state {
    message: string = "Olá S4FT!"
  }
  
  &lt;div className="p-4"&gt;
    &lt;h1&gt;{message}&lt;/h1&gt;
  &lt;/div&gt;
}</code></pre>
      </div>
    </div>
  </div>
</body>
</html>`
}

function getComponentName(reactCode: string): string {
  const match = reactCode.match(/export default function (\w+)/)
  return match ? match[1] : "App"
}

export async function findFreePort(startPort = 3000, maxPort = 3100): Promise<number> {
  function check(port: number): Promise<boolean> {
    return new Promise((resolve) => {
      const server = net.createServer();
      server.once("error", () => resolve(false));
      server.once("listening", () => {
        server.close(() => resolve(true));
      });
      server.listen(port);
    });
  }
  for (let port = startPort; port <= maxPort; port++) {
    if (await check(port)) return port;
  }
  throw new Error("Nenhuma porta livre encontrada no intervalo.");
}

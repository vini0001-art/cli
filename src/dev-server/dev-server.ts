import express from "express"
import path from "path"
import fs from "fs-extra"
import chalk from "chalk"
import chokidar from "chokidar"
import { WebSocketServer } from "ws"
import { createServer } from "http"
import cors from "cors"

export async function startDevServer(port = 3000) {
  const app = express()
  const server = createServer(app)
  const wss = new WebSocketServer({ server })

  // Middleware
  app.use(cors())
  app.use(express.json())
  app.use(express.static("public"))

  // Hot reload WebSocket
  wss.on("connection", (ws) => {
    console.log(chalk.gray("🔌 Cliente conectado para hot reload"))

    ws.on("close", () => {
      console.log(chalk.gray("🔌 Cliente desconectado"))
    })
  })

  // Função para notificar mudanças
  function notifyReload() {
    wss.clients.forEach((client) => {
      if (client.readyState === 1) {
        // WebSocket.OPEN
        client.send(JSON.stringify({ type: "reload" }))
      }
    })
  }

  // Watch para mudanças nos arquivos
  const watcher = chokidar.watch(["app/**/*.s4ft", "components/**/*.s4ft", "styles/**/*"], {
    ignored: /node_modules/,
    persistent: true,
  })

  watcher.on("change", async (filePath) => {
    console.log(chalk.yellow(`📝 Arquivo alterado: ${filePath}`))

    // Transpilar arquivo alterado
    await transpileFile(filePath)

    // Notificar clientes para reload
    notifyReload()
  })

  // Rota principal
  app.get("/", async (req, res) => {
    try {
      const indexPath = path.join(process.cwd(), "app", "page.s4ft")

      if (await fs.pathExists(indexPath)) {
        const content = await fs.readFile(indexPath, "utf-8")
        const html = await transpileToHTML(content)
        res.send(html)
      } else {
        res.send(getWelcomePage())
      }
    } catch (error) {
      console.error(chalk.red("❌ Erro ao servir página:"), error)
      res.status(500).send("Erro interno do servidor")
    }
  })

  // Rota para páginas dinâmicas
  app.get("*", async (req, res) => {
    const pagePath = path.join(process.cwd(), "app", req.path, "page.s4ft")

    if (await fs.pathExists(pagePath)) {
      try {
        const content = await fs.readFile(pagePath, "utf-8")
        const html = await transpileToHTML(content)
        res.send(html)
      } catch (error) {
        console.error(chalk.red("❌ Erro ao transpilar página:"), error)
        res.status(500).send("Erro na transpilação")
      }
    } else {
      res.status(404).send("Página não encontrada")
    }
  })

  // Iniciar servidor
  server.listen(port, () => {
    console.log(
      chalk.green.bold(`
🚀 Servidor S4FT rodando!
🌐 Local:    http://localhost:${port}
🔥 Hot reload ativo
📁 Diretório: ${process.cwd()}
    `),
    )
  })

  // Graceful shutdown
  process.on("SIGINT", () => {
    console.log(chalk.yellow("\n👋 Encerrando servidor S4FT..."))
    watcher.close()
    server.close()
    process.exit(0)
  })
}

async function transpileFile(filePath: string) {
  try {
    const { transpileS4FT } = await import("../transpiler/transpiler")
    const content = await fs.readFile(filePath, "utf-8")
    const transpiled = transpileS4FT(content)

    // Salvar arquivo transpilado
    const outputPath = filePath.replace(".s4ft", ".tsx").replace(/^app/, "dist/app")
    await fs.ensureDir(path.dirname(outputPath))
    await fs.writeFile(outputPath, transpiled)

    console.log(chalk.green(`✅ Transpilado: ${filePath} → ${outputPath}`))
  } catch (error) {
    console.error(chalk.red(`❌ Erro ao transpilar ${filePath}:`), error)
  }
}

async function transpileToHTML(s4ftContent: string): Promise<string> {
  const { transpileS4FT } = await import("../transpiler/transpiler")
  const jsxContent = transpileS4FT(s4ftContent)

  // HTML básico com hot reload
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>S4FT App</title>
  <script src="https://unpkg.com/react@18/umd/react.development.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
  <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
  <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
</head>
<body>
  <div id="root"></div>
  
  <script type="text/babel">
    ${jsxContent}
    
    ReactDOM.render(React.createElement(App), document.getElementById('root'));
  </script>
  
  <script>
    // Hot reload WebSocket
    const ws = new WebSocket('ws://localhost:3000');
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

function getWelcomePage(): string {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bem-vindo ao S4FT</title>
  <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
</head>
<body class="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
  <div class="container mx-auto px-4 py-16 text-center">
    <h1 class="text-6xl font-bold text-gray-900 mb-4">🚀 S4FT Framework</h1>
    <p class="text-xl text-gray-600 mb-8">Simple And Fast Templates</p>
    
    <div class="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
      <h2 class="text-2xl font-bold mb-4">Bem-vindo ao seu projeto S4FT!</h2>
      <p class="text-gray-600 mb-6">Para começar, crie seu primeiro arquivo:</p>
      
      <div class="bg-gray-100 p-4 rounded-lg text-left">
        <code class="text-sm">
          // app/page.s4ft<br>
          page Home {<br>
          &nbsp;&nbsp;state {<br>
          &nbsp;&nbsp;&nbsp;&nbsp;message: string = "Olá S4FT!"<br>
          &nbsp;&nbsp;}<br>
          <br>
          &nbsp;&nbsp;&lt;div className="text-center"&gt;<br>
          &nbsp;&nbsp;&nbsp;&nbsp;&lt;h1&gt;{message}&lt;/h1&gt;<br>
          &nbsp;&nbsp;&lt;/div&gt;<br>
          }
        </code>
      </div>
      
      <div class="mt-6 text-sm text-gray-500">
        <p>🔥 Hot reload ativo - suas mudanças aparecerão automaticamente!</p>
      </div>
    </div>
  </div>
</body>
</html>`
}

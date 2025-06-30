import chalk from "chalk"
import inquirer from "inquirer"
import fs from "fs-extra"
import path from "path"
import { aiManager } from "../ai/ai-providers"

export async function aiGenerateCommand(type: string, name: string, options: any) {
  console.log(chalk.blue(`🤖 Gerando ${type} com IA...`))

  try {
    // Configurar provider se especificado
    if (options.provider) {
      const success = aiManager.setProvider(options.provider)
      if (!success) {
        console.log(chalk.red(`❌ Provider '${options.provider}' não encontrado`))
        console.log(chalk.yellow(`Providers disponíveis: ${aiManager.getAvailableProviders().join(", ")}`))
        return
      }
    }

    // Prompt personalizado ou usar nome
    const prompt = options.prompt || `Criar um ${type} chamado ${name}`

    console.log(chalk.gray(`📝 Prompt: ${prompt}`))
    console.log(chalk.gray(`🔧 Provider: ${aiManager.getCurrentProvider().name}`))

    // Gerar código com IA
    const generatedCode = await aiManager.generateCode(prompt, type as any)

    // Determinar caminho do arquivo
    const filePath = getFilePath(type, name, options.directory)

    // Criar diretório se não existir
    await fs.ensureDir(path.dirname(filePath))

    // Salvar arquivo
    await fs.writeFile(filePath, generatedCode)

    console.log(chalk.green(`✅ ${type} gerado com sucesso!`))
    console.log(chalk.cyan(`📁 Arquivo: ${filePath}`))

    // Mostrar preview do código
    if (options.preview) {
      console.log(chalk.yellow("\n📋 Preview do código gerado:"))
      console.log(chalk.gray("─".repeat(50)))
      console.log(generatedCode.slice(0, 500) + (generatedCode.length > 500 ? "..." : ""))
      console.log(chalk.gray("─".repeat(50)))
    }
  } catch (error) {
    console.error(chalk.red("❌ Erro ao gerar com IA:"), error)
  }
}

export async function aiChatCommand() {
  console.log(chalk.blue("🤖 S4FT AI Assistant"))
  console.log(chalk.gray('Digite "sair" para encerrar\n'))

  // Detectar contexto do projeto
  const context = await detectProjectContext()

  while (true) {
    const { message } = await inquirer.prompt([
      {
        type: "input",
        name: "message",
        message: "💬",
        prefix: "",
      },
    ])

    if (message.toLowerCase() === "sair") {
      console.log(chalk.yellow("👋 Até logo!"))
      break
    }

    if (!message.trim()) continue

    try {
      console.log(chalk.gray("🤔 Pensando..."))

      const response = await aiManager.chat(message, context)

      console.log(chalk.green("\n🤖 Assistente:"))
      console.log(chalk.white(response))
      console.log("")
    } catch (error) {
      console.error(chalk.red("❌ Erro na conversa:"), error)
    }
  }
}

export async function aiImageCommand(prompt: string, options: any) {
  console.log(chalk.blue("🎨 Gerando imagem com IA..."))

  try {
    console.log(chalk.gray(`📝 Prompt: ${prompt}`))
    console.log(chalk.gray(`🔧 Provider: Fal (especializado em imagens)`))

    const imageUrl = await aiManager.generateImage(prompt)

    if (imageUrl.startsWith("http")) {
      console.log(chalk.green("✅ Imagem gerada com sucesso!"))
      console.log(chalk.cyan(`🖼️  URL: ${imageUrl}`))

      // Salvar imagem se solicitado
      if (options.save) {
        const imagePath = path.join(process.cwd(), "public", "ai-generated", `${Date.now()}.png`)
        await fs.ensureDir(path.dirname(imagePath))

        // Download e salvar imagem
        const response = await fetch(imageUrl)
        const buffer = await response.arrayBuffer()
        await fs.writeFile(imagePath, Buffer.from(buffer))

        console.log(chalk.green(`💾 Imagem salva: ${imagePath}`))
      }
    } else {
      console.log(chalk.yellow(`⚠️  ${imageUrl}`))
    }
  } catch (error) {
    console.error(chalk.red("❌ Erro ao gerar imagem:"), error)
  }
}

export async function aiProviderCommand(action?: string, provider?: string) {
  if (action === "list") {
    console.log(chalk.blue("🤖 Providers de IA disponíveis:"))
    const providers = aiManager.getAvailableProviders()
    const current = aiManager.getCurrentProvider().name.toLowerCase()

    providers.forEach((p) => {
      const marker = p === current ? chalk.green("✓") : " "
      const description = getProviderDescription(p)
      console.log(`${marker} ${p} - ${description}`)
    })
    return
  }

  if (action === "set" && provider) {
    const success = aiManager.setProvider(provider)
    if (success) {
      console.log(chalk.green(`✅ Provider alterado para: ${provider}`))
    } else {
      console.log(chalk.red(`❌ Provider '${provider}' não encontrado`))
    }
    return
  }

  // Modo interativo
  const { selectedProvider } = await inquirer.prompt([
    {
      type: "list",
      name: "selectedProvider",
      message: "Escolha o provider de IA:",
      choices: aiManager.getAvailableProviders().map((p) => ({
        name: `${p} - ${getProviderDescription(p)} ${p === aiManager.getCurrentProvider().name.toLowerCase() ? "(atual)" : ""}`,
        value: p,
      })),
    },
  ])

  aiManager.setProvider(selectedProvider)
  console.log(chalk.green(`✅ Provider alterado para: ${selectedProvider}`))
}

export async function aiOptimizeCommand(filePath: string) {
  console.log(chalk.blue("⚡ Otimizando código com IA..."))

  try {
    // Ler arquivo existente
    const code = await fs.readFile(filePath, "utf-8")

    // Prompt para otimização
    const prompt = `Otimize este código S4FT para melhor performance, legibilidade e melhores práticas:

${code}

Mantenha a funcionalidade original mas melhore:
- Performance
- Legibilidade
- Estrutura
- Comentários
- Tratamento de erros`

    const optimizedCode = await aiManager.generateCode(prompt, "function")

    // Criar backup
    const backupPath = `${filePath}.backup`
    await fs.copy(filePath, backupPath)

    // Salvar código otimizado
    await fs.writeFile(filePath, optimizedCode)

    console.log(chalk.green("✅ Código otimizado com sucesso!"))
    console.log(chalk.cyan(`📁 Arquivo: ${filePath}`))
    console.log(chalk.gray(`💾 Backup: ${backupPath}`))
  } catch (error) {
    console.error(chalk.red("❌ Erro ao otimizar:"), error)
  }
}

// Utilitários
function getProviderDescription(provider: string): string {
  switch (provider) {
    case "groq":
      return "Inferência rápida para código"
    case "grok":
      return "Assistente criativo da xAI"
    case "fal":
      return "Geração de imagens"
    default:
      return "Provider de IA"
  }
}

function getFilePath(type: string, name: string, directory?: string): string {
  const kebabName = toKebabCase(name)

  switch (type) {
    case "component":
      return path.join(process.cwd(), directory || "components", `${kebabName}.s4ft`)
    case "page":
      return path.join(process.cwd(), directory || "app", kebabName, "page.s4ft")
    case "api":
      return path.join(process.cwd(), directory || "app/api", kebabName, "route.ts")
    case "function":
      return path.join(process.cwd(), directory || "lib", `${kebabName}.ts`)
    default:
      return path.join(process.cwd(), `${kebabName}.ts`)
  }
}

function toKebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .toLowerCase()
}

async function detectProjectContext(): Promise<string> {
  try {
    const packageJson = await fs.readJson(path.join(process.cwd(), "package.json"))
    const s4ftConfig = await fs.pathExists(path.join(process.cwd(), "s4ft.config.ts"))

    let context = `Projeto: ${packageJson.name || "Desconhecido"}\n`

    if (s4ftConfig) {
      context += "Framework: S4FT\n"
    }

    if (packageJson.dependencies) {
      const deps = Object.keys(packageJson.dependencies)
      context += `Dependências principais: ${deps.slice(0, 5).join(", ")}\n`
    }

    return context
  } catch {
    return "Contexto do projeto não detectado"
  }
}

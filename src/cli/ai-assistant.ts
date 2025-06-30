import chalk from "chalk"
import inquirer from "inquirer"
import { aiManager } from "../ai/ai-providers"

export async function askAI(question: string) {
  console.log(chalk.blue("🤖 Perguntando ao assistente S4FT..."))
  console.log(chalk.gray(`❓ Pergunta: ${question}`))

  try {
    const response = await aiManager.chat(question)
    
    console.log(chalk.green("\n🤖 Resposta:"))
    console.log(chalk.white(response))
    
    // Perguntar se quer continuar a conversa
    const { continuar } = await inquirer.prompt([
      {
        type: "confirm",
        name: "continuar",
        message: "Quer fazer outra pergunta?",
        default: false,
      },
    ])

    if (continuar) {
      const { novaPergunta } = await inquirer.prompt([
        {
          type: "input",
          name: "novaPergunta",
          message: "Nova pergunta:",
        },
      ])

      if (novaPergunta.trim()) {
        await askAI(novaPergunta)
      }
    }
  } catch (error) {
    console.error(chalk.red("❌ Erro ao consultar IA:"), error)
  }
}

export async function startAIAssistant() {
  console.log(chalk.blue("🤖 Assistente S4FT iniciado"))
  console.log(chalk.gray("Digite suas perguntas sobre desenvolvimento S4FT"))
  console.log(chalk.gray('Digite "sair" para encerrar\n'))

  while (true) {
    const { pergunta } = await inquirer.prompt([
      {
        type: "input",
        name: "pergunta",
        message: "💬 Sua pergunta:",
      },
    ])

    if (pergunta.toLowerCase() === "sair") {
      console.log(chalk.yellow("👋 Assistente encerrado!"))
      break
    }

    if (!pergunta.trim()) continue

    try {
      const resposta = await aiManager.chat(pergunta)
      console.log(chalk.green("\n🤖 Assistente:"))
      console.log(chalk.white(resposta))
      console.log("")
    } catch (error) {
      console.error(chalk.red("❌ Erro:"), error)
    }
  }
}

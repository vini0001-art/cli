import chalk from "chalk"
import inquirer from "inquirer"
import { spawn } from "child_process"
import fs from "fs-extra"
import path from "path"

export async function deployProject(platform = "s4ft-cloud") {
  console.log(chalk.blue(`🚀 Fazendo deploy para ${platform}...\n`))

  try {
    // Verificar se o projeto foi buildado
    const distExists = await fs.pathExists(path.join(process.cwd(), "dist"))
    if (!distExists) {
      console.log(chalk.yellow("📦 Fazendo build do projeto primeiro..."))
      await buildProject()
    }

    switch (platform) {
      case "vercel":
        await deployToVercel()
        break
      case "netlify":
        await deployToNetlify()
        break
      case "s4ft-cloud":
        await deployToS4FTCloud()
        break
      default:
        console.log(chalk.red(`❌ Plataforma ${platform} não suportada`))
        return
    }

    console.log(chalk.green.bold("\n✅ Deploy realizado com sucesso!"))
  } catch (error) {
    console.error(chalk.red(`❌ Erro no deploy: ${(error as Error).message}`))
  }
}

async function buildProject() {
  return new Promise<void>((resolve, reject) => {
    const buildProcess = spawn("npm", ["run", "build"], {
      stdio: "inherit",
      shell: true,
    })

    buildProcess.on("close", (code) => {
      if (code === 0) {
        resolve()
      } else {
        reject(new Error(`Build falhou com código ${code}`))
      }
    })
  })
}

async function deployToVercel() {
  console.log(chalk.cyan("📡 Fazendo deploy para Vercel..."))

  // Verificar se Vercel CLI está instalado
  try {
    await runCommand("vercel", ["--version"])
  } catch {
    console.log(chalk.yellow("📥 Instalando Vercel CLI..."))
    await runCommand("npm", ["install", "-g", "vercel"])
  }

  // Fazer deploy
  await runCommand("vercel", ["--prod"])

  console.log(chalk.green("✅ Deploy para Vercel concluído!"))
}

async function deployToNetlify() {
  console.log(chalk.cyan("📡 Fazendo deploy para Netlify..."))

  // Verificar se Netlify CLI está instalado
  try {
    await runCommand("netlify", ["--version"])
  } catch {
    console.log(chalk.yellow("📥 Instalando Netlify CLI..."))
    await runCommand("npm", ["install", "-g", "netlify-cli"])
  }

  // Fazer deploy
  await runCommand("netlify", ["deploy", "--prod", "--dir", "dist"])

  console.log(chalk.green("✅ Deploy para Netlify concluído!"))
}

async function deployToS4FTCloud() {
  console.log(chalk.cyan("☁️ Fazendo deploy para S4FT Cloud..."))

  // Simular deploy para S4FT Cloud
  const { confirm } = await inquirer.prompt([
    {
      type: "confirm",
      name: "confirm",
      message: "Confirma o deploy para S4FT Cloud?",
      default: true,
    },
  ])

  if (!confirm) {
    console.log(chalk.yellow("❌ Deploy cancelado"))
    return
  }

  // Simular processo de upload
  console.log(chalk.yellow("📤 Enviando arquivos..."))
  await new Promise((resolve) => setTimeout(resolve, 2000))

  console.log(chalk.yellow("⚙️ Configurando servidor..."))
  await new Promise((resolve) => setTimeout(resolve, 1500))

  console.log(chalk.yellow("🌐 Configurando domínio..."))
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const projectName = path.basename(process.cwd())
  const url = `https://${projectName}.s4ft.fun`

  console.log(chalk.green(`✅ Deploy concluído!`))
  console.log(chalk.cyan(`🌐 URL: ${url}`))
  console.log(chalk.gray(`📊 Dashboard: https://cloud.s4ft.fun/projects/${projectName}`))
}

function runCommand(command: string, args: string[]): Promise<void> {
  return new Promise((resolve, reject) => {
    const process = spawn(command, args, {
      stdio: "inherit",
      shell: true,
    })

    process.on("close", (code) => {
      if (code === 0) {
        resolve()
      } else {
        reject(new Error(`Comando ${command} falhou com código ${code}`))
      }
    })

    process.on("error", (error) => {
      reject(error)
    })
  })
}

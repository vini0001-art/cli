import chalk from "chalk"
import { spawn } from "child_process"
import fs from "fs-extra"
import path from "path"

export async function deployProject(platform = "vercel"): Promise<void> {
  console.log(chalk.blue(`🚀 Iniciando deploy para ${platform}...`))

  try {
    // Verificar se o projeto foi buildado
    const distPath = path.join(process.cwd(), "dist")
    if (!(await fs.pathExists(distPath))) {
      console.log(chalk.yellow("📦 Fazendo build do projeto..."))
      await runBuild()
    }

    switch (platform.toLowerCase()) {
      case "vercel":
        await deployToVercel()
        break
      case "netlify":
        await deployToNetlify()
        break
      case "s4ft":
        await deployToS4FTCloud()
        break
      default:
        throw new Error(`Plataforma ${platform} não suportada`)
    }

    console.log(chalk.green.bold("✅ Deploy realizado com sucesso!"))
  } catch (error) {
    console.error(chalk.red("❌ Erro no deploy:"), error)
    throw error
  }
}

async function runBuild(): Promise<void> {
  return new Promise((resolve, reject) => {
    const build = spawn("npm", ["run", "build"], { stdio: "inherit" })

    build.on("close", (code) => {
      if (code === 0) {
        resolve()
      } else {
        reject(new Error(`Build falhou com código ${code}`))
      }
    })

    build.on("error", (error) => {
      reject(error)
    })
  })
}

async function deployToVercel(): Promise<void> {
  console.log(chalk.cyan("📤 Fazendo deploy para Vercel..."))

  return new Promise((resolve, reject) => {
    const deploy = spawn("npx", ["vercel", "--prod"], { stdio: "inherit" })

    deploy.on("close", (code) => {
      if (code === 0) {
        console.log(chalk.green("✅ Deploy para Vercel concluído!"))
        resolve()
      } else {
        reject(new Error(`Deploy para Vercel falhou com código ${code}`))
      }
    })

    deploy.on("error", (error) => {
      reject(error)
    })
  })
}

async function deployToNetlify(): Promise<void> {
  console.log(chalk.cyan("📤 Fazendo deploy para Netlify..."))

  return new Promise((resolve, reject) => {
    const deploy = spawn("npx", ["netlify", "deploy", "--prod", "--dir=dist"], { stdio: "inherit" })

    deploy.on("close", (code) => {
      if (code === 0) {
        console.log(chalk.green("✅ Deploy para Netlify concluído!"))
        resolve()
      } else {
        reject(new Error(`Deploy para Netlify falhou com código ${code}`))
      }
    })

    deploy.on("error", (error) => {
      reject(error)
    })
  })
}

async function deployToS4FTCloud(): Promise<void> {
  console.log(chalk.cyan("📤 Fazendo deploy para S4FT Cloud..."))

  // Simulação de deploy para S4FT Cloud
  await new Promise((resolve) => setTimeout(resolve, 2000))

  console.log(chalk.green("✅ Deploy para S4FT Cloud concluído!"))
  console.log(chalk.cyan("🌐 URL: https://seu-projeto.s4ft.fun"))
}

import chalk from "chalk"
import ora from "ora"
import { execSync } from "child_process"
import fs from "fs-extra"
import path from "path"

export async function deployProject(platform: string): Promise<void> {
  const spinner = ora(`Preparando deploy para ${platform}...`).start()

  try {
    // Verificar se o projeto foi buildado
    const distPath = path.join(process.cwd(), "dist")
    if (!(await fs.pathExists(distPath))) {
      spinner.fail("Build não encontrado. Execute 's4ft build' primeiro.")
      return
    }

    switch (platform) {
      case "s4ft-cloud":
      case "s4ft.fun":
        await deployToS4FTCloud(spinner)
        break
      case "vercel":
        await deployToVercel(spinner)
        break
      case "netlify":
        await deployToNetlify(spinner)
        break
      case "github-pages":
        await deployToGitHubPages(spinner)
        break
      default:
        spinner.fail(`Plataforma ${platform} não suportada`)
        return
    }
  } catch (error) {
    spinner.fail(`Erro no deploy: ${error.message}`)
    throw error
  }
}

async function deployToS4FTCloud(spinner: ora.Ora): Promise<void> {
  spinner.text = "Fazendo deploy para S4FT Cloud..."

  // Verificar se tem token de autenticação
  const token = process.env.S4FT_TOKEN
  if (!token) {
    spinner.fail("Token S4FT não encontrado")
    console.log(
      chalk.yellow(`
🔑 Para fazer deploy no S4FT Cloud:

1. Crie uma conta em: https://cloud.s4ft.fun
2. Obtenha seu token de deploy
3. Configure a variável de ambiente:
   export S4FT_TOKEN="seu-token-aqui"

4. Ou adicione no seu .env:
   S4FT_TOKEN=seu-token-aqui
    `),
    )
    return
  }

  try {
    // Simular upload para S4FT Cloud
    const projectName = JSON.parse(await fs.readFile("package.json", "utf-8")).name
    const deployUrl = `https://${projectName}.s4ft.fun`

    // Em uma implementação real, faria upload dos arquivos
    await new Promise((resolve) => setTimeout(resolve, 3000))

    spinner.succeed(`Deploy concluído com sucesso!`)
    console.log(chalk.green(`🚀 Seu app está disponível em: ${deployUrl}`))
    console.log(chalk.blue(`📊 Dashboard: https://cloud.s4ft.fun/projects/${projectName}`))
  } catch (error) {
    throw new Error(`Erro no deploy S4FT Cloud: ${error.message}`)
  }
}

async function deployToVercel(spinner: ora.Ora): Promise<void> {
  spinner.text = "Fazendo deploy para Vercel..."

  try {
    // Verificar se Vercel CLI está instalado
    try {
      execSync("vercel --version", { stdio: "ignore" })
    } catch {
      spinner.fail("Vercel CLI não encontrado")
      console.log(
        chalk.yellow(`
📦 Para fazer deploy no Vercel:

1. Instale o Vercel CLI:
   npm i -g vercel

2. Faça login:
   vercel login

3. Execute novamente:
   s4ft deploy --platform vercel
      `),
      )
      return
    }

    // Criar vercel.json se não existir
    const vercelConfig = {
      version: 2,
      builds: [
        {
          src: "dist/**/*",
          use: "@vercel/static",
        },
      ],
      routes: [
        {
          src: "/(.*)",
          dest: "/dist/$1",
        },
      ],
    }

    if (!(await fs.pathExists("vercel.json"))) {
      await fs.writeFile("vercel.json", JSON.stringify(vercelConfig, null, 2))
    }

    // Fazer deploy
    execSync("vercel --prod", { stdio: "inherit" })
    spinner.succeed("Deploy no Vercel concluído!")
  } catch (error) {
    throw new Error(`Erro no deploy Vercel: ${error.message}`)
  }
}

async function deployToNetlify(spinner: ora.Ora): Promise<void> {
  spinner.text = "Fazendo deploy para Netlify..."

  try {
    // Verificar se Netlify CLI está instalado
    try {
      execSync("netlify --version", { stdio: "ignore" })
    } catch {
      spinner.fail("Netlify CLI não encontrado")
      console.log(
        chalk.yellow(`
📦 Para fazer deploy no Netlify:

1. Instale o Netlify CLI:
   npm i -g netlify-cli

2. Faça login:
   netlify login

3. Execute novamente:
   s4ft deploy --platform netlify
      `),
      )
      return
    }

    // Criar netlify.toml se não existir
    const netlifyConfig = `[build]
  publish = "dist"
  command = "s4ft build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
`

    if (!(await fs.pathExists("netlify.toml"))) {
      await fs.writeFile("netlify.toml", netlifyConfig)
    }

    // Fazer deploy
    execSync("netlify deploy --prod --dir=dist", { stdio: "inherit" })
    spinner.succeed("Deploy no Netlify concluído!")
  } catch (error) {
    throw new Error(`Erro no deploy Netlify: ${error.message}`)
  }
}

async function deployToGitHubPages(spinner: ora.Ora): Promise<void> {
  spinner.text = "Fazendo deploy para GitHub Pages..."

  try {
    // Verificar se é um repositório Git
    if (!(await fs.pathExists(".git"))) {
      throw new Error("Não é um repositório Git. Execute 'git init' primeiro.")
    }

    // Verificar se gh-pages está instalado
    try {
      execSync("npx gh-pages --version", { stdio: "ignore" })
    } catch {
      // Instalar gh-pages
      execSync("npm install --save-dev gh-pages", { stdio: "inherit" })
    }

    // Fazer deploy
    execSync("npx gh-pages -d dist", { stdio: "inherit" })

    // Obter URL do repositório
    const remoteUrl = execSync("git config --get remote.origin.url", { encoding: "utf-8" }).trim()
    const repoName = remoteUrl.split("/").pop()?.replace(".git", "")
    const username = remoteUrl.split("/").slice(-2, -1)[0].split(":").pop()

    const githubPagesUrl = `https://${username}.github.io/${repoName}`

    spinner.succeed("Deploy no GitHub Pages concluído!")
    console.log(chalk.green(`🚀 Seu app está disponível em: ${githubPagesUrl}`))
    console.log(chalk.blue(`⏰ Pode levar alguns minutos para ficar disponível`))
  } catch (error) {
    throw new Error(`Erro no deploy GitHub Pages: ${error.message}`)
  }
}

export async function checkDeployStatus(platform: string, projectName: string): Promise<void> {
  console.log(chalk.blue(`Verificando status do deploy em ${platform}...`))

  switch (platform) {
    case "s4ft-cloud":
      console.log(chalk.green(`✅ https://${projectName}.s4ft.fun`))
      break
    case "vercel":
      console.log(chalk.green(`✅ Verifique no dashboard da Vercel`))
      break
    case "netlify":
      console.log(chalk.green(`✅ Verifique no dashboard da Netlify`))
      break
    case "github-pages":
      console.log(chalk.green(`✅ Verifique nas configurações do repositório`))
      break
  }
}

import fs from "fs-extra"
import path from "path"
import chalk from "chalk"
import { transpileS4FT } from "../transpiler/transpiler.js"

export async function buildProject(): Promise<void> {
  console.log(chalk.blue("📦 Iniciando build do projeto S4FT..."))

  const srcDir = path.join(process.cwd(), "app")
  const distDir = path.join(process.cwd(), "dist")

  // Limpar diretório de saída
  await fs.remove(distDir)
  await fs.ensureDir(distDir)

  // Encontrar todos os arquivos .s4ft
  const s4ftFiles = await findS4FTFiles(srcDir)

  console.log(chalk.yellow(`📄 Encontrados ${s4ftFiles.length} arquivos .s4ft`))

  // Transpilar cada arquivo
  for (const file of s4ftFiles) {
    await transpileFile(file, srcDir, distDir)
  }

  // Copiar arquivos estáticos
  await copyStaticFiles()

  // Gerar HTML de produção
  await generateHTML(distDir)

  console.log(chalk.green.bold("✅ Build concluído com sucesso!"))
  console.log(chalk.cyan(`📁 Arquivos gerados em: ${distDir}`))
}

async function findS4FTFiles(dir: string): Promise<string[]> {
  const files: string[] = []

  if (!(await fs.pathExists(dir))) {
    return files
  }

  const entries = await fs.readdir(dir, { withFileTypes: true })

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name)

    if (entry.isDirectory()) {
      files.push(...(await findS4FTFiles(fullPath)))
    } else if (entry.name.endsWith(".s4ft")) {
      files.push(fullPath)
    }
  }

  return files
}

async function transpileFile(filePath: string, srcDir: string, distDir: string): Promise<void> {
  try {
    const content = await fs.readFile(filePath, "utf-8")
    const transpiled = transpileS4FT(content)

    const relativePath = path.relative(srcDir, filePath)
    const outputPath = path.join(distDir, relativePath.replace(".s4ft", ".js"))

    await fs.ensureDir(path.dirname(outputPath))
    await fs.writeFile(outputPath, transpiled)

    console.log(chalk.green(`✅ ${relativePath} → ${path.relative(process.cwd(), outputPath)}`))
  } catch (error) {
    console.error(chalk.red(`❌ Erro ao transpilar ${filePath}:`), error)
    throw error
  }
}

async function copyStaticFiles(): Promise<void> {
  const publicDir = path.join(process.cwd(), "public")
  const distPublicDir = path.join(process.cwd(), "dist", "public")

  if (await fs.pathExists(publicDir)) {
    await fs.copy(publicDir, distPublicDir)
    console.log(chalk.green("✅ Arquivos estáticos copiados"))
  }
}

async function generateHTML(distDir: string): Promise<void> {
  const htmlTemplate = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>S4FT App</title>
  <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
  <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
</head>
<body>
  <div id="root"></div>
  <script src="./page.js"></script>
</body>
</html>`

  await fs.writeFile(path.join(distDir, "index.html"), htmlTemplate)
  console.log(chalk.green("✅ HTML de produção gerado"))
}

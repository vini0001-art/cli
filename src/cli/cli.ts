#!/usr/bin/env node

import { Command } from "commander"
import chalk from "chalk"
import { createProject } from "./interactive-cli.js"
import { deployProject } from "./deploy.js"
import { askAI } from "./ai-assistant.js"
import { startDevServer } from "../dev-server/dev-server.js"
import { buildProject } from "../build/builder.js"

const program = new Command()

program.name("s4ft").description("S4FT Framework - Simple And Fast Templates").version("1.0.1")

program
  .command("create")
  .description("Criar novo projeto S4FT")
  .argument("[name]", "Nome do projeto")
  .option("-t, --template <template>", "Template a usar", "basic")
  .option("-l, --language <language>", "Linguagem (ts/js)", "ts")
  .action(async (name, options) => {
    try {
      await createProject(name, options)
    } catch (error) {
      console.error(chalk.red("Erro ao criar projeto:"), error)
      process.exit(1)
    }
  })

program
  .command("dev")
  .description("Iniciar servidor de desenvolvimento")
  .option("-p, --port <port>", "Porta do servidor", "3000")
  .action(async (options) => {
    try {
      const port = Number.parseInt(options.port)
      await startDevServer(port)
    } catch (error) {
      console.error(chalk.red("Erro ao iniciar servidor:"), error)
      process.exit(1)
    }
  })

program
  .command("build")
  .description("Fazer build do projeto")
  .action(async () => {
    try {
      await buildProject()
    } catch (error) {
      console.error(chalk.red("Erro no build:"), error)
      process.exit(1)
    }
  })

program
  .command("deploy")
  .description("Fazer deploy do projeto")
  .option("-p, --platform <platform>", "Plataforma (vercel/netlify/s4ft)", "vercel")
  .action(async (options) => {
    try {
      await deployProject(options.platform)
    } catch (error) {
      console.error(chalk.red("Erro no deploy:"), error)
      process.exit(1)
    }
  })

program
  .command("ask")
  .description("Perguntar para IA Assistant")
  .argument("<question>", "Pergunta para a IA")
  .action(async (question) => {
    try {
      await askAI(question)
    } catch (error) {
      console.error(chalk.red("Erro na IA:"), error)
      process.exit(1)
    }
  })

program
  .command("generate")
  .alias("g")
  .description("Gerar componente, página ou API")
  .argument("<type>", "Tipo (component/page/api)")
  .argument("<name>", "Nome do arquivo")
  .action(async (type, name) => {
    try {
      console.log(chalk.green(`Gerando ${type}: ${name}`))
      // Implementar geração de arquivos
    } catch (error) {
      console.error(chalk.red("Erro ao gerar:"), error)
      process.exit(1)
    }
  })

program.parse()

#!/usr/bin/env node
import { Command } from "commander";
import chalk from "chalk";
import figlet from "figlet";
import { startDevServer } from "../dev-server/dev-server.js";
import { buildProject } from "../build/builder.js";
import { createProject } from "../cli/project-generator.js";
import { startInteractiveCLI } from "../cli/interactive-cli.js";
import { generateComponent, generatePage, generateAPI } from "../cli/generators.js";
const program = new Command();
// Banner do S4FT
console.log(chalk.cyan(figlet.textSync("S4FT", {
    font: "Big",
    horizontalLayout: "default",
    verticalLayout: "default",
})));
console.log(chalk.yellow("🇧🇷 Simple And Fast Templates - Framework Brasileiro\n"));
program.name("s4ft").description("🚀 Framework web brasileiro para desenvolvimento rápido").version("1.0.0");
// Comando para criar novo projeto
program
    .command("create <project-name>")
    .description("🆕 Criar novo projeto S4FT")
    .option("-t, --template <template>", "Template a usar (basic, blog, ecommerce, dashboard)", "basic")
    .action(async (projectName, options) => {
    console.log(chalk.blue(`📦 Criando projeto: ${projectName}`));
    console.log(chalk.gray(`📋 Template: ${options.template}`));
    try {
        await createProject(projectName, options.template);
        console.log(chalk.green.bold(`✅ Projeto ${projectName} criado com sucesso!`));
        console.log(chalk.cyan(`
📁 Próximos passos:
   cd ${projectName}
   npm install
   s4ft dev
      `));
    }
    catch (error) {
        console.error(chalk.red("❌ Erro ao criar projeto:"), error);
    }
});
// Comando para iniciar servidor de desenvolvimento
program
    .command("dev")
    .description("🔥 Iniciar servidor de desenvolvimento")
    .option("-p, --port <port>", "Porta do servidor", "3000")
    .action(async (options) => {
    const port = Number.parseInt(options.port);
    console.log(chalk.blue(`🚀 Iniciando servidor S4FT na porta ${port}...`));
    try {
        await startDevServer(port);
    }
    catch (error) {
        console.error(chalk.red("❌ Erro ao iniciar servidor:"), error);
    }
});
// Comando para build de produção
program
    .command("build")
    .description("📦 Fazer build para produção")
    .action(async () => {
    console.log(chalk.blue("📦 Iniciando build de produção..."));
    try {
        await buildProject();
        console.log(chalk.green.bold("✅ Build concluído!"));
    }
    catch (error) {
        console.error(chalk.red("❌ Erro no build:"), error);
    }
});
// Comando interativo
program
    .command("interactive")
    .alias("i")
    .description("🤖 Modo interativo com IA")
    .action(async () => {
    console.log(chalk.magenta("🤖 Iniciando modo interativo S4FT..."));
    await startInteractiveCLI();
});
// Comando para gerar componentes
program
    .command("generate <type> <name>")
    .alias("g")
    .description("⚡ Gerar componente, página ou API")
    .action(async (type, name) => {
    console.log(chalk.blue(`⚡ Gerando ${type}: ${name}`));
    try {
        switch (type) {
            case "component":
            case "c":
                await generateComponent(name);
                break;
            case "page":
            case "p":
                await generatePage(name);
                break;
            case "api":
            case "a":
                await generateAPI(name);
                break;
            default:
                console.error(chalk.red(`❌ Tipo desconhecido: ${type}`));
                console.log(chalk.yellow("💡 Tipos disponíveis: component, page, api"));
        }
    }
    catch (error) {
        console.error(chalk.red("❌ Erro ao gerar:"), error);
    }
});
// Comando de informações
program
    .command("info")
    .description("ℹ️ Informações sobre o S4FT")
    .action(() => {
    console.log(chalk.cyan(`
🚀 S4FT Framework v1.0.0
🇧🇷 Simple And Fast Templates

📊 Status do Sistema:
   • Parser: ✅ Implementado
   • Transpiler: ✅ Implementado  
   • Dev Server: ✅ Implementado
   • Hot Reload: ✅ Implementado
   • Build System: ✅ Implementado
   • CLI Interativo: ✅ Implementado

🌟 Recursos Principais:
   • Sintaxe declarativa .s4ft
   • Hot reload automático
   • Build otimizado para produção
   • TypeScript nativo
   • Tailwind CSS integrado
   • Templates prontos
   • CLI interativo em português
   • Geração automática de código

📋 Templates Disponíveis:
   • basic - Página simples
   • blog - Site de blog
   • ecommerce - Loja online
   • dashboard - Painel administrativo

🔧 Comandos Principais:
   s4ft create <nome>     - Criar projeto
   s4ft dev              - Servidor desenvolvimento
   s4ft build            - Build produção
   s4ft generate <tipo>  - Gerar código
   s4ft interactive      - Modo interativo

📚 Links Úteis:
   • Documentação: https://s4ft.dev
   • GitHub: https://github.com/s4ft/s4ft
   • Discord: https://discord.gg/s4ft
   • NPM: https://npmjs.com/package/s4ft
      `));
});
// Se nenhum comando for fornecido, mostrar ajuda
if (process.argv.length <= 2) {
    program.help();
}
program.parse();

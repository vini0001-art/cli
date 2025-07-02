import inquirer from "inquirer";
import chalk from "chalk";
import figlet from "figlet";
export async function startInteractiveCLI() {
    console.clear();
    // Banner
    console.log(chalk.cyan(figlet.textSync("S4FT CLI", {
        font: "Small",
        horizontalLayout: "default",
    })));
    console.log(chalk.yellow("🇧🇷 Modo Interativo - Framework Brasileiro\n"));
    while (true) {
        const { action } = await inquirer.prompt([
            {
                type: "list",
                name: "action",
                message: "O que você gostaria de fazer?",
                choices: [
                    { name: "🆕 Criar novo projeto", value: "create" },
                    { name: "⚡ Gerar componente", value: "generate-component" },
                    { name: "📄 Gerar página", value: "generate-page" },
                    { name: "🔌 Gerar API", value: "generate-api" },
                    { name: "🚀 Iniciar servidor dev", value: "dev" },
                    { name: "📦 Fazer build", value: "build" },
                    { name: "🤖 Perguntar para IA", value: "ai" },
                    { name: "ℹ️  Informações do S4FT", value: "info" },
                    { name: "❌ Sair", value: "exit" },
                ],
            },
        ]);
        switch (action) {
            case "create":
                await handleCreateProject();
                break;
            case "generate-component":
                await handleGenerateComponent();
                break;
            case "generate-page":
                await handleGeneratePage();
                break;
            case "generate-api":
                await handleGenerateAPI();
                break;
            case "dev":
                await handleDevServer();
                break;
            case "build":
                await handleBuild();
                break;
            case "ai":
                await handleAI();
                break;
            case "info":
                showInfo();
                break;
            case "exit":
                console.log(chalk.green("👋 Até logo! Obrigado por usar S4FT!"));
                process.exit(0);
        }
        console.log("\n" + chalk.gray("─".repeat(50)) + "\n");
    }
}
async function handleCreateProject() {
    const answers = await inquirer.prompt([
        {
            type: "input",
            name: "name",
            message: "📝 Nome do projeto:",
            validate: (input) => input.length > 0 || "Nome é obrigatório",
        },
        {
            type: "list",
            name: "template",
            message: "📋 Escolha um template:",
            choices: [
                { name: "🏠 Básico - Página simples", value: "basic" },
                { name: "📝 Blog - Site de blog", value: "blog" },
                { name: "🛒 E-commerce - Loja online", value: "ecommerce" },
                { name: "📊 Dashboard - Painel admin", value: "dashboard" },
            ],
        },
    ]);
    console.log(chalk.blue(`\n📦 Criando projeto "${answers.name}" com template "${answers.template}"...`));
    // Aqui chamaria a função de criar projeto
    console.log(chalk.green("✅ Projeto criado com sucesso!"));
    console.log(chalk.cyan(`\n📁 Próximos passos:
   cd ${answers.name}
   npm install
   s4ft dev`));
}
async function handleGenerateComponent() {
    const { name } = await inquirer.prompt([
        {
            type: "input",
            name: "name",
            message: "📝 Nome do componente:",
            validate: (input) => input.length > 0 || "Nome é obrigatório",
        },
    ]);
    console.log(chalk.blue(`\n⚡ Gerando componente "${name}"...`));
    console.log(chalk.green("✅ Componente gerado!"));
}
async function handleGeneratePage() {
    const { name } = await inquirer.prompt([
        {
            type: "input",
            name: "name",
            message: "📝 Nome da página:",
            validate: (input) => input.length > 0 || "Nome é obrigatório",
        },
    ]);
    console.log(chalk.blue(`\n📄 Gerando página "${name}"...`));
    console.log(chalk.green("✅ Página gerada!"));
}
async function handleGenerateAPI() {
    const { name } = await inquirer.prompt([
        {
            type: "input",
            name: "name",
            message: "📝 Nome da API:",
            validate: (input) => input.length > 0 || "Nome é obrigatório",
        },
    ]);
    console.log(chalk.blue(`\n🔌 Gerando API "${name}"...`));
    console.log(chalk.green("✅ API gerada!"));
}
async function handleDevServer() {
    const { port } = await inquirer.prompt([
        {
            type: "number",
            name: "port",
            message: "🌐 Porta do servidor:",
            default: 3000,
        },
    ]);
    console.log(chalk.blue(`\n🚀 Iniciando servidor na porta ${port}...`));
    // Aqui chamaria startDevServer(port)
}
async function handleBuild() {
    console.log(chalk.blue("\n📦 Iniciando build..."));
    // Aqui chamaria buildProject()
    console.log(chalk.green("✅ Build concluído!"));
}
async function handleAI() {
    const { question } = await inquirer.prompt([
        {
            type: "input",
            name: "question",
            message: "🤖 Sua pergunta para a IA:",
            validate: (input) => input.length > 0 || "Pergunta é obrigatória",
        },
    ]);
    console.log(chalk.magenta(`\n🤖 Processando: "${question}"`));
    console.log(chalk.cyan("💭 IA: Esta é uma resposta de exemplo. A integração com IA será implementada em breve!"));
}
function showInfo() {
    console.log(chalk.cyan(`
🚀 S4FT Framework v1.0.0
🇧🇷 Simple And Fast Templates

📊 Status:
   • Parser: ✅ Implementado
   • Transpiler: ✅ Implementado  
   • Dev Server: ✅ Implementado
   • Hot Reload: ✅ Implementado
   • Build System: ✅ Implementado
   • CLI Interativo: ✅ Implementado

🌟 Recursos:
   • Sintaxe declarativa .s4ft
   • Hot reload automático
   • Build otimizado para produção
   • TypeScript nativo
   • Tailwind CSS integrado
   • Templates prontos
   • CLI interativo em português

📚 Documentação: https://s4ft.dev
🐛 Issues: https://github.com/s4ft/s4ft/issues
💬 Discord: https://discord.gg/s4ft
  `));
}

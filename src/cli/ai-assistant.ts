"use client"

import chalk from "chalk"
import inquirer from "inquirer"

export async function askAI(question: string) {
  console.log(chalk.blue("🤖 IA Assistant:"))
  console.log(chalk.yellow(`Pergunta: ${question}`))

  // Simular resposta da IA (em produção, integraria com Grok)
  const responses: Record<string, string> = {
    "como criar um componente": `
Para criar um componente S4FT, use a sintaxe:

${chalk.green(`component MeuComponente {
  state {
    // Estado do componente
    texto: string = "Olá"
  }
  
  event handleClick() {
    // Lógica do evento
    texto = "Clicado!"
  }
  
  <div className="meu-componente">
    <h2>{texto}</h2>
    <button onClick={handleClick}>Clique</button>
  </div>
}`)}

Ou use o comando: ${chalk.cyan("s4ft generate component MeuComponente")}
    `,
    "como fazer deploy": `
Para fazer deploy do seu projeto S4FT:

1. ${chalk.cyan("s4ft build")} - Fazer build do projeto
2. ${chalk.cyan("s4ft deploy")} - Deploy para S4FT Cloud
3. ${chalk.cyan("s4ft deploy --platform vercel")} - Deploy para Vercel
4. ${chalk.cyan("s4ft deploy --platform netlify")} - Deploy para Netlify

O S4FT suporta deploy automático para múltiplas plataformas!
    `,
    "como usar state": `
O sistema de state do S4FT é reativo:

${chalk.green(`component Contador {
  state {
    count: number = 0,
    nome: string = "Usuário"
  }
  
  event incrementar() {
    count = count + 1  // Atualização reativa
  }
  
  <div>
    <p>Olá {nome}, contador: {count}</p>
    <button onClick={incrementar}>+1</button>
  </div>
}`)}

O state é automaticamente reativo - quando muda, a UI atualiza!
    `,
    "como criar um formulário": `
Para criar um formulário em S4FT, use o componente form com state para gerenciar os dados:

${chalk.green(`component MeuFormulario {
  state {
    nome: string = "",
    email: string = ""
  }
  
  event onChangeNome(value: string) {
    nome = value
  }
  
  event onChangeEmail(value: string) {
    email = value
  }
  
  event onSubmit() {
    console.log("Nome:", nome)
    console.log("Email:", email)
  }
  
  <form onSubmit={onSubmit}>
    <input type="text" value={nome} onChange={onChangeNome} placeholder="Nome" />
    <input type="email" value={email} onChange={onChangeEmail} placeholder="Email" />
    <button type="submit">Enviar</button>
  </form>
}`)}

Você pode usar eventos como onChange e onSubmit para capturar interações do usuário.
O S4FT suporta validação automática de formulários com a sintaxe validate.
Para estilização, recomendo usar Tailwind CSS que já vem integrado.
Componentes podem ser reutilizados importando de outros arquivos .s4ft.
    `,
  }

  const lowerQuestion = question.toLowerCase()
  let response = responses[lowerQuestion]

  if (!response) {
    // Buscar resposta mais próxima
    const keys = Object.keys(responses)
    const match = keys.find((key) => lowerQuestion.includes(key) || key.includes(lowerQuestion))
    response = match ? responses[match] : null
  }

  if (response) {
    console.log(chalk.white(response))
  } else {
    console.log(
      chalk.yellow(`
🤔 Não encontrei uma resposta específica para "${question}".

Aqui estão algumas perguntas comuns:
• "como criar um componente"
• "como fazer deploy" 
• "como usar state"
• "como criar um formulário"

Ou consulte a documentação: ${chalk.cyan("https://s4ft.fun/docs")}
    `),
    )
  }

  // Perguntar se quer fazer outra pergunta
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
        message: "❓ Sua pergunta:",
      },
    ])

    if (novaPergunta.trim()) {
      await askAI(novaPergunta)
    }
  }
}

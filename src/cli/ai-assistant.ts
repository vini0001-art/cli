"use client"

import chalk from "chalk"

export async function aiAssistant(question: string): Promise<string> {
  try {
    // Verificar se tem a chave da API do Grok
    const apiKey = process.env.XAI_API_KEY

    if (!apiKey) {
      return chalk.yellow(`
🤖 Para usar o AI Assistant, configure sua chave da API:

1. Obtenha sua chave em: https://console.x.ai
2. Configure a variável de ambiente:
   export XAI_API_KEY="sua-chave-aqui"

3. Ou adicione no seu .env:
   XAI_API_KEY=sua-chave-aqui

Por enquanto, aqui estão algumas sugestões para: "${question}"

📝 Comandos úteis do S4FT:
• s4ft generate component MeuComponente
• s4ft generate page MinhaPage  
• s4ft generate api MinhaAPI
• s4ft build
• s4ft deploy

📚 Documentação: https://s4ft.fun/docs
💬 Discord: https://discord.gg/s4ft
      `)
    }

    // Fazer chamada para a API do Grok
    const response = await fetch("https://api.x.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [
          {
            role: "system",
            content: `Você é um assistente especializado no framework S4FT (Simple And Fast Templates), um framework web brasileiro similar ao Next.js mas com sintaxe declarativa própria. 

Sintaxe S4FT:
- Componentes: component NomeComponente { props { }, state { }, event nomeEvento() { }, <jsx/> }
- Páginas: page NomePage { state { }, event nomeEvento() { }, <jsx/> }
- Layouts: layout NomeLayout { props { children: ReactNode }, <jsx/> }
- APIs: export function GET/POST/PUT/DELETE(request) { return { status, body } }

Responda sempre em português brasileiro, seja prático e forneça exemplos de código quando relevante.`,
          },
          {
            role: "user",
            content: question,
          },
        ],
        model: "grok-beta",
        stream: false,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`)
    }

    const data = await response.json()
    return data.choices[0]?.message?.content || "Desculpe, não consegui processar sua pergunta."
  } catch (error) {
    console.error("Erro na API do Grok:", error)

    // Fallback com respostas pré-definidas
    return getLocalResponse(question)
  }
}

function getLocalResponse(question: string): string {
  const lowerQuestion = question.toLowerCase()

  if (lowerQuestion.includes("component")) {
    return `
🎨 **Criando Componentes no S4FT:**

\`\`\`s4ft
component MeuComponente {
  props {
    titulo: string = "Título padrão",
    ativo: boolean = false
  }
  
  state {
    contador: number = 0
  }
  
  event incrementar() {
    contador = contador + 1
  }
  
  <div className="meu-componente">
    <h2>{titulo}</h2>
    <p>Contador: {contador}</p>
    <button onClick={incrementar} disabled={!ativo}>
      Incrementar
    </button>
  </div>
}
\`\`\`

📝 **Comando para gerar:**
\`s4ft generate component MeuComponente\`
    `
  }

  if (lowerQuestion.includes("page") || lowerQuestion.includes("página")) {
    return `
📄 **Criando Páginas no S4FT:**

\`\`\`s4ft
page MinhaPage {
  state {
    dados: array = [],
    carregando: boolean = true
  }
  
  event carregarDados() {
    // Lógica para carregar dados
    carregando = false
  }
  
  <div className="minha-page">
    <h1>Minha Página</h1>
    {carregando ? (
      <p>Carregando...</p>
    ) : (
      <div>
        {dados.map(item => (
          <div key={item.id}>{item.nome}</div>
        ))}
      </div>
    )}
  </div>
}
\`\`\`

📝 **Comando para gerar:**
\`s4ft generate page MinhaPage\`
    `
  }

  if (lowerQuestion.includes("api")) {
    return `
🔌 **Criando APIs no S4FT:**

\`\`\`s4ft
// app/api/usuarios.s4ft
export function GET(request) {
  return {
    status: 200,
    body: {
      usuarios: [
        { id: 1, nome: "João" },
        { id: 2, nome: "Maria" }
      ]
    }
  }
}

export function POST(request) {
  const { nome, email } = request.body
  
  // Validação
  if (!nome || !email) {
    return {
      status: 400,
      body: { erro: "Nome e email são obrigatórios" }
    }
  }
  
  // Salvar usuário
  const novoUsuario = { id: Date.now(), nome, email }
  
  return {
    status: 201,
    body: { usuario: novoUsuario }
  }
}
\`\`\`

📝 **Comando para gerar:**
\`s4ft generate api usuarios\`
    `
  }

  if (lowerQuestion.includes("deploy")) {
    return `
🚀 **Deploy no S4FT:**

**1. Build do projeto:**
\`\`\`bash
s4ft build
\`\`\`

**2. Deploy para S4FT Cloud:**
\`\`\`bash
s4ft deploy --platform s4ft-cloud
\`\`\`

**3. Deploy para Vercel:**
\`\`\`bash
s4ft deploy --platform vercel
\`\`\`

**4. Deploy para Netlify:**
\`\`\`bash
s4ft deploy --platform netlify
\`\`\`

🌟 **S4FT Cloud oferece:**
• Deploy gratuito
• SSL automático
• CDN global
• Domínio .s4ft.fun
    `
  }

  return `
🤖 **Assistente S4FT**

Não tenho uma resposta específica para "${question}", mas posso ajudar com:

📝 **Comandos disponíveis:**
• \`s4ft create\` - Criar novo projeto
• \`s4ft dev\` - Servidor de desenvolvimento  
• \`s4ft build\` - Build para produção
• \`s4ft generate <tipo> <nome>\` - Gerar arquivos
• \`s4ft deploy\` - Deploy para produção

🎯 **Tipos de geração:**
• component - Componentes reutilizáveis
• page - Páginas da aplicação
• api - Rotas de API
• layout - Layouts da aplicação

📚 **Recursos:**
• Documentação: https://s4ft.fun/docs
• Discord: https://discord.gg/s4ft
• GitHub: https://github.com/s4ft-framework

💡 **Dica:** Configure XAI_API_KEY para respostas mais inteligentes!
  `
}

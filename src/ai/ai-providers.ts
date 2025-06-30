import { generateText } from "ai"
import { groq } from "@ai-sdk/groq"
import { xai } from "@ai-sdk/xai"
import { fal } from "@fal-ai/serverless"

export interface AIProvider {
  name: string
  generateCode: (prompt: string, type: "component" | "page" | "api" | "function") => Promise<string>
  generateImage: (prompt: string) => Promise<string>
  chat: (message: string, context?: string) => Promise<string>
}

// Groq Provider - Fast inference
export class GroqProvider implements AIProvider {
  name = "Groq"

  async generateCode(prompt: string, type: "component" | "page" | "api" | "function"): Promise<string> {
    const systemPrompt = this.getSystemPrompt(type)

    const { text } = await generateText({
      model: groq("llama-3.1-70b-versatile"),
      system: systemPrompt,
      prompt: `Gere um ${type} S4FT para: ${prompt}`,
      temperature: 0.3,
    })

    return text
  }

  async generateImage(prompt: string): Promise<string> {
    // Groq não suporta geração de imagens, usar Fal como fallback
    return "Groq não suporta geração de imagens. Use Fal para gerar imagens."
  }

  async chat(message: string, context?: string): Promise<string> {
    const { text } = await generateText({
      model: groq("llama-3.1-70b-versatile"),
      system: `Você é um assistente especialista em S4FT Framework, um framework web brasileiro.
      Ajude com desenvolvimento, debugging e melhores práticas.
      ${context ? `Contexto: ${context}` : ""}`,
      prompt: message,
      temperature: 0.7,
    })

    return text
  }

  private getSystemPrompt(type: string): string {
    const basePrompt = `Você é um especialista em S4FT Framework. Gere código limpo, otimizado e seguindo as melhores práticas.`

    switch (type) {
      case "component":
        return `${basePrompt}
        
Sintaxe S4FT para componentes:
component NomeComponente(props: { prop1: type, prop2: type }) {
  state {
    variavel: type = valor
  }
  
  event nomeEvento() {
    // lógica
  }
  
  <div className="classes-tailwind">
    {/* JSX aqui */}
  </div>
}`

      case "page":
        return `${basePrompt}
        
Sintaxe S4FT para páginas:
page NomePagina {
  state {
    dados: type = valor
  }
  
  async load() {
    // carregar dados
  }
  
  <div className="min-h-screen">
    {/* conteúdo da página */}
  </div>
}`

      case "api":
        return `${basePrompt}
        
Gere uma API Route Next.js com métodos GET, POST, PUT, DELETE.
Use TypeScript e tratamento de erros adequado.`

      case "function":
        return `${basePrompt}
        
Gere uma função TypeScript utilitária, bem documentada e testável.`

      default:
        return basePrompt
    }
  }
}

// Grok Provider - xAI
export class GrokProvider implements AIProvider {
  name = "Grok"

  async generateCode(prompt: string, type: "component" | "page" | "api" | "function"): Promise<string> {
    const systemPrompt = this.getSystemPrompt(type)

    const { text } = await generateText({
      model: xai("grok-beta"),
      system: systemPrompt,
      prompt: `Crie um ${type} S4FT para: ${prompt}`,
      temperature: 0.2,
    })

    return text
  }

  async generateImage(prompt: string): Promise<string> {
    return "Grok não suporta geração de imagens. Use Fal para gerar imagens."
  }

  async chat(message: string, context?: string): Promise<string> {
    const { text } = await generateText({
      model: xai("grok-beta"),
      system: `Você é Grok, um assistente de IA especializado em S4FT Framework.
      Seja útil, direto e um pouco divertido nas respostas.
      ${context ? `Contexto atual: ${context}` : ""}`,
      prompt: message,
      temperature: 0.8,
    })

    return text
  }

  private getSystemPrompt(type: string): string {
    return `Você é Grok, especialista em S4FT Framework brasileiro. 
    Gere código ${type} seguindo a sintaxe S4FT e melhores práticas.
    Seja criativo mas mantenha o código funcional e limpo.`
  }
}

// Fal Provider - Image generation
export class FalProvider implements AIProvider {
  name = "Fal"

  async generateCode(prompt: string, type: "component" | "page" | "api" | "function"): Promise<string> {
    // Fal é focado em imagens, usar como fallback para código
    return `// Fal é otimizado para geração de imagens
// Para geração de código, recomendo usar Groq ou Grok
// Código básico para: ${prompt}

export default function Generated${type.charAt(0).toUpperCase() + type.slice(1)}() {
  return (
    <div className="p-4">
      <h1>Componente gerado: ${prompt}</h1>
      <p>Use Groq ou Grok para geração de código mais avançada</p>
    </div>
  )
}`
  }

  async generateImage(prompt: string): Promise<string> {
    try {
      const result = await fal.subscribe("fal-ai/flux/schnell", {
        input: {
          prompt: prompt,
          image_size: "landscape_4_3",
          num_inference_steps: 4,
          num_images: 1,
        },
      })

      return result.images[0].url
    } catch (error) {
      console.error("Erro ao gerar imagem com Fal:", error)
      return "Erro na geração de imagem"
    }
  }

  async chat(message: string, context?: string): Promise<string> {
    return `Fal é especializado em geração de imagens. 
    Para chat sobre código, use Groq ou Grok.
    
    Posso ajudar com:
    - Gerar imagens para seu projeto
    - Criar assets visuais
    - Logos e ícones
    - Ilustrações e banners
    
    Sua mensagem: ${message}`
  }
}

// AI Manager - Gerencia todos os providers
export class AIManager {
  private providers: Map<string, AIProvider> = new Map()
  private currentProvider = "groq"

  constructor() {
    this.providers.set("groq", new GroqProvider())
    this.providers.set("grok", new GrokProvider())
    this.providers.set("fal", new FalProvider())
  }

  setProvider(name: string): boolean {
    if (this.providers.has(name)) {
      this.currentProvider = name
      return true
    }
    return false
  }

  getCurrentProvider(): AIProvider {
    return this.providers.get(this.currentProvider)!
  }

  getAvailableProviders(): string[] {
    return Array.from(this.providers.keys())
  }

  async generateCode(prompt: string, type: "component" | "page" | "api" | "function"): Promise<string> {
    return await this.getCurrentProvider().generateCode(prompt, type)
  }

  async generateImage(prompt: string): Promise<string> {
    // Usar Fal para geração de imagens
    const falProvider = this.providers.get("fal")!
    return await falProvider.generateImage(prompt)
  }

  async chat(message: string, context?: string): Promise<string> {
    return await this.getCurrentProvider().chat(message, context)
  }
}

export const aiManager = new AIManager()

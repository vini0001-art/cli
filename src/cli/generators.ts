"use client"

import fs from "fs-extra"
import path from "path"
import chalk from "chalk"

// Generator types
export interface GeneratorOptions {
  name: string
  type: "component" | "page" | "api" | "layout" | "middleware"
  template?: string
  props?: string[]
  state?: string[]
  events?: string[]
  directory?: string
}

// Generate component
export async function generateComponent(name: string, options: Partial<GeneratorOptions> = {}): Promise<void> {
  const componentName = toPascalCase(name)
  const fileName = toKebabCase(name)
  const directory = options.directory || "components"

  console.log(chalk.blue(`⚡ Gerando componente: ${componentName}`))

  const componentCode = generateComponentCode(componentName, options)
  const filePath = path.join(process.cwd(), directory, `${fileName}.s4ft`)

  await fs.ensureDir(path.dirname(filePath))
  await fs.writeFile(filePath, componentCode)

  console.log(chalk.green(`✅ Componente criado: ${filePath}`))
}

// Generate page
export async function generatePage(name: string, options: Partial<GeneratorOptions> = {}): Promise<void> {
  const pageName = toPascalCase(name)
  const fileName = toKebabCase(name)
  const directory = options.directory || "app"

  console.log(chalk.blue(`⚡ Gerando página: ${pageName}`))

  const pageCode = generatePageCode(pageName, options)
  const filePath = path.join(process.cwd(), directory, fileName, "page.s4ft")

  await fs.ensureDir(path.dirname(filePath))
  await fs.writeFile(filePath, pageCode)

  console.log(chalk.green(`✅ Página criada: ${filePath}`))
}

// Generate API route
export async function generateAPI(name: string, options: Partial<GeneratorOptions> = {}): Promise<void> {
  const apiName = toCamelCase(name)
  const fileName = toKebabCase(name)
  const directory = options.directory || "app/api"

  console.log(chalk.blue(`⚡ Gerando API: ${apiName}`))

  const apiCode = generateAPICode(apiName, options)
  const filePath = path.join(process.cwd(), directory, fileName, "route.ts")

  await fs.ensureDir(path.dirname(filePath))
  await fs.writeFile(filePath, apiCode)

  console.log(chalk.green(`✅ API criada: ${filePath}`))
}

// Generate layout
export async function generateLayout(name: string, options: Partial<GeneratorOptions> = {}): Promise<void> {
  const layoutName = toPascalCase(name)
  const fileName = toKebabCase(name)
  const directory = options.directory || "app"

  console.log(chalk.blue(`⚡ Gerando layout: ${layoutName}`))

  const layoutCode = generateLayoutCode(layoutName, options)
  const filePath = path.join(process.cwd(), directory, fileName, "layout.s4ft")

  await fs.ensureDir(path.dirname(filePath))
  await fs.writeFile(filePath, layoutCode)

  console.log(chalk.green(`✅ Layout criado: ${filePath}`))
}

// Generate middleware
export async function generateMiddleware(name: string, options: Partial<GeneratorOptions> = {}): Promise<void> {
  const middlewareName = toCamelCase(name)
  const fileName = toKebabCase(name)
  const directory = options.directory || "middleware"

  console.log(chalk.blue(`⚡ Gerando middleware: ${middlewareName}`))

  const middlewareCode = generateMiddlewareCode(middlewareName, options)
  const filePath = path.join(process.cwd(), directory, `${fileName}.ts`)

  await fs.ensureDir(path.dirname(filePath))
  await fs.writeFile(filePath, middlewareCode)

  console.log(chalk.green(`✅ Middleware criado: ${filePath}`))
}

// Code generators
function generateComponentCode(name: string, options: Partial<GeneratorOptions>): string {
  const props = options.props || []
  const state = options.state || []
  const events = options.events || []

  let propsSection = ""
  if (props.length > 0) {
    const propsString = props
      .map((prop) => {
        const [propName, propType = "string"] = prop.split(":")
        return `  ${propName.trim()}: ${propType.trim()}`
      })
      .join(",\n")

    propsSection = `(props: {\n${propsString}\n})`
  }

  let stateSection = ""
  if (state.length > 0) {
    const stateString = state
      .map((stateItem) => {
        const [stateName, stateType = "string", defaultValue = '""'] = stateItem.split(":")
        return `    ${stateName.trim()}: ${stateType.trim()} = ${defaultValue.trim()}`
      })
      .join(",\n")

    stateSection = `  state {\n${stateString}\n  }\n\n`
  }

  let eventsSection = ""
  if (events.length > 0) {
    eventsSection = events
      .map((event) => {
        return `  event ${event}() {\n    // Implementar lógica do evento\n  }\n`
      })
      .join("\n")
  }

  return `component ${name}${propsSection} {
${stateSection}${eventsSection}
  <div className="p-4">
    <h2 className="text-xl font-bold">${name}</h2>
    <p className="text-gray-600">Componente ${name} criado com S4FT</p>
  </div>
}`
}

function generatePageCode(name: string, options: Partial<GeneratorOptions>): string {
  const state = options.state || []
  const events = options.events || []

  let stateSection = ""
  if (state.length > 0) {
    const stateString = state
      .map((stateItem) => {
        const [stateName, stateType = "string", defaultValue = '""'] = stateItem.split(":")
        return `    ${stateName.trim()}: ${stateType.trim()} = ${defaultValue.trim()}`
      })
      .join(",\n")

    stateSection = `  state {\n${stateString}\n  }\n\n`
  }

  let eventsSection = ""
  if (events.length > 0) {
    eventsSection = events
      .map((event) => {
        return `  event ${event}() {\n    // Implementar lógica do evento\n  }\n`
      })
      .join("\n")
  }

  return `page ${name} {
${stateSection}${eventsSection}
  <div className="min-h-screen bg-gray-50">
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold text-gray-900">${name}</h1>
      </div>
    </header>
    
    <main className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Bem-vindo à página ${name}</h2>
        <p className="text-gray-600">
          Esta página foi criada automaticamente pelo gerador S4FT.
          Edite este arquivo para personalizar o conteúdo.
        </p>
      </div>
    </main>
  </div>
}`
}

function generateAPICode(name: string, options: Partial<GeneratorOptions>): string {
  return `import { NextRequest, NextResponse } from 'next/server'

// GET /api/${toKebabCase(name)}
export async function GET(request: NextRequest) {
  try {
    // Implementar lógica GET
    const data = {
      message: 'API ${name} funcionando!',
      timestamp: new Date().toISOString(),
      method: 'GET'
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Erro na API ${name}:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// POST /api/${toKebabCase(name)}
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Implementar lógica POST
    const data = {
      message: 'Dados recebidos com sucesso',
      received: body,
      timestamp: new Date().toISOString(),
      method: 'POST'
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Erro na API ${name}:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// PUT /api/${toKebabCase(name)}
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Implementar lógica PUT
    const data = {
      message: 'Dados atualizados com sucesso',
      updated: body,
      timestamp: new Date().toISOString(),
      method: 'PUT'
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Erro na API ${name}:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// DELETE /api/${toKebabCase(name)}
export async function DELETE(request: NextRequest) {
  try {
    // Implementar lógica DELETE
    const data = {
      message: 'Recurso deletado com sucesso',
      timestamp: new Date().toISOString(),
      method: 'DELETE'
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Erro na API ${name}:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
}

function generateLayoutCode(layoutName: string, options: Partial<GeneratorOptions>): string {
  return \`component ${layoutName}Layout(props: { children: any }) {
  <div className="min-h-screen bg-gray-50">
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-xl font-bold text-gray-900">${layoutName}</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <a href="/" className="text-gray-600 hover:text-gray-900">Home</a>
            <a href="/about" className="text-gray-600 hover:text-gray-900">Sobre</a>
            <a href="/contact" className="text-gray-600 hover:text-gray-900">Contato</a>
          </div>
        </nav>
      </div>
    </header>
    
    <main className="flex-1">
      {props.children}
    </main>
    
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">
          <p>&copy; 2024 ${layoutName}. Todos os direitos reservados.</p>
          <p className="text-sm text-gray-400 mt-2">
            Criado com S4FT Framework 🇧🇷
          </p>
        </div>
      </div>
    </footer>
  </div>
}`
}

function generateMiddlewareCode(name: string, options: Partial<GeneratorOptions>): string {
  return `import { NextRequest, NextResponse } from 'next/server'

export function ${name}Middleware(request: NextRequest) {
  console.log(\`🔧 Middleware ${name}: \${request.method} \${request.url}\`)
  
  // Implementar lógica do middleware
  
  // Exemplo: Verificar autenticação
  const token = request.headers.get('authorization')
  
  if (!token) {
    return NextResponse.json(
      { error: 'Token de autorização necessário' },
      { status: 401 }
    )
  }
  
  // Continuar para o próximo middleware/handler
  return NextResponse.next()
}

// Configuração do middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}

export default ${name}Middleware`
}

// Utility functions
function toPascalCase(str: string): string {
  return str
    .split(/[-_\s]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join("")
}

function toCamelCase(str: string): string {
  const pascal = toPascalCase(str)
  return pascal.charAt(0).toLowerCase() + pascal.slice(1)
}

function toKebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, "$1-$2")
    .replace(/[\s_]+/g, "-")
    .toLowerCase()
}

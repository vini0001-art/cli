"use client"

import fs from "fs-extra"
import path from "path"
import chalk from "chalk"

export async function generateComponent(name: string) {
  const componentPath = path.join(process.cwd(), "components", `${name}.s4ft`)

  const template = `component ${name}(props: {
  title?: string,
  onClick?: () => void
}) {
  state {
    isActive: boolean = false
  }
  
  event handleClick() {
    setIsActive(!isActive)
    if (props.onClick) {
      props.onClick()
    }
  }
  
  <div 
    className={
      "p-4 rounded-lg border transition-colors " +
      (isActive ? "bg-blue-100 border-blue-300" : "bg-gray-50 border-gray-200")
    }
    onClick={handleClick}
  >
    <h3 className="text-lg font-semibold text-gray-800">
      {props.title || "${name}"}
    </h3>
    <p className="text-gray-600 mt-2">
      Componente ${name} {isActive ? "ativo" : "inativo"}
    </p>
  </div>
}`

  await fs.ensureDir(path.dirname(componentPath))
  await fs.writeFile(componentPath, template)

  console.log(chalk.green(`✅ Componente criado: ${componentPath}`))
}

export async function generatePage(name: string) {
  const pagePath = path.join(process.cwd(), "app", `${name}.s4ft`)

  const template = `page ${name} {
  state {
    title: string = "${name} Page",
    loading: boolean = false,
    data: array = []
  }
  
  event loadData() {
    setLoading(true)
    // Simular carregamento
    setTimeout(() => {
      setData([
        { id: 1, name: "Item 1" },
        { id: 2, name: "Item 2" },
        { id: 3, name: "Item 3" }
      ])
      setLoading(false)
    }, 1000)
  }
  
  <div className="min-h-screen bg-gray-50 py-8">
    <div className="max-w-4xl mx-auto px-4">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{title}</h1>
        <p className="text-gray-600">Página gerada automaticamente pelo S4FT</p>
      </header>
      
      <main className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">Conteúdo</h2>
          <button 
            onClick={loadData}
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-4 py-2 rounded transition-colors"
          >
            {loading ? "Carregando..." : "Carregar Dados"}
          </button>
        </div>
        
        {data.length > 0 && (
          <div className="grid gap-4">
            {data.map(item => (
              <div key={item.id} className="p-4 bg-gray-50 rounded border">
                <h3 className="font-medium text-gray-800">{item.name}</h3>
                <p className="text-sm text-gray-600">ID: {item.id}</p>
              </div>
            ))}
          </div>
        )}
        
        {data.length === 0 && !loading && (
          <div className="text-center py-8 text-gray-500">
            <p>Nenhum dado carregado. Clique em "Carregar Dados" para começar.</p>
          </div>
        )}
      </main>
    </div>
  </div>
}`

  await fs.ensureDir(path.dirname(pagePath))
  await fs.writeFile(pagePath, template)

  console.log(chalk.green(`✅ Página criada: ${pagePath}`))
}

export async function generateAPI(name: string) {
  const apiPath = path.join(process.cwd(), "app", "api", `${name}.ts`)

  const template = `import { s4ftRequest, s4ftResponse } from 's4ft/server'

// GET /api/${name}
export async function GET(request: s4ftRequest) {
  try {
    // Exemplo de dados
    const data = {
      message: 'API ${name} funcionando!',
      timestamp: new Date().toISOString(),
      data: [
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' },
        { id: 3, name: 'Item 3' }
      ]
    }
    
    return s4ftResponse.json(data)
  } catch (error) {
    return s4ftResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// POST /api/${name}
export async function POST(request: s4ftRequest) {
  try {
    const body = await request.json()
    
    // Processar dados recebidos
    const result = {
      message: 'Dados recebidos com sucesso!',
      received: body,
      timestamp: new Date().toISOString()
    }
    
    return s4ftResponse.json(result, { status: 201 })
  } catch (error) {
    return s4ftResponse.json(
      { error: 'Erro ao processar dados' },
      { status: 400 }
    )
  }
}

// PUT /api/${name}
export async function PUT(request: s4ftRequest) {
  try {
    const body = await request.json()
    
    // Atualizar dados
    const result = {
      message: 'Dados atualizados com sucesso!',
      updated: body,
      timestamp: new Date().toISOString()
    }
    
    return s4ftResponse.json(result)
  } catch (error) {
    return s4ftResponse.json(
      { error: 'Erro ao atualizar dados' },
      { status: 400 }
    )
  }
}

// DELETE /api/${name}
export async function DELETE(request: s4ftRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return s4ftResponse.json(
        { error: 'ID é obrigatório' },
        { status: 400 }
      )
    }
    
    // Deletar item
    const result = {
      message: \`Item \${id} deletado com sucesso!\`,
      deletedId: id,
      timestamp: new Date().toISOString()
    }
    
    return s4ftResponse.json(result)
  } catch (error) {
    return s4ftResponse.json(
      { error: 'Erro ao deletar item' },
      { status: 400 }
    )
  }
}`

  await fs.ensureDir(path.dirname(apiPath))
  await fs.writeFile(apiPath, template)

  console.log(chalk.green(`✅ API criada: ${apiPath}`))
}

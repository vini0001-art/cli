"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold text-gray-900 mb-4">S4FT Framework</h1>
          <p className="text-xl text-gray-600 mb-6">
            Simple And Fast Templates - O futuro do desenvolvimento web brasileiro
          </p>
          <Badge variant="secondary" className="mb-8">
            v1.0.1 - Pronto para produção
          </Badge>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">🚀 Performance</CardTitle>
              <CardDescription>Islands Architecture com hidratação seletiva</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">Zero JavaScript por padrão, carrega apenas o necessário</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">🧠 IA Integrada</CardTitle>
              <CardDescription>Assistant powered by Grok</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">Ajuda contextual e geração de código inteligente</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">🌐 Deploy Automático</CardTitle>
              <CardDescription>Múltiplas plataformas suportadas</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">Vercel, Netlify, S4FT Cloud e GitHub Pages</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">📝 Sintaxe Intuitiva</CardTitle>
              <CardDescription>Linguagem declarativa simples</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">Inspirada no Next.js mas mais simples e poderosa</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">🔌 Plugins</CardTitle>
              <CardDescription>Ecossistema extensível</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">PWA, Auth, Analytics e muito mais</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">🇧🇷 Brasileiro</CardTitle>
              <CardDescription>Feito no Brasil para o mundo</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">CLI em português e documentação nacional</p>
            </CardContent>
          </Card>
        </div>

        {/* Code Example */}
        <Card className="mb-12">
          <CardHeader>
            <CardTitle>Exemplo de Código S4FT</CardTitle>
            <CardDescription>Veja como é simples criar componentes</CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto">
              {`component TodoList {
  state {
    todos: array = [],
    newTodo: string = ""
  }
  
  event addTodo() {
    todos.push({ id: Date.now(), text: newTodo })
    newTodo = ""
  }
  
  <div className="todo-list">
    <input 
      value={newTodo} 
      onChange={(e) => newTodo = e.target.value}
      placeholder="Nova tarefa..."
    />
    <button onClick={addTodo}>Adicionar</button>
    
    {todos.map(todo => (
      <div key={todo.id}>{todo.text}</div>
    ))}
  </div>
}`}
            </pre>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Pronto para começar?</h2>
          <p className="text-gray-600 mb-8">Instale o S4FT e crie seu primeiro projeto em segundos</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              npm install -g s4ft-framework
            </Button>
            <Button variant="outline" size="lg">
              Ver Documentação
            </Button>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-gray-200 text-center text-gray-500">
          <p>© 2024 S4FT Framework - Feito com ❤️ no Brasil 🇧🇷</p>
        </footer>
      </div>
    </div>
  )
}

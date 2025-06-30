import { Button } from "../components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Heart, Star, Users } from "lucide-react"

export default function SimplePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">P</span>
            </div>
            <span className="font-semibold text-lg">Projeto</span>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
              Início
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
              Sobre
            </a>
            <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
              Contato
            </a>
          </nav>
          <Button>Começar</Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <Badge variant="secondary" className="mb-4">
            ✨ Novo projeto
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Uma página
            <span className="text-blue-600"> simples</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Esta é uma página simples e moderna, criada com Next.js e componentes elegantes. Perfeita para começar seu
            próximo projeto.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="text-lg px-8">
              Explorar agora
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 bg-transparent">
              Saiba mais
            </Button>
          </div>
        </section>

        {/* Features Grid */}
        <section className="grid md:grid-cols-3 gap-6 mb-16">
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Star className="w-6 h-6 text-blue-600" />
              </div>
              <CardTitle>Qualidade</CardTitle>
              <CardDescription>Código limpo e bem estruturado para facilitar manutenção</CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <CardTitle>Comunidade</CardTitle>
              <CardDescription>Feito com tecnologias populares e bem documentadas</CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Heart className="w-6 h-6 text-red-600" />
              </div>
              <CardTitle>Simplicidade</CardTitle>
              <CardDescription>Interface intuitiva e fácil de usar para todos</CardDescription>
            </CardHeader>
          </Card>
        </section>

        {/* CTA Section */}
        <section className="bg-white rounded-2xl p-8 md:p-12 text-center shadow-sm">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Pronto para começar?</h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            Esta página simples pode ser o ponto de partida para algo incrível.
          </p>
          <Button size="lg" className="text-lg px-8">
            Vamos começar
          </Button>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t bg-white/80 backdrop-blur-sm mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                <span className="text-white font-bold text-xs">P</span>
              </div>
              <span className="text-gray-600">© 2024 Projeto. Todos os direitos reservados.</span>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                Privacidade
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                Termos
              </a>
              <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">
                Suporte
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

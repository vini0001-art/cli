"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Code2, Zap, Globe, Smartphone, Rocket, Brain, Github, Star, Download, Coffee, Heart } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Code2 className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              S4FT
            </span>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#features" className="text-gray-600 hover:text-blue-600 transition-colors">
              Features
            </a>
            <a href="#docs" className="text-gray-600 hover:text-blue-600 transition-colors">
              Docs
            </a>
            <a href="#examples" className="text-gray-600 hover:text-blue-600 transition-colors">
              Examples
            </a>
            <Button variant="outline" size="sm">
              <Github className="w-4 h-4 mr-2" />
              GitHub
            </Button>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <Badge className="mb-4 bg-blue-100 text-blue-800 border-blue-200">🚀 Framework Brasileiro v1.0.1</Badge>
          <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
            S4FT Framework
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            <strong>Simple And Fast Templates</strong> - O framework brasileiro que revoluciona o desenvolvimento web
            com IA integrada e arquitetura de ilhas.
          </p>

          {/* Code Example */}
          <div className="bg-gray-900 rounded-xl p-6 mb-8 max-w-2xl mx-auto text-left overflow-x-auto">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-400 text-sm">app/page.s4ft</span>
              <Badge variant="secondary" className="text-xs">
                S4FT
              </Badge>
            </div>
            <pre className="text-green-400 text-sm">
              {`export default function HomePage() {
  return (
    <div className="hero">
      <h1>Bem-vindo ao S4FT! 🇧🇷</h1>
      <p>Framework brasileiro, simples e rápido</p>
      <Button onClick={() => alert('Olá!')}>
        Clique aqui
      </Button>
    </div>
  )
}`}
            </pre>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Download className="w-5 h-5 mr-2" />
              Começar Agora
            </Button>
            <Button variant="outline" size="lg">
              <Star className="w-5 h-5 mr-2" />
              Ver Documentação
            </Button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 px-4 bg-white/50">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Por que escolher S4FT?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Desenvolvido no Brasil, para desenvolvedores brasileiros que querem velocidade e simplicidade.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-6 h-6 text-blue-600" />
                </div>
                <CardTitle>Ultra Rápido</CardTitle>
                <CardDescription>Build em segundos, hot reload instantâneo e otimizações automáticas.</CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                  <Brain className="w-6 h-6 text-purple-600" />
                </div>
                <CardTitle>IA Integrada</CardTitle>
                <CardDescription>
                  Assistant IA powered by Grok para ajudar no desenvolvimento em tempo real.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <Globe className="w-6 h-6 text-green-600" />
                </div>
                <CardTitle>Islands Architecture</CardTitle>
                <CardDescription>Hidratação seletiva e performance otimizada com arquitetura de ilhas.</CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                  <Smartphone className="w-6 h-6 text-orange-600" />
                </div>
                <CardTitle>Mobile First</CardTitle>
                <CardDescription>
                  PWA nativo, responsivo por padrão e otimizado para dispositivos móveis.
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                  <Rocket className="w-6 h-6 text-red-600" />
                </div>
                <CardTitle>Deploy Automático</CardTitle>
                <CardDescription>Deploy para Vercel, Netlify e S4FT Cloud com um comando apenas.</CardDescription>
              </CardHeader>
            </Card>

            <Card className="hover:shadow-lg transition-shadow border-0 bg-white/80 backdrop-blur-sm">
              <CardHeader>
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                  <Code2 className="w-6 h-6 text-indigo-600" />
                </div>
                <CardTitle>TypeScript Nativo</CardTitle>
                <CardDescription>Suporte completo ao TypeScript com tipos automáticos e IntelliSense.</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">10x</div>
              <div className="text-gray-600">Mais Rápido</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-purple-600 mb-2">100%</div>
              <div className="text-gray-600">Brasileiro</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-green-600 mb-2">0</div>
              <div className="text-gray-600">Configuração</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-orange-600 mb-2">∞</div>
              <div className="text-gray-600">Possibilidades</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600">
        <div className="container mx-auto text-center text-white">
          <h2 className="text-4xl font-bold mb-4">Pronto para começar?</h2>
          <p className="text-xl mb-8 opacity-90">Junte-se à revolução do desenvolvimento web brasileiro.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary">
              <Download className="w-5 h-5 mr-2" />
              npm install -g s4ft
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-blue-600 bg-transparent"
            >
              <Github className="w-5 h-5 mr-2" />
              Ver no GitHub
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-gray-900 text-white">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Code2 className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">S4FT</span>
              </div>
              <p className="text-gray-400">Framework brasileiro para desenvolvimento web moderno.</p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Produto</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Documentação
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Templates
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Plugins
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Comunidade</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    GitHub
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Discord
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Twitter
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Blog
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Suporte</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Ajuda
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Contato
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Status
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Roadmap
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400">
              © 2024 S4FT Framework. Feito com <Heart className="w-4 h-4 inline text-red-500" /> no Brasil.
            </p>
            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <Coffee className="w-4 h-4 text-yellow-500" />
              <span className="text-gray-400 text-sm">Powered by Brazilian coffee</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

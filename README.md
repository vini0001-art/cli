# 🇧🇷 S4FT Framework

**Simple And Fast Templates** - O primeiro framework web brasileiro focado em simplicidade e performance.

[![npm version](https://badge.fury.io/js/s4ft-framework.svg)](https://badge.fury.io/js/s4ft-framework)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Discord](https://img.shields.io/discord/1234567890?color=7289da&label=Discord&logo=discord&logoColor=white)](https://discord.gg/s4ft)

## 🚀 Características

- **🎯 Sintaxe Declarativa** - Escreva menos, faça mais
- **⚡ Performance Extrema** - Bundles mínimos, carregamento instantâneo
- **🔥 Hot Reload** - Desenvolvimento ultrarrápido
- **🌐 SSR/SSG Nativo** - Server-side rendering automático
- **📱 PWA Ready** - Progressive Web Apps por padrão
- **🤖 IA Integrada** - Assistente powered by Grok
- **🇧🇷 Brasileiro** - Documentação e suporte em português

## 📦 Instalação

\`\`\`bash
# Instalar globalmente
npm install -g s4ft-framework

# Ou usar npx
npx s4ft-framework create meu-projeto
\`\`\`

## 🎯 Início Rápido

\`\`\`bash
# Criar novo projeto (modo interativo)
s4ft create

# Ou criar diretamente
s4ft create meu-app --template basic --language pt-br

# Entrar no diretório
cd meu-app

# Instalar dependências
npm install

# Iniciar desenvolvimento
s4ft dev
\`\`\`

## 📝 Sintaxe S4FT

### Componentes

```s4ft
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

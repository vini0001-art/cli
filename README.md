# 🇧🇷 S4FT Framework

**Simple And Fast Templates** - Framework web brasileiro com IA integrada

[![npm version](https://badge.fury.io/js/s4ft-framework.svg)](https://badge.fury.io/js/s4ft-framework)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://typescriptlang.org)
[![AI Powered](https://img.shields.io/badge/AI-Powered-purple)](https://s4ft.dev)

## 🚀 O que é o S4FT?

S4FT é um framework web brasileiro que combina a simplicidade do desenvolvimento moderno com o poder da inteligência artificial. Criado para desenvolvedores brasileiros, oferece uma sintaxe intuitiva e ferramentas de IA integradas.

### ✨ Principais características

- 🇧🇷 **100% em português** - CLI e documentação brasileira
- 🤖 **IA integrada** - Groq, Grok, Fal e Deep Infra
- ⚡ **Zero configuração** - Funciona imediatamente
- 🎨 **Templates profissionais** - Prontos para produção
- 🔧 **Sintaxe simples** - Fácil de aprender e usar
- 📦 **Componentes reativos** - Estado automático
- 🚀 **Deploy facilitado** - Múltiplas plataformas

## 📦 Instalação

\`\`\`bash
npm install -g s4ft-framework
\`\`\`

## 🎯 Início rápido

### Criar projeto

\`\`\`bash
# Modo interativo (recomendado)
s4ft interactive

# Projeto básico
s4ft create meu-app

# Com template específico
s4ft create meu-blog --template blog --features auth,database,i18n
\`\`\`

### Desenvolvimento

\`\`\`bash
cd meu-app
s4ft dev
\`\`\`

### Gerar código com IA

\`\`\`bash
# Conversar com assistente
s4ft ai chat

# Gerar componente
s4ft ai generate component "botão com loading e ícone"

# Gerar página
s4ft ai generate page "dashboard com gráficos"

# Gerar imagem
s4ft ai image "logo moderno para startup" --save
\`\`\`

## 🎨 Sintaxe S4FT

### Componente simples

```s4ft
component Contador(props: { inicial: number }) {
  state {
    count: number = props.inicial
  }
  
  event incrementar() {
    count = count + 1
  }
  
  event decrementar() {
    count = count - 1
  }
  
  <div className="p-4 bg-white rounded-lg shadow">
    <h2 className="text-xl font-bold mb-4">Contador</h2>
    <div className="flex items-center gap-4">
      <button 
        onClick={decrementar}
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        -
      </button>
      <span className="text-2xl font-mono">{count}</span>
      <button 
        onClick={incrementar}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        +
      </button>
    </div>
  </div>
}

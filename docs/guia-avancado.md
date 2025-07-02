# Guia Avançado do S4FT – Documentação Técnica do Código

## Índice
- [Visão Geral do Core](#visão-geral-do-core)
- [Como o DevServer Funciona](#como-o-devserver-funciona)
- [SSR, Hot Reload e Rotas Dinâmicas](#ssr-hot-reload-e-rotas-dinâmicas)
- [Transpiler e Parser](#transpiler-e-parser)
- [Estrutura de um Arquivo .sft](#estrutura-de-um-arquivo-sft)
- [Exemplos de Componentes e Páginas](#exemplos-de-componentes-e-páginas)
- [Aliases e Imports no TypeScript](#aliases-e-imports-no-typescript)
- [Plugins e Hooks](#plugins-e-hooks)
- [Erros Comuns e Soluções](#erros-comuns-e-soluções)
- [Debug e Troubleshooting](#debug-e-troubleshooting)
- [Migração de Next.js para S4FT](#migração-de-nextjs-para-s4ft)

---

## Visão Geral do Core
O S4FT é composto por:
- **DevServer**: Servidor Express customizado, faz SSR, serve assets, hot reload e rotas dinâmicas.
- **Transpiler**: Converte `.sft` para React.
- **Parser**: Lê e interpreta a sintaxe `.sft`.
- **Middleware**: Permite adicionar middlewares Express.
- **Configuração**: `s4ft.config.ts` para plugins, hooks e customizações.

---

## Como o DevServer Funciona
- Inicia um servidor Express.
- Serve arquivos estáticos de `public/`.
- Observa mudanças em `.sft` e `.css` para hot reload.
- Faz SSR: Transpila `.sft` para React, executa e renderiza HTML.
- Rotas dinâmicas: Suporte a `[param].sft`.
- Fallback: Se rota não existe, exibe tela de boas-vindas.

### Fluxo Simplificado
1. Usuário acessa `/alguma-rota`
2. DevServer procura `app/alguma-rota.sft` ou rota dinâmica
3. Transpila `.sft` para React
4. Renderiza HTML e envia para o navegador
5. Hot reload via WebSocket

---

## SSR, Hot Reload e Rotas Dinâmicas
- **SSR**: Usa `react-dom/server` para renderizar componentes no servidor.
- **Hot Reload**: WebSocket notifica o navegador para recarregar ao salvar arquivos.
- **Rotas Dinâmicas**: Arquivos como `posts/[id].sft` viram `/posts/:id`.

---

## Transpiler e Parser
- O parser lê a sintaxe `.sft` e gera uma AST (Abstract Syntax Tree).
- O transpiler converte a AST em código React.
- Suporte a props, state, eventos, templates e imports.

---

## Estrutura de um Arquivo .sft
```sft
component MeuComponente {
  props {
    titulo: string = "Título padrão"
  }
  state {
    contador: number = 0
  }
  event incrementar() {
    contador = contador + 1
  }
  <div>
    <h2>{titulo}</h2>
    <button onClick={incrementar}>+</button>
  </div>
}
```

---

## Exemplos de Componentes e Páginas
### Página Simples
```sft
// app/index.s4ft
<template>
  <h1>Bem-vindo ao S4FT!</h1>
</template>
```

### Componente Reutilizável
```sft
// components/MeuBotao.sft
component MeuBotao {
  props { texto: string }
  <button>{texto}</button>
}
```

### Importando Componentes
```sft
<script>
import MeuBotao from '@/components/MeuBotao'
</script>
<template>
  <MeuBotao texto="Clique aqui" />
</template>
```

---

## Aliases e Imports no TypeScript
- Configure `tsconfig.json`:
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/components/*": ["components/*"],
      "@/lib/*": ["lib/*"]
    }
  }
}
```
- Use imports como `import Botao from '@/components/ui/button'`
- Sempre reinicie o TS Server após mudar aliases.

---

## Plugins e Hooks
- Adicione plugins no array `plugins` do `s4ft.config.ts`.
- Plugins podem usar hooks:
```ts
export default {
  plugins: [
    {
      setup({ onRoute, onBuild, onRender }) {
        onRoute('/custom', (req, res) => res.send('Custom route!'))
      }
    }
  ]
}
```

---

## Erros Comuns e Soluções
- **Import não resolvido**: Caminho errado ou alias não configurado. Corrija o path e reinicie o TS Server.
- **Asset não encontrado**: O arquivo deve estar em `public/`.
- **Erro de build TypeScript**: Verifique se todos os imports existem e se não há vestígios de Next.js.
- **Hot reload não funciona**: Veja se o servidor está rodando e não há erros no terminal.
- **Erro ao compilar componente**: Verifique a sintaxe do `.sft`.

---

## Debug e Troubleshooting
- Use `console.log` no DevServer para debugar SSR.
- Cheque o console do navegador e o terminal para mensagens de erro.
- Para erros de import, cheque se o arquivo existe e o path está correto.
- Use o comando `s4ft ai` para explicações automáticas do código.

---

## Migração de Next.js para S4FT
- Remova dependências e arquivos do Next.js.
- Ajuste imports para usar aliases do S4FT.
- Mova assets para `public/`.
- Adapte páginas para `.sft`.
- Use o DevServer do S4FT para SSR e hot reload.

---

## Dúvidas?
Abra uma issue ou acesse [www.s4ft.fun](https://www.s4ft.fun)

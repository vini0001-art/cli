# INSTRUÇÕES DO FRAMEWORK S4FT

## Sobre o S4FT

O S4FT é um framework brasileiro inspirado no Next.js, focado em produtividade, simplicidade e experiência moderna para desenvolvimento web com React. Ele utiliza arquivos `.s4ft` para definir páginas e componentes, oferece hot reload, build otimizado, CLI própria, suporte total a ES Modules e um ecossistema de plugins.

---

## Novidades e Diferenciais

- 🔌 **Ecossistema de Plugins:** Instale plugins via CLI e adicione recursos sem mexer no core.
- 🪝 **Hooks e ciclo de vida:** Personalize build, SSR, rotas e renderização via `s4ft.config.ts`.
- 🧩 **UI nativa:** Biblioteca de componentes visuais pronta para uso.
- 🚀 **Deploy integrado:** Deploy 1 comando para [s4ft.fun](https://www.s4ft.fun) e integração com GitHub Actions.
- 🗃️ **Diretórios especiais:** Suporte a `/system`, `/s4ft-ui`, `/studio` para experiências avançadas.
- 🧠 **Editor visual (Studio):** Edite `.s4ft` no navegador com live preview (experimental).
- 🔥 **Hot reload real:** APIs, componentes, configs e assets recarregam automaticamente.
- 🧱 **Sintaxe .s4ft declarativa:** Menos boilerplate, mais produtividade.
- ✨ **Suporte a pages/ (pages router) e app/ (layout router):** Escolha via `s4ft.config.ts`.

---

## Instalação

1. **Pré-requisitos:**
   - Node.js 18+
   - pnpm (ou npm/yarn)
2. **Instale as dependências:**
   ```
   pnpm install
   ```
3. **Link local (opcional, para desenvolvimento do CLI):**
   ```
   pnpm link --global
   ```

---

## Comandos Principais

- `pnpm dev`  
  Inicia o servidor de desenvolvimento com hot reload.

- `pnpm build`  
  Gera o build de produção.

- `pnpm start`  
  Inicia o servidor em modo produção.

- `pnpm export`  
  Gera uma versão estática do site para hospedagem sem servidor (arquivos .html e .json prontos para CDN).

- `s4ft`  
  Acesso à CLI do framework (após link global).

---

## CLI Modular

A CLI do S4FT pode ser estendida com comandos como:

```bash
s4ft plugin new my-plugin
s4ft component generate Button
s4ft studio
```

---

## Sintaxe .s4ft

O .s4ft é uma linguagem declarativa baseada em JSX simplificado, interpretado como React sob o capô.

Exemplo:

```s4ft
<Page title="Sobre">
  <Section>
    <Text>Olá, mundo</Text>
    <Button onClick="handleClick">Clique aqui</Button>
  </Section>
</Page>
```

---

## Plugins

Instale plugins facilmente:

```bash
s4ft plugin add s4ft-plugin-auth-github
s4ft plugin add s4ft-plugin-drive
```

Exemplo de uso no `s4ft.config.ts`:

```typescript
export default {
  plugins: [
    's4ft-plugin-auth-github',
    's4ft-plugin-drive',
    customAnalyticsPlugin({ token: 'abc123' })
  ]
}
```

Cada plugin pode usar hooks do ciclo de vida:

```typescript
export function setup({ onRoute, onBuild, onRender }) {
  onRoute('/api/auth/github', (req, res) => { /* ... */ });
  onBuild(() => { /* ... */ });
}
```

---

## Plugins com UI no Studio

Plugins com interface gráfica podem ser integrados ao Studio visual e adicionados como blocos arrastáveis.

---

## Estrutura de Pastas

```
app/           # Páginas e rotas (.s4ft)
pages/         # (Opcional) Pages router
api/           # Rotas de API (.sft)
components/    # Componentes reutilizáveis
public/        # Arquivos estáticos
styles/        # CSS global
system/        # Componentes de sistema (ex: Window.s4ft)
s4ft-ui/       # Biblioteca de UI nativa (ex: Button.s4ft)
studio/        # Editor visual (experimental)
s4ft.config.ts # Configuração principal do framework
```

---

## s4ft.config.ts

Arquivo de configuração central. Exemplo:

```typescript
export default {
  port: 3000,
  env: { API_URL: "https://api.meusite.com" },
  experimental: { ssr: true, ssg: false },
  router: "app", // ou "pages"
  hooks: {
    onRouteLoad: (path) => console.log("Nova rota:", path),
    onBuild: () => console.log("Build iniciado!"),
    onSSR: (ctx) => console.log("SSR executado!", ctx)
  },
  plugins: [
    's4ft-plugin-auth-github',
    's4ft-plugin-drive'
  ],
  watch: ["app/**/*.sft", "components/**/*.sft", "styles/**/*.css", "s4ft.config.ts"],
  ui: {
    enabled: true,
    theme: "default",
    plugins: ["auth-github", "drive"]
  },
  deploy: { provider: "s4ft.fun", githubIntegration: true }
}
```

---

## Exemplos de Plugins

- **s4ft-plugin-auth-github:** Login via GitHub
- **s4ft-plugin-drive:** Upload para Google Drive
- **s4ft-plugin-analytics:** Painel de stats
- **s4ft-plugin-components:** Biblioteca de UI global
- **s4ft-plugin-pwa:** Suporte a PWA
- **s4ft-plugin-docs:** Geração automática de documentação

---

## Studio Visual

Acesse `/studio` para editar e visualizar `.s4ft` ao vivo (experimental).

---

## Deploy

Faça deploy do seu projeto com um comando:

```bash
s4ft deploy --target s4ft.fun
```

---

## Estrutura real recomendada

```
app/
  layout.s4ft
  page.s4ft
api/
  hello.sft
```

---

## Testes

Em breve: `s4ft test` com suporte a Jest + testes E2E via Playwright.

---

## 🚧 Roadmap

- [x] CLI com suporte a build/dev/start
- [x] Plugins com hooks
- [x] Deploy automático via s4ft.fun
- [x] Studio visual experimental
- [ ] Editor visual estável
- [ ] Sistema de autenticação nativo
- [ ] Marketplace de plugins
- [ ] Painel web de deploy e status

---

Feito com orgulho no Brasil 🇧🇷

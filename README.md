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
**Criar Projeto:**
s4ft init nome-do-projeto

cd meu-novo-projeto

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

# Documentação Completa — Sidebar S4FT

## Visão Geral

O componente `Sidebar` é um sistema de navegação lateral altamente flexível e responsivo, projetado para aplicações React/Next.js. Ele suporta variantes, colapsamento, integração mobile, atalhos de teclado, agrupamento de menus, customização visual e fácil composição com outros componentes.

---

## Estrutura dos Componentes

- **SidebarProvider**: Contexto e estado global do sidebar.
- **Sidebar**: Container principal da barra lateral.
- **SidebarTrigger**: Botão para abrir/fechar o sidebar.
- **SidebarRail**: Área sensível para redimensionamento/colapso.
- **SidebarInset**: Container para o conteúdo principal da página ao lado do sidebar.
- **SidebarHeader/Footer**: Áreas para cabeçalho e rodapé.
- **SidebarContent**: Container para o conteúdo do sidebar.
- **SidebarGroup/SidebarGroupLabel/SidebarGroupAction/SidebarGroupContent**: Agrupamento de itens/menu.
- **SidebarMenu/SidebarMenuItem/SidebarMenuButton/SidebarMenuAction/SidebarMenuBadge/SidebarMenuSkeleton/SidebarMenuSub/SidebarMenuSubItem/SidebarMenuSubButton**: Elementos de menu e submenus.
- **SidebarInput**: Campo de busca ou filtro.
- **SidebarSeparator**: Separador visual.

---

## Exemplo Básico de Uso

```tsx
import {
  SidebarProvider,
  Sidebar,
  SidebarTrigger,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
} from "@/components/ui/sidebar";

export default function Layout({ children }) {
  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <SidebarTrigger />
          <h1>Minha App</h1>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Menu</SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton isActive>Dashboard</SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton>Configurações</SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <span>v1.0</span>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
```

---

## Props e Variantes

### SidebarProvider

| Prop           | Tipo      | Descrição                                              |
|----------------|-----------|--------------------------------------------------------|
| defaultOpen    | boolean   | Aberto por padrão? (default: true)                     |
| open           | boolean   | Controle externo do estado aberto/fechado              |
| onOpenChange   | function  | Callback ao abrir/fechar                               |
| className      | string    | Classes extras                                         |
| style          | object    | Estilos inline                                         |

### Sidebar

| Prop         | Tipo                         | Descrição                                              |
|--------------|------------------------------|--------------------------------------------------------|
| side         | "left" \| "right"            | Lado do sidebar (default: "left")                      |
| variant      | "sidebar" \| "floating" \| "inset" | Visual/layout (default: "sidebar")                |
| collapsible  | "offcanvas" \| "icon" \| "none" | Tipo de colapso (default: "offcanvas")            |
| className    | string                       | Classes extras                                         |

### SidebarTrigger

Botão para abrir/fechar o sidebar. Aceita todas as props de `Button`.

### SidebarRail

Área sensível para colapso/expansão (desktop).

### SidebarInset

Container para o conteúdo principal da página, ajustando margens conforme o sidebar.

### SidebarHeader / SidebarFooter

Áreas para cabeçalho e rodapé do sidebar.

### SidebarContent

Container para o conteúdo principal do sidebar.

### SidebarGroup

Agrupa menus ou seções.

### SidebarGroupLabel

Rótulo do grupo. Prop `asChild` permite trocar o elemento base.

### SidebarGroupAction

Botão de ação do grupo (ex: adicionar item). Prop `asChild` permite customização.

### SidebarMenu

Lista de itens de menu.

### SidebarMenuItem

Item de menu.

### SidebarMenuButton

Botão de menu. Props:
- `isActive`: destaca como ativo.
- `variant`: "default" ou "outline".
- `size`: "default", "sm", "lg".
- `tooltip`: string ou objeto para tooltip.

### SidebarMenuAction

Botão de ação em um item de menu. Prop `showOnHover` exibe apenas ao passar o mouse.

### SidebarMenuBadge

Badge para contadores/indicadores.

### SidebarMenuSkeleton

Placeholder animado para loading.

### SidebarMenuSub / SidebarMenuSubItem / SidebarMenuSubButton

Menus aninhados (submenus).

### SidebarInput

Campo de busca/filtro.

### SidebarSeparator

Linha separadora.

---

## Contexto e Hooks

### useSidebar

Hook para acessar o contexto do sidebar:

```tsx
const {
  state,           // "expanded" | "collapsed"
  open,            // boolean
  setOpen,         // (open: boolean) => void
  isMobile,        // boolean
  openMobile,      // boolean
  setOpenMobile,   // (open: boolean) => void
  toggleSidebar,   // () => void
} = useSidebar();
```

---

## Atalhos de Teclado

- `Ctrl+B` ou `Cmd+B`: alterna o estado do sidebar (desktop e mobile).

---

## Responsividade

- Em telas mobile, o sidebar vira um drawer (`Sheet`).
- Em desktop, pode ser colapsado para ícones ou ocultado.
- O estado é salvo em cookie (`sidebar:state`).

---

## Personalização

- Use as props `variant`, `collapsible`, `side` para alterar o layout.
- Adicione seus próprios componentes dentro de `SidebarContent`, `SidebarHeader`, etc.
- Use `className` para customizar estilos.
- Integre com outros componentes (ex: botões, inputs, badges).

---

## Exemplo Avançado: Sidebar com Submenus e Badge

```tsx
<SidebarProvider>
  <Sidebar variant="floating" collapsible="icon">
    <SidebarHeader>
      <SidebarTrigger />
      <span>Logo</span>
    </SidebarHeader>
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>Principal</SidebarGroupLabel>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton isActive tooltip="Página inicial">
              <HomeIcon />
              Início
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="Notificações">
              <BellIcon />
              Notificações
              <SidebarMenuBadge>3</SidebarMenuBadge>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <SettingsIcon />
              Configurações
            </SidebarMenuButton>
            <SidebarMenuSub>
              <SidebarMenuSubItem>
                <SidebarMenuSubButton isActive>Perfil</SidebarMenuSubButton>
              </SidebarMenuSubItem>
              <SidebarMenuSubItem>
                <SidebarMenuSubButton>Conta</SidebarMenuSubButton>
              </SidebarMenuSubItem>
            </SidebarMenuSub>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>
    </SidebarContent>
    <SidebarFooter>
      <SidebarInput placeholder="Buscar..." />
    </SidebarFooter>
  </Sidebar>
  <SidebarInset>
    {/* Conteúdo da página */}
  </SidebarInset>
</SidebarProvider>
```

---

## Dicas

- Sempre envolva o layout com `SidebarProvider`.
- Use `SidebarInset` para o conteúdo principal da página.
- Combine `SidebarMenuButton` com ícones para melhor UX.
- Use `SidebarMenuBadge` para notificações ou contadores.
- O estado do sidebar é persistente entre reloads (via cookie).
- Para customizar ainda mais, utilize as classes utilitárias do Tailwind.

---

## Integração com Outros Componentes

Você pode integrar o Sidebar com qualquer componente React, inclusive botões, inputs, tooltips, avatares, etc. Basta importar e compor dentro das áreas apropriadas (`SidebarContent`, `SidebarHeader`, etc).

---

## Observações

- O Sidebar não faz roteamento automático. Use com seu sistema de rotas (ex: Next.js, React Router).
- O SSR não é afetado pelo Sidebar, pois ele é client-side.
- Para temas, personalize as variáveis CSS ou classes do Tailwind.

---

## Referência Rápida de Exportações

```js
export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
}
```

---

## Conclusão

O componente Sidebar é modular, extensível e pronto para uso em aplicações modernas. Consulte este guia sempre que precisar montar, customizar ou integrar a navegação lateral do seu projeto S4FT.

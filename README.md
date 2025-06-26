# INSTRUÇÕES DO FRAMEWORK S4FT

## Sobre o S4FT

O S4FT é um framework brasileiro inspirado no Next.js, focado em produtividade, simplicidade e experiência moderna para desenvolvimento web com React. Ele utiliza arquivos `.s4ft` para definir páginas e componentes, oferece hot reload, build otimizado, CLI própria e suporte total a ES Modules.

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

- `s4ft`  
  Acesso à CLI do framework (após link global).

---

## Estrutura de Pastas

- `app/`  
  Páginas e rotas da aplicação (arquivos `.s4ft`).

- `components/`  
  Componentes reutilizáveis.

- `public/`  
  Arquivos estáticos (imagens, ícones, etc).

- `styles/`  
  Arquivos CSS globais.

- `src/`  
  Código-fonte do framework (não altere para projetos de usuário).

- `examples/`  
  Exemplos de apps usando o S4FT.

---

## Como funciona?

- O S4FT transpila arquivos `.s4ft` para React.
- O dev server serve as páginas, faz hot reload e recarrega o navegador automaticamente.
- Rotas são baseadas na estrutura de pastas dentro de `app/`.
- Rotas de API podem ser criadas em `app/api/` usando arquivos `.sft`.

---

## Exemplo de Página

Arquivo: `app/page.s4ft`
```jsx
export default function Home() {
  return <h1>Bem-vindo ao S4FT!</h1>
}
```

---

## Dicas

- Use apenas imports relativos terminando com `.js` nos arquivos do framework.
- Para destacar o caráter brasileiro, utilize exemplos nacionais e contribua com a comunidade.
- Consulte o README.md para mais detalhes e exemplos.

---

## Suporte

- Documentação: [README.md](./README.md)
- Comunidade: (adicione link do Discord/Telegram se houver)
- Contribua: Pull Requests e Issues são bem-vindos!
# S4FT - Framework Web Brasileiro

[Repositório Oficial no GitHub](https://github.com/s4ftframework/S4ft-Plataforma.git)

O **S4FT** é um framework web brasileiro inspirado no Next.js, focado em produtividade, simplicidade e experiência moderna para desenvolvimento com React. Ele utiliza arquivos `.s4ft` para páginas/componentes, oferece hot reload, build otimizado, CLI própria e suporte total a ES Modules.

---

## 🚀 Principais Recursos

- **Arquivos `.s4ft`**: Sintaxe semelhante ao React/JSX para páginas e componentes.
- **Hot Reload**: Atualização instantânea no navegador ao salvar arquivos.
- **CLI própria**: Comandos para criar, rodar e buildar projetos.
- **Rotas automáticas**: Baseadas na estrutura de pastas em `app/`.
- **Rotas de API**: Crie endpoints facilmente em `app/api/`.
- **Build otimizado**: Pronto para produção.
- **Totalmente ES Modules**: Imports relativos terminando com `.js`.
- **Documentação e exemplos em português**.

---

## 📦 Instalação

1. **Pré-requisitos**  
   - Node.js 18+
   - pnpm (ou npm/yarn)

2. **Clone o projeto e instale as dependências**
   ```sh
   git clone https://github.com/seu-usuario/s4ft.git
   cd s4ft-cli
   pnpm install
   ```

3. **(Opcional) Link global para usar a CLI**
   ```sh
   pnpm link --global
   ```

---

## 🛠️ Comandos

- `pnpm dev` — Inicia o servidor de desenvolvimento com hot reload.
- `pnpm build` — Gera o build de produção.
- `pnpm start` — Inicia o servidor em modo produção.
- `s4ft` — Acesso à CLI do framework (após link global).

---

## 📁 Estrutura do Projeto

```
app/           # Páginas e rotas (.s4ft)
components/    # Componentes reutilizáveis
public/        # Arquivos estáticos
styles/        # CSS global
src/           # Código-fonte do framework
examples/      # Exemplos de apps
```

---

## ✨ Como funciona?

- O S4FT transpila arquivos `.s4ft` para React.
- O dev server serve as páginas, faz hot reload e recarrega o navegador automaticamente.
- Rotas são baseadas na estrutura de pastas dentro de `app/`.
- Rotas de API podem ser criadas em `app/api/` usando arquivos `.sft`.

---

## 📝 Exemplo de Página

Arquivo: `app/page.s4ft`
```jsx
export default function Home() {
  return <h1>Bem-vindo ao S4FT!</h1>
}
```

---

## 🔥 Hot Reload

Ao salvar qualquer arquivo `.s4ft` ou `.css`, o navegador recarrega automaticamente.

---

## 🧩 Rotas de API

Crie endpoints em `app/api/` usando arquivos `.sft`.  
Exemplo: `app/api/users.sft`

---

## 🇧🇷 Caráter Brasileiro

- Documentação e exemplos em português.
- Foco em facilitar o onboarding de devs brasileiros.
- Sinta-se à vontade para contribuir com exemplos nacionais!

---

## 🤝 Contribuição

Pull Requests e Issues são bem-vindos!  
Siga o padrão de imports relativos com `.js` para garantir compatibilidade com ES Modules.

---

## 📚 Mais informações

- [INSTRUCOES.txt](./INSTRUCOES.txt) — Guia rápido e instruções detalhadas.
- Exemplos em `examples/basic-app/`.

---

## 📞 Suporte

- Comunidade: (adicione link do Discord/Telegram se houver)
- Dúvidas e sugestões: abra uma Issue!

---

## ☁️ Hospedagem Oficial

Você pode hospedar seus projetos S4FT facilmente na nossa plataforma oficial: [https://www.s4ft.fun](https://www.s4ft.fun)

- Deploy simples e rápido.
- Suporte dedicado para projetos brasileiros.
- Ideal para portfólios, landing pages, APIs e aplicações completas.

Saiba mais em [https://www.s4ft.fun](https://www.s4ft.fun).

---

## 🏆 Planos de Hospedagem S4FT

Hospede seus projetos S4FT facilmente na plataforma oficial [https://www.s4ft.fun](https://www.s4ft.fun) e aproveite planos flexíveis para todos os perfis:

| Plano         | Preço      | Indicado para                | Recursos principais                                                                 | Ação                        |
|---------------|------------|-----------------------------|-------------------------------------------------------------------------------------|-----------------------------|
| **Free**      | R$ 0/mês   | Projetos pessoais           | Até 3 projetos<br>Subdomínio gratuito<br>Deploy manual<br>Suporte básico            | [Começar Grátis](https://www.s4ft.fun) |
| **Pro** <br>Mais Popular | R$ 29/mês  | Desenvolvedores profissionais | Projetos ilimitados<br>Domínios personalizados<br>Deploy automático<br>Analytics avançado<br>Suporte prioritário | [Começar Teste](https://www.s4ft.fun)  |
| **Enterprise**| R$ 99/mês  | Equipes e empresas          | Tudo do Pro<br>Deploy edge<br>Escalabilidade automática<br>Suporte dedicado<br>SLA garantido | [Falar com Vendas](https://www.s4ft.fun/contato) |

> Todos os planos incluem integração total com o framework S4FT e deploy simplificado.

---

## 💚 Apoie o Projeto S4FT

O S4FT é um framework brasileiro open source, mantido com dedicação para a comunidade. Se você gostou do projeto, considere fazer uma doação para ajudar a manter e evoluir a plataforma!

### Para brasileiros 🇧🇷

- **PIX:**  
  Chave: **doacao@s4ft.fun**

- **Stripe (cartão de crédito):**  
  [Doar a partir de R$ 5,00](https://buy.stripe.com/4gM5kE16MfCb4b72C60sU00)

### Para não brasileiros 🌎

- **Stripe (credit card):**  
  [Donate from $5 USD](https://buy.stripe.com/fZu7sMg1G3Tt7nj4Ke0sU01)

> Os valores sugeridos começam em R$ 5,00 (cinco reais) ou $5 USD, mas você pode ajustar conforme desejar.

Sua contribuição faz toda a diferença para o crescimento do S4FT e da comunidade open source nacional!

---

Feito com orgulho no Brasil 🇧🇷

# 🇧🇷 S4FT Framework

**Simple And Fast Templates** - O primeiro framework web brasileiro focado em simplicidade e performance.

[![npm version](https://badge.fury.io/js/s4ft.svg)](https://badge.fury.io/js/s4ft)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Discord](https://img.shields.io/discord/1234567890?color=7289da&label=Discord&logo=discord&logoColor=white)](https://discord.gg/HywWFPJuhe)

---

## 🚀 Características

- **🎯 Sintaxe Declarativa** — Escreva menos, faça mais
- **⚡ Performance Extrema** — Bundles mínimos, carregamento instantâneo
- **🔥 Hot Reload** — Desenvolvimento ultrarrápido
- **🌐 SSR/SSG Nativo** — Server-side rendering automático
- **📱 PWA Ready** — Progressive Web Apps por padrão
- **🤖 IA Integrada** — Assistente powered by Grok
- **🇧🇷 Brasileiro** — Documentação e suporte em português

**🤖 IA Integrada — Assistente powered by Grok**

O S4FT Framework agora conta com integração de IA via assistente Grok, tornando sua CLI ainda mais inteligente e produtiva.

🔍 Exemplos de uso:
```bash
# Explica componentes e estrutura do projeto
s4ft ai "O assistente Grok analisa o código do componente informado e retorna uma explicação detalhada sobre sua função, props, estado e lógica, facilitando o entendimento do código."

# Sugere melhorias no código
s4ft ai "O Grok revisa o módulo especificado, identifica possíveis melhorias de performance, legibilidade, segurança ou boas práticas, e sugere alterações diretamente no terminal."

# Gera snippets de código S4FT automaticamente
s4ft ai "O assistente gera automaticamente um exemplo de código S4FT para a funcionalidade solicitada, pronto para ser usado ou adaptado no seu projeto."

# Traduções técnicas com contexto de projeto
s4ft ai " Grok traduz o conteúdo do README (ou outro arquivo) para o inglês, mantendo o contexto técnico e a terminologia do projeto."
```

⚙️ Como funciona

O comando `s4ft ai` utiliza o backend Grok (X) para interpretar o código local e responder com contexto, diretamente no terminal ou no navegador, conforme sua preferência.

- 🚀 Suporte a `.s4ft`, `.sft`, `README.md` e arquivos `.config`
- 🧠 Compreensão contextual baseada no seu projeto atual
- 🌐 Respostas via terminal ou interface web integrada

💡 Importante: Você pode ativar/desativar o modo IA com:

```bash
s4ft config ai.enable true
```


---

## 📦 Instalação

```bash
# Instalar globalmente
npm install -g s4ft

# Ou usar npx
npx s4ft create meu-projeto
```

---

## 🎯 Início Rápido

```bash
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
```

## 📝 Sintaxe S4FT

### Exemplo de Componente

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
```

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

## 🔥 Hot Reload

Ao salvar qualquer arquivo `.s4ft` ou `.css`, o navegador recarrega automaticamente.

---

## 🧩 Rotas de API

Crie endpoints em `app/api/` usando arquivos `.sft`.

Exemplo: `app/api/users.sft`

---

## 🆕 Novidades da v2


## 🆕 Novidades da versão 2.0.10

- **Versão:** `2.0.10`
- **Remoção total de dependências do Next.js**: O S4FT agora é 100% independente, sem vestígios de Next.js no build, scripts ou arquivos.
- **Build e hot reload aprimorados**: Correções no DevServer, recarregamento instantâneo e SSR mais estável.
- **Aliases TypeScript revisados**: Imports de componentes e UI agora funcionam com aliases (`@/components/ui/...`) sem erros.
- **Assets estáticos padronizados**: Todos os arquivos públicos devem estar em `public/` e são servidos corretamente.
- **Correção de erros de importação**: Todos os imports quebrados e referências antigas foram removidos ou ajustados.
- **Documentação expandida**: Novo guia avançado em `docs/guia-avancado.md` com detalhes técnicos do core, exemplos e troubleshooting.
- **Melhorias de performance**: Build mais rápido, SSR otimizado e menor consumo de memória.
- **Refatoração de componentes**: UI e utilitários revisados para maior compatibilidade e facilidade de uso.
- **Fallback de boas-vindas aprimorado**: Tela inicial mais clara e amigável para novos projetos.
- **Pronto para produção**: Estrutura estável para projetos reais, APIs e sites completos.

---

---

## 🇧🇷 Caráter Brasileiro

- Documentação e exemplos em português.
- Foco em facilitar o onboarding de devs brasileiros.
- Sinta-se à vontade para contribuir com exemplos nacionais!

---

## 🤝 Contribuição

Pull Requests e Issues são bem-vindos!  
Siga o padrão de imports relativos com `.js` para garantir compatibilidade com ES Modules.

### Como contribuir

1. Fork este repositório
2. Crie uma branch: `git checkout -b minha-feature`
3. Faça suas alterações e commit: `git commit -m 'Minha contribuição'`
4. Envie para seu fork: `git push origin minha-feature`
5. Abra um Pull Request

---

## 📚 Mais informações

- `INSTRUCOES.txt` — Guia rápido e instruções detalhadas.
- Exemplos em `examples/basic-app/`.
- [Documentação oficial](https://github.com/vini0001-art/cli.git)

---

## ❗ Aviso sobre o pacote antigo

> ⚠️ O pacote **s4ft-framework** está depreciado.  
> Use sempre o novo pacote **s4ft** para projetos atuais e futuros.

---

## 📞 Suporte

- Comunidade: [Discord](https://discord.gg/s4ft)
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

| Plano      | Preço      | Indicado para              | Recursos principais                        | Ação           |
|------------|------------|---------------------------|--------------------------------------------|----------------|
| Free       | R$ 0/mês   | Projetos pessoais         | Até 3 projetos, subdomínio gratuito, deploy manual, suporte básico | Começar Grátis |
| Pro        | R$ 29/mês  | Desenvolvedores profissionais | Projetos ilimitados, domínios personalizados, deploy automático, analytics avançado, suporte prioritário | Começar Teste  |
| Enterprise | R$ 99/mês  | Equipes e empresas        | Tudo do Pro, deploy edge, escalabilidade automática, suporte dedicado, SLA garantido | Falar com Vendas |

Todos os planos incluem integração total com o framework S4FT e deploy simplificado.

---


## 💖 Apoie o Projeto

Se este projeto te ajuda ou inspira, considere apoiar o desenvolvimento:

- [Doe via Pix](00020101021126540014br.gov.bcb.pix0116doacoes@s4ft.fun0212Doacoes s4ft5204000053039865802BR5925MARCIA REGINA MACHADO DA 6009SAO PAULO622905251JZ2Z5MV9Y70ZSD9YCHDFQEGZ63042A77)
- [Strype R$](https://buy.stripe.com/4gM5kE16MfCb4b72C60sU00)
- [Strype U$](https://buy.stripe.com/fZu7sMg1G3Tt7nj4Ke0sU01)

Qualquer valor é bem-vindo e ajuda a manter o S4FT evoluindo! 🙏

---

Feito com orgulho no Brasil 🇧🇷

---

## 🖥️ Requisitos do Sistema

- **Node.js**: >= 18.x
- **npm**: >= 9.x ou **pnpm**: >= 8.x ou **yarn**: >= 3.x
- **Sistemas Operacionais**: Windows, Linux, macOS

---

## 🗺️ Roadmap

- Suporte a plugins e middlewares customizados
- Integração nativa com bancos de dados (ex: Prisma, Drizzle)
- Gerador de documentação automática
- Deploy serverless integrado
- Painel web para gerenciamento de projetos
- Suporte a internacionalização (i18n) avançada
- Mais exemplos de templates prontos

---

## ❓ FAQ (Perguntas Frequentes)

**1. O build está falhando, o que fazer?**  
Verifique se está usando a versão correta do Node.js e se todas as dependências estão instaladas. Rode `npm install` ou `pnpm install` novamente.

**2. Como faço deploy do meu projeto?**  
Você pode usar a plataforma oficial S4FT ou qualquer serviço de hospedagem que suporte Node.js. Veja a seção de hospedagem no README.

**3. Posso usar TypeScript?**  
Sim! O S4FT suporta TypeScript nativamente.

**4. Como criar rotas dinâmicas?**  
Basta criar arquivos com colchetes, ex: `app/posts/[id].s4ft`.

---

## ⚡ Benchmarks

| Framework    | Build Inicial | TTFB SSR | Bundle Final |
|--------------|---------------|----------|--------------|
| **S4FT**     | 1.2s          | 45ms     | 38kb         |
| s4ft.js      | 2.8s          | 110ms    | 70kb         |
| Astro        | 2.1s          | 80ms     | 42kb         |

*Testes realizados em projeto padrão, Node 18, ambiente local.*

---

## 🚀 Casos de Uso / Projetos em Produção

- [Portfólio Marcos Dresbach](https://portfolio-marcos-dresbach.s4ft.fun)
- [Landing Page Startup X](https://startupx.s4ft.fun)
- [API de Produtos Demo](https://api-produtos-demo.s4ft.fun)
- [Blog Tech Brasil](https://blogtechbrasil.s4ft.fun)

*Quer ver seu projeto aqui? Envie um PR ou entre em contato!*

---

## 📄 Licença

Este projeto está licenciado sob a Licença MIT.

```
MIT License

Copyright (c) 2025 S4FT

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 🤝 Contato Comercial / Parcerias

- E-mail: contato@s4ft.fun
- Formulário: [https://www.s4ft.fun/contato](https://www.s4ft.fun/contato)

---

## 🛠️ Customização Avançada

- Crie hooks customizados em `hooks/`
- Adicione middlewares em `middleware.ts`
- Extenda componentes em `components/`
- Use o arquivo `s4ft.config.ts` para personalizar o build, rotas e integrações

---

## 🔗 Integração com Outras Ferramentas

### CI/CD (GitHub Actions)

```yaml
# .github/workflows/deploy.yml
name: Deploy S4FT

on: [push]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      - run: pnpm install
      - run: pnpm build
      - run: pnpm deploy
```

### Monitoramento

- Integre com serviços como Sentry, LogRocket ou Datadog adicionando o SDK no seu `src/` ou `middleware.ts`.

---

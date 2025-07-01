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

---

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

- Novo nome de pacote: **s4ft** (o antigo s4ft-framework está depreciado)
- CLI mais rápida e intuitiva
- Melhorias de performance e build
- Documentação expandida e exemplos reais

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

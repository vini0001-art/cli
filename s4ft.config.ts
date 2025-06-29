import dotenv from "dotenv";
dotenv.config();
import meuPlugin from "./meuPlugin";
import customAnalyticsPlugin from "./plugins/customAnalyticsPlugin";

const config = {
  // Configurações básicas
  port: process.env.PORT ? parseInt(process.env.PORT) : 3000,
  basePath: process.env.BASE_PATH || "/",
  env: {
    API_URL: process.env.API_URL || "https://api.meusite.com"
  },

  // Suporte a módulos customizados
  transpileModules: [],

  // Features experimentais
  experimental: {
    ssr: true, // Ative SSR por padrão
    ssg: false
  },

  // Hooks e plug-ins do framework
  hooks: {
    onRouteLoad: (path: string) => {
      console.log("📦 Nova rota carregada:", path);
      // Você pode adicionar lógica customizada aqui
    },
    onBuild: () => {
      console.log("🔨 Build iniciado!");
      // Lógica customizada de build
    },
    onSSR: (ctx: any) => {
      console.log("🧬 SSR executado!", ctx);
      // Manipule contexto do SSR aqui
    }
  },

  // Plug-ins customizados (exemplo)
  plugins: [
    meuPlugin,
    "s4ft-plugin-auth-github", // instalado via npm
    "s4ft-plugin-drive",
    customAnalyticsPlugin({ token: "abc123" }) // plugin local com config
    // Exemplo de plug-in customizado:
    // (plugin) => plugin({ config, app, server })
    // function meuPlugin({ config, app, server }) {
    //   // Lógica do plug-in aqui
    // }
  ],

  // Hot reload customizado
  watch: [
    "app/**/*.sft",
    "components/**/*.sft",
    "styles/**/*.css",
    "s4ft.config.ts"
  ],

  // UI embutida (exemplo)
  ui: {
    enabled: true,
    theme: "default"
  },

  // Deploy integrado (exemplo)
  deploy: {
    provider: "s4ft.fun",
    githubIntegration: true
  }
};

export default config;
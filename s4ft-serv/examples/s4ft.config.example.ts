import type { S4FTConfig } from "../s4ft.config"

// Exemplo de configuração completa do S4FT
const config: S4FTConfig = {
  // Informações do projeto
  name: "meu-app-s4ft",
  version: "1.0.0",
  description: "Minha aplicação incrível feita com S4FT",

  // Configurações de build
  build: {
    outDir: "dist",
    minify: true,
    sourceMaps: true,
    target: "es2020",
    splitting: true,
    treeshaking: true,
  },

  // Servidor de desenvolvimento
  dev: {
    port: 3000,
    host: "localhost",
    open: true,
    https: false,
    proxy: {
      "/api": "http://localhost:8080",
    },
  },

  // Deploy
  deploy: {
    target: "s4ft-cloud",
    domain: "meuapp.s4ft.fun",
    env: {
      NODE_ENV: "production",
    },
  },

  // Plugins
  plugins: [
    "s4ft-plugin-pwa",
    "s4ft-plugin-tailwind",
    [
      "s4ft-plugin-auth",
      {
        providers: ["google", "github"],
        redirectUrl: "/dashboard",
      },
    ],
    [
      "s4ft-plugin-analytics",
      {
        google: "GA-XXXXXXXXX",
      },
    ],
  ],

  // CSS
  css: {
    preprocessor: "sass",
    postcss: true,
    tailwind: true,
  },

  // TypeScript
  typescript: {
    strict: true,
    target: "es2020",
    lib: ["dom", "es2020"],
  },

  // PWA
  pwa: {
    name: "Meu App S4FT",
    shortName: "MeuApp",
    description: "Aplicação PWA feita com S4FT",
    themeColor: "#667eea",
    backgroundColor: "#ffffff",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  },

  // SEO
  seo: {
    title: "Meu App S4FT",
    description: "A melhor aplicação feita com S4FT",
    keywords: ["s4ft", "react", "s4ftjs", "framework"],
    author: "Seu Nome",
    image: "/og-image.png",
  },

  // Analytics
  analytics: {
    google: "GA-XXXXXXXXX",
    vercel: true,
  },

  // Autenticação
  auth: {
    providers: ["google", "github"],
    redirectUrl: "/dashboard",
    secret: process.env.AUTH_SECRET,
  },

  // Banco de dados
  database: {
    provider: "supabase",
    url: process.env.DATABASE_URL,
    migrations: "./migrations",
  },
}

export default config

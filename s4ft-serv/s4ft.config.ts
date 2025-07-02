export interface S4FTConfig {
  // Configurações básicas
  name?: string
  version?: string
  description?: string

  // Configurações de build
  build?: {
    outDir?: string
    minify?: boolean
    sourceMaps?: boolean
    target?: "es5" | "es2015" | "es2017" | "es2018" | "es2019" | "es2020" | "esnext"
    splitting?: boolean
    treeshaking?: boolean
  }

  // Configurações do servidor de desenvolvimento
  dev?: {
    port?: number
    host?: string
    open?: boolean
    https?: boolean
    proxy?: Record<string, string>
  }

  // Configurações de deploy
  deploy?: {
    target?: "s4ft-cloud" | "vercel" | "netlify" | "github-pages"
    domain?: string
    env?: Record<string, string>
  }

  // Plugins
  plugins?: (string | [string, any])[]

  // Configurações de CSS
  css?: {
    preprocessor?: "sass" | "less" | "stylus"
    postcss?: boolean
    tailwind?: boolean
  }

  // Configurações de TypeScript
  typescript?: {
    strict?: boolean
    target?: string
    lib?: string[]
  }

  // Configurações de PWA
  pwa?: {
    name?: string
    shortName?: string
    description?: string
    themeColor?: string
    backgroundColor?: string
    icons?: Array<{
      src: string
      sizes: string
      type: string
    }>
  }

  // Configurações de SEO
  seo?: {
    title?: string
    description?: string
    keywords?: string[]
    author?: string
    image?: string
  }

  // Configurações de Analytics
  analytics?: {
    google?: string
    vercel?: boolean
    plausible?: string
  }

  // Configurações de autenticação
  auth?: {
    providers?: ("google" | "github" | "facebook" | "auth0")[]
    redirectUrl?: string
    secret?: string
  }

  // Configurações de banco de dados
  database?: {
    provider?: "supabase" | "planetscale" | "mongodb" | "postgresql"
    url?: string
    migrations?: string
  }
}

// Configuração padrão do S4FT
const defaultConfig: S4FTConfig = {
  build: {
    outDir: "dist",
    minify: true,
    sourceMaps: false,
    target: "es2020",
    splitting: true,
    treeshaking: true,
  },

  dev: {
    port: 3000,
    host: "localhost",
    open: true,
    https: false,
  },

  deploy: {
    target: "s4ft-cloud",
  },

  css: {
    postcss: true,
    tailwind: true,
  },

  typescript: {
    strict: true,
    target: "es2020",
    lib: ["dom", "es2020"],
  },

  plugins: [],
}

export default defaultConfig

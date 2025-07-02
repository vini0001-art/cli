
/** @type {import('s4ft').s4ftConfig} */
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const s4ftConfig = {
  // Diretórios de páginas e app estão na raiz do monorepo
  // Isso permite rodar o build mesmo com app/pages fora de s4ft-serv
  // Veja: https://s4ftjs.org/docs/app/building-your-application/configuring/app-directory#custom-app-directory
  // Atenção: appDir não é mais suportado no s4ft.js >=13.4 fora do root.
  // Para builds funcionarem, a pasta 'app' precisa estar dentro de 's4ft-serv'.
  experimental: {
    optimizePackageImports: ['lucide-react']
    // Removido appDir e serverComponentsExternalPackages (obsoletos)
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    domains: ['localhost', 's4ft.fun'],
    formats: ['image/webp', 'image/avif']
  },
  // ...existing code...
  serverExternalPackages: ['@s4ft/core'], // Fora do experimental
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'origin-when-cross-origin' },
          { key: 'X-S4FT-Framework', value: 'v1.0.1' }
        ],
      },
    ]
  },
  async rewrites() {
    return [
      {
        source: '/s4ft-api/:path*',
        destination: '/api/:path*'
      }
    ]
  },
  webpack: (config, { dev, isServer }) => {
    // S4FT Framework custom webpack config
    config.resolve.alias = {
      ...config.resolve.alias,
      '@s4ft/core': resolve('./src/index.ts'),
      '@s4ft/cli': resolve('./src/cli/cli.ts')
    }

    // Add S4FT file loader
    config.module.rules.push({
      test: /\.s4ft$/,
      use: [
        {
          loader: resolve('./src/transpiler/transpiler.ts'),
          options: {
            dev,
            isServer
          }
        }
      ]
    })

    return config
  },
  env: {
    S4FT_VERSION: '1.0.1',
    S4FT_BUILD_TIME: new Date().toISOString(),
    S4FT_FRAMEWORK: 'true'
  }
}

export default s4ftConfig

/** @type {import('next').NextConfig} */
import { resolve } from 'path';

const nextConfig = {
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
  experimental: {
    optimizePackageImports: ['lucide-react']
    // Removido appDir e serverComponentsExternalPackages (obsoletos)
  },
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

export default nextConfig

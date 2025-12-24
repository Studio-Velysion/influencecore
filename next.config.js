/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async headers() {
    // En dev, éviter tout cache navigateur sur les assets Next (réduit les ChunkLoadError après rebuild)
    if (process.env.NODE_ENV !== 'production') {
      return [
        {
          source: '/_next/static/:path*',
          headers: [
            { key: 'Cache-Control', value: 'no-store, must-revalidate' },
          ],
        },
      ]
    }
    return []
  },
  webpack: (config, { isServer }) => {
    // En dev, désactiver le cache disque webpack (sur Windows ça peut provoquer des états corrompus / ENOENT)
    if (process.env.NODE_ENV !== 'production') {
      config.cache = false
    }

    // Polyfill pour les modules Node.js côté client
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        buffer: false,
        'buffer/': false,
        crypto: false,
        stream: false,
        util: false,
        url: false,
        fs: false,
        net: false,
        tls: false,
      }
    }
    return config
  },
}

module.exports = nextConfig


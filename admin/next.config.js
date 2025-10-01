/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.pexels.com',
      },
      {
        protocol: 'https',
        hostname: 'cdn.builder.io',
        pathname: '/**'
      },
    ],
  },
  // Allow Builder preview and localhost origins during development (for HMR/RSC and assets)
  // Note: Next.js supports wildcards in dev for convenience.
  allowedDevOrigins: [
    'http://localhost:3000',
    'https://*.builder.codes',
    'https://*.projects.builder.codes',
    'https://*.fly.dev',
    'https://8bebb54ab3d44baeb4e44f37f83d2d59-6e90f713-f3c0-49a1-9d9b-f7d191.projects.builder.codes',
    'https://8bebb54ab3d44baeb4e44f37f83d2d59-6e90f713-f3c0-49a1-9d9b-f7d191.fly.dev',
    'https://d7785e50bec84d6e8673e79224c31363-2035ed20-26bd-4b51-a00b-3ee307.projects.builder.codes',
    'https://d7785e50bec84d6e8673e79224c31363-2035ed20-26bd-4b51-a00b-3ee307.fly.dev'
  ],
}

export default nextConfig

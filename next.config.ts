import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  images: {
    qualities: [100],
  },
  pageExtensions: ['page.tsx', 'api.ts', 'api.tsx'],
}

export default nextConfig

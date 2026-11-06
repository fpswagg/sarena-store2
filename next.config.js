/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [{ protocol: 'https', hostname: '**' }],
  },
  experimental: {
    serverActions: {
      // Photos sent from the dashboard (6 MB, in base64).
      bodySizeLimit: '8mb',
    },
  },
}

export default nextConfig

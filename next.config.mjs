/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  // Match your exact GitHub repository name (case-sensitive)
  basePath: '/MobxDev',
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: process.env.NODE_ENV === 'production' ? '/kaameo.github.io' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/kaameo.github.io' : '',
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  transpilePackages: ['next-mdx-remote'],
}

module.exports = nextConfig
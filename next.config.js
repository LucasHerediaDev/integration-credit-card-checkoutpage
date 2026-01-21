/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    output: 'standalone', // Importante para Docker
    poweredByHeader: false,
    compress: true,
  }
  
  module.exports = nextConfig
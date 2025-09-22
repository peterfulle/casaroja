import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configuración para export estático
  output: 'export',
  trailingSlash: true,
  skipTrailingSlashRedirect: true,
  
  // Configuración de imágenes para export estático
  images: {
    unoptimized: true
  },
  
  // Configuración para producción
  assetPrefix: process.env.NODE_ENV === 'production' ? '/static' : '',
  
  // Saltear lint errors en build de producción
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Saltear TypeScript errors en build de producción
  typescript: {
    ignoreBuildErrors: true,
  },
  
  // Next.js 13+ con App Router busca automáticamente en src/app
};

export default nextConfig;

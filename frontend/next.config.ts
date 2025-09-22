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
  
  // Next.js 13+ con App Router busca automáticamente en src/app
};

export default nextConfig;

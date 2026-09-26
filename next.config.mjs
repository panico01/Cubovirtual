/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  // gera pasta/index.html por rota: o nginx do container serve /portfolio/x sem precisar de regra extra
  trailingSlash: true,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
import type { NextConfig } from "next";

const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://127.0.0.1:5000/:path*', // Proxy to Flask
      },
    ]
  },
};

export default nextConfig;

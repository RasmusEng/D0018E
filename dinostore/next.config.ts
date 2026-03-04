import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        // Capture everything after /api/
        source: '/api/:path*',
        // Pass it to Flask INCLUDING the /api/ prefix
        destination: 'http://127.0.0.1:5000/:path*', 
      },
    ]
  },
};

export default nextConfig;
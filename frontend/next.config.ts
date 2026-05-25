import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,
  async rewrites() {
    return [
      {
        source: "/Finance-Learning/:path*",
        destination: "https://cyhkbl.github.io/Finance-Learning/:path*",
      },
      {
        source: "/CS-Learning/:path*",
        destination: "https://cyhkbl.github.io/CS-Learning/:path*",
      },
      {
        source: "/Life/:path*",
        destination: "https://cyhkbl.github.io/Life/:path*",
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.jsdelivr.net",
      },
    ],
  },
};

export default nextConfig;

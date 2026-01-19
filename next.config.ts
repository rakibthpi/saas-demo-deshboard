import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    // @ts-ignore-next-line
    appDir: true, 
  } as any,
  // @ts-ignore-next-line
  swcMinify: true, 
};

export default nextConfig;

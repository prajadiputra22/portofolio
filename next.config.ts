import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    inlineCss: true,
  },
  images: {
  formats: ["image/avif", "image/webp"],
  minimumCacheTTL: 60 * 60 * 24 * 365,
  remotePatterns: [
    { protocol: "https", hostname: "*.supabase.co", pathname: "/storage/v1/object/public/**" },
  ],
},
async headers() {
  return [
    {
      source: "/pictures/:path*",
      headers: [{ key: "Cache-Control", value: "public, max-age=2592000" }],
    },
  ];
},
};

export default nextConfig;
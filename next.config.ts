import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/glm-vs-gemini",
        destination: "/glm-vs-gemini/index.html",
      },
      {
        source: "/strategy",
        destination: "/strategy/index.html",
      },
    ];
  },
};

export default nextConfig;

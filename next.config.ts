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
      {
        source: "/gemini-with-claude",
        destination: "/gemini-with-claude/index.html",
      },
      {
        source: "/gemini-enterprise-gtm",
        destination: "/gemini-enterprise-gtm/index.html",
      },
    ];
  },
};

export default nextConfig;

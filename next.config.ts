import type { NextConfig } from "next";

// Detect if running in GitHub Actions
const isGitHubActions = process.env.GITHUB_ACTIONS === "true";

const nextConfig: NextConfig = {
  basePath: isGitHubActions ? "/game-compatibility" : "",
  output: "export", // Enable static export for GitHub Pages
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;

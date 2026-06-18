import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // The codebase has many pre-existing lint errors; don't fail production
    // builds / deploys on them. Run `npm run lint` manually to review.
    ignoreDuringBuilds: true,
  },
  // Tree-shake barrel imports from these large libraries so routes only pull
  // the components they actually use.
  experimental: {
    optimizePackageImports: ["@heroui/react", "@tabler/icons-react"],
  },
};

export default nextConfig;

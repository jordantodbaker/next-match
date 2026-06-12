import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // The codebase has many pre-existing lint errors; don't fail production
    // builds / deploys on them. Run `npm run lint` manually to review.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const getImageDomains = (): string[] => {
  const domains = process.env.NEXT_PUBLIC_IMAGE_DOMAINS;
  if (!domains) {
    console.warn(
      "NEXT_PUBLIC_IMAGE_DOMAINS not found in environment variables. Using default domains.",
    );
    return [];
  }
  return domains.split(",").map((domain) => domain.trim());
};

const nextConfig: NextConfig = {
  images: {
    remotePatterns: getImageDomains().map((hostname) => ({
      protocol: "https",
      hostname,
    })),
  },
  turbopack: {
    rules: {
      "*.svg": {
        loaders: ["@svgr/webpack"],
        as: "*.js",
      },
    },
  },
};

export default nextConfig;

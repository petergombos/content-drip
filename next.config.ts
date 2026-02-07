import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Ensure Markdown content-pack files are included in serverless output file tracing
  // so runtime readFileSync() calls work on Vercel.
  outputFileTracingIncludes: {
    "/*": ["./src/content-packs/**/*"],
  },

  // When running E2E tests, use a separate build directory to avoid conflicts
  // with the main dev server.
  ...(process.env.E2E_TEST === "true" && {
    distDir: ".next-test",
  }),
};

export default nextConfig;

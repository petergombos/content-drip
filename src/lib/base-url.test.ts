import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { resolveBaseUrl } from "./base-url";

describe("resolveBaseUrl", () => {
  const ENV_KEYS = [
    "VERCEL_ENV",
    "VERCEL_PROJECT_PRODUCTION_URL",
    "VERCEL_URL",
    "VERCEL_BRANCH_URL",
    "APP_BASE_URL",
  ];

  let savedEnv: Record<string, string | undefined>;

  beforeEach(() => {
    savedEnv = {};
    for (const key of ENV_KEYS) {
      savedEnv[key] = process.env[key];
      delete process.env[key];
    }
  });

  afterEach(() => {
    for (const key of ENV_KEYS) {
      if (savedEnv[key] !== undefined) {
        process.env[key] = savedEnv[key];
      } else {
        delete process.env[key];
      }
    }
  });

  // ── Explicit URL ──

  it("returns explicit URL as-is", () => {
    expect(resolveBaseUrl("https://my-site.com")).toBe("https://my-site.com");
  });

  it("strips trailing slash from explicit URL", () => {
    expect(resolveBaseUrl("https://my-site.com/")).toBe("https://my-site.com");
  });

  it("ignores explicit URL containing $VERCEL_URL (uninterpolated)", () => {
    process.env.APP_BASE_URL = "https://fallback.com";
    expect(resolveBaseUrl("https://$VERCEL_URL")).toBe("https://fallback.com");
  });

  it("ignores explicit URL containing ${VERCEL_URL} (uninterpolated)", () => {
    expect(resolveBaseUrl("https://${VERCEL_URL}")).toBe(
      "http://localhost:3000"
    );
  });

  // ── Production environment ──

  it("uses VERCEL_PROJECT_PRODUCTION_URL in production", () => {
    process.env.VERCEL_ENV = "production";
    process.env.VERCEL_PROJECT_PRODUCTION_URL = "my-app.vercel.app";

    expect(resolveBaseUrl()).toBe("https://my-app.vercel.app");
  });

  it("falls through to VERCEL_URL if production but no production URL", () => {
    process.env.VERCEL_ENV = "production";
    process.env.VERCEL_URL = "my-app-abc123.vercel.app";

    expect(resolveBaseUrl()).toBe("https://my-app-abc123.vercel.app");
  });

  // ── Preview/development environment ──

  it("uses VERCEL_URL in preview environment", () => {
    process.env.VERCEL_ENV = "preview";
    process.env.VERCEL_URL = "my-app-pr-42.vercel.app";
    process.env.VERCEL_PROJECT_PRODUCTION_URL = "my-app.vercel.app";

    expect(resolveBaseUrl()).toBe("https://my-app-pr-42.vercel.app");
  });

  it("uses VERCEL_BRANCH_URL as fallback", () => {
    process.env.VERCEL_ENV = "preview";
    process.env.VERCEL_BRANCH_URL = "my-app-git-feat.vercel.app";

    expect(resolveBaseUrl()).toBe("https://my-app-git-feat.vercel.app");
  });

  // ── APP_BASE_URL fallback ──

  it("uses APP_BASE_URL when no Vercel env vars", () => {
    process.env.APP_BASE_URL = "https://custom-domain.com/";

    expect(resolveBaseUrl()).toBe("https://custom-domain.com");
  });

  // ── Default ──

  it("returns localhost:3000 when no env vars set", () => {
    expect(resolveBaseUrl()).toBe("http://localhost:3000");
  });
});

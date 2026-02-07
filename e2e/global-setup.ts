import { execSync } from "child_process";
import { existsSync, unlinkSync, readFileSync } from "fs";
import { resolve } from "path";
import { config } from "dotenv";

const ROOT = resolve(__dirname, "..");

/**
 * Playwright global setup:
 * 1. Load .env.test
 * 2. Remove stale test DB if it exists
 * 3. Push schema to the local SQLite test database
 * 4. Clear any leftover test emails
 */
async function globalSetup() {
  // Load test env vars
  const envTestPath = resolve(ROOT, ".env.test");
  const envConfig = config({ path: envTestPath });

  const testDbFile = resolve(ROOT, "e2e-test.db");

  // Remove stale test DB
  if (existsSync(testDbFile)) {
    unlinkSync(testDbFile);
  }

  // Also clean up the test emails file
  const testEmailsFile = resolve(ROOT, ".test-emails.json");
  if (existsSync(testEmailsFile)) {
    unlinkSync(testEmailsFile);
  }

  // Push schema to local SQLite file using drizzle-kit
  // The env vars from .env.test override .env values since dotenv doesn't override existing vars
  console.log("[e2e setup] Pushing schema to test database...");
  try {
    execSync("npx drizzle-kit push --force", {
      cwd: ROOT,
      env: {
        ...process.env,
        ...envConfig.parsed,
      },
      stdio: "pipe",
    });
    console.log("[e2e setup] Schema pushed successfully.");
  } catch (error: unknown) {
    // drizzle-kit push might not support --force; try without
    try {
      execSync("echo 'yes' | npx drizzle-kit push", {
        cwd: ROOT,
        env: {
          ...process.env,
          ...envConfig.parsed,
        },
        stdio: "pipe",
        shell: "/bin/bash",
      });
      console.log("[e2e setup] Schema pushed successfully (with auto-confirm).");
    } catch (innerError: unknown) {
      console.error(
        "[e2e setup] Failed to push schema:",
        innerError instanceof Error ? innerError.message : innerError
      );
      throw innerError;
    }
  }
}

export default globalSetup;

import { existsSync, unlinkSync } from "fs";
import { resolve } from "path";

const ROOT = resolve(__dirname, "..");

/**
 * Playwright global teardown:
 * Clean up test artifacts.
 */
async function globalTeardown() {
  const testDbFile = resolve(ROOT, "e2e-test.db");
  const testEmailsFile = resolve(ROOT, ".test-emails.json");

  if (existsSync(testDbFile)) {
    unlinkSync(testDbFile);
  }
  if (existsSync(testEmailsFile)) {
    unlinkSync(testEmailsFile);
  }

  console.log("[e2e teardown] Cleaned up test artifacts.");
}

export default globalTeardown;

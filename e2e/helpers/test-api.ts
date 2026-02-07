import type { APIRequestContext } from "@playwright/test";

const BASE_URL = process.env.E2E_BASE_URL || `http://localhost:${process.env.E2E_PORT ?? "3099"}`;
const CRON_SECRET = "test-cron-secret";

export interface CapturedEmail {
  id: string;
  to: string;
  subject: string;
  html: string;
  text?: string;
  tag?: string;
  headers?: Record<string, string>;
  sentAt: string;
}

// ---------------------------------------------------------------------------
// Test email API helpers
// ---------------------------------------------------------------------------

/**
 * Fetch captured test emails, optionally filtered.
 */
export async function getEmails(
  request: APIRequestContext,
  filters?: { to?: string; subject?: string; tag?: string; after?: string }
): Promise<CapturedEmail[]> {
  const params = new URLSearchParams();
  if (filters?.to) params.set("to", filters.to);
  if (filters?.subject) params.set("subject", filters.subject);
  if (filters?.tag) params.set("tag", filters.tag);
  if (filters?.after) params.set("after", filters.after);

  const res = await request.get(
    `${BASE_URL}/api/test/emails?${params.toString()}`
  );
  const data = await res.json();
  return data.emails;
}

/**
 * Wait for an email matching the filter to appear (polls with retries).
 */
export async function waitForEmail(
  request: APIRequestContext,
  filters: { to?: string; subject?: string; tag?: string },
  options?: { timeout?: number; interval?: number }
): Promise<CapturedEmail> {
  const timeout = options?.timeout ?? 15_000;
  const interval = options?.interval ?? 500;
  const start = Date.now();

  while (Date.now() - start < timeout) {
    const emails = await getEmails(request, filters);
    if (emails.length > 0) {
      return emails[emails.length - 1]; // Return the most recent match
    }
    await new Promise((r) => setTimeout(r, interval));
  }

  throw new Error(
    `Timed out waiting for email matching ${JSON.stringify(filters)} after ${timeout}ms`
  );
}

/**
 * Clear all captured test emails.
 */
export async function clearEmails(
  request: APIRequestContext
): Promise<void> {
  await request.delete(`${BASE_URL}/api/test/emails`);
}

// ---------------------------------------------------------------------------
// Cron trigger
// ---------------------------------------------------------------------------

/**
 * Trigger the cron job to send due emails.
 */
export async function triggerCron(
  request: APIRequestContext
): Promise<{ sent: number; errors: number }> {
  const res = await request.get(`${BASE_URL}/api/cron`, {
    headers: { Authorization: `Bearer ${CRON_SECRET}` },
  });
  const data = await res.json();
  return { sent: data.sent ?? 0, errors: data.errors ?? 0 };
}

// ---------------------------------------------------------------------------
// Fast-forward time for a subscription
// ---------------------------------------------------------------------------

/**
 * Backdate a subscription so the scheduler considers it due.
 */
export async function fastForward(
  request: APIRequestContext,
  subscriptionId: string,
  minutesBack = 10
): Promise<void> {
  await request.post(`${BASE_URL}/api/test/fast-forward`, {
    data: { subscriptionId, minutesBack },
  });
}

// ---------------------------------------------------------------------------
// Cleanup
// ---------------------------------------------------------------------------

/**
 * Clean up all test data.
 */
export async function cleanup(
  request: APIRequestContext,
  emailPattern?: string
): Promise<void> {
  await request.post(`${BASE_URL}/api/test/cleanup`, {
    data: { emailPattern },
  });
}

// ---------------------------------------------------------------------------
// Subscribe via API (faster than UI for setup-heavy tests)
// ---------------------------------------------------------------------------

/**
 * Create a subscription directly via the API (bypasses the UI form).
 * Returns the subscriptionId.
 */
export async function subscribeViaApi(
  request: APIRequestContext,
  data: {
    email: string;
    packKey?: string;
    timezone?: string;
    cronExpression?: string;
  }
): Promise<string> {
  const res = await request.post(`${BASE_URL}/api/subscribe`, {
    headers: { Authorization: `Bearer ${CRON_SECRET}` },
    data: {
      email: data.email,
      packKey: data.packKey ?? "dummy",
      timezone: data.timezone ?? "UTC",
      cronExpression: data.cronExpression ?? "0 8 * * *",
    },
  });
  const json = await res.json();
  if (!json.success) {
    throw new Error(`Subscribe API failed: ${JSON.stringify(json)}`);
  }
  return json.subscriptionId;
}

// ---------------------------------------------------------------------------
// Email parsing helpers
// ---------------------------------------------------------------------------

/**
 * Decode common HTML entities in URLs.
 */
function decodeHtmlEntities(str: string): string {
  return str
    .replace(/&amp;/g, "&")
    .replace(/&#x26;/g, "&")
    .replace(/&#38;/g, "&")
    .replace(/&#x3D;/g, "=")
    .replace(/&#61;/g, "=")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"');
}

/**
 * Extract all href links from HTML email content.
 */
export function extractHrefLinks(html: string): string[] {
  const hrefRegex = /href="([^"]+)"/g;
  const links: string[] = [];
  let match;
  while ((match = hrefRegex.exec(html)) !== null) {
    links.push(decodeHtmlEntities(match[1]));
  }
  return links;
}

/**
 * Extract all URLs from HTML content (both href and plain text).
 */
export function extractAllUrls(html: string): string[] {
  const urls = new Set<string>();

  // Extract from href attributes
  for (const link of extractHrefLinks(html)) {
    urls.add(link);
  }

  // Extract bare URLs from text (handles URLs in plain text, outside tags)
  const urlRegex = /https?:\/\/[^\s<>"')\]]+/g;
  let match;
  while ((match = urlRegex.exec(html)) !== null) {
    urls.add(decodeHtmlEntities(match[0]));
  }

  return Array.from(urls);
}

/**
 * Extract a specific URL from email HTML using a pattern.
 * Searches both href attributes and plain text URLs.
 */
export function extractLink(
  html: string,
  pattern: string | RegExp
): string | undefined {
  const urls = extractAllUrls(html);
  if (typeof pattern === "string") {
    return urls.find((u) => u.includes(pattern));
  }
  return urls.find((u) => pattern.test(u));
}

/**
 * Extract the confirmation URL from a confirmation email.
 */
export function extractConfirmUrl(html: string): string | undefined {
  return extractLink(html, "/confirm/");
}

/**
 * Extract the manage URL from an email.
 */
export function extractManageUrl(html: string): string | undefined {
  return extractLink(html, "/manage/");
}

/**
 * Extract the pause URL from an email.
 */
export function extractPauseUrl(html: string): string | undefined {
  return extractLink(html, "/api/pause");
}

/**
 * Extract the stop/unsubscribe URL from an email.
 */
export function extractStopUrl(html: string): string | undefined {
  return extractLink(html, "/api/stop");
}

/**
 * Extract the companion page URL from an email.
 */
export function extractCompanionUrl(html: string): string | undefined {
  return extractLink(html, /\/p\/[^/]+\/[a-z0-9-]+/);
}

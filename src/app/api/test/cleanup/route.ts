import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { subscriptions, tokens, sendLog } from "@/db/subscription-schema";
import { like, eq } from "drizzle-orm";
import { clearTestEmails } from "@/domains/mail/adapters/test/test-adapter";

/**
 * POST /api/test/cleanup
 * Cleans up test data. If email pattern is provided, only deletes matching subscriptions.
 * Also clears captured test emails.
 *
 * Body: { emailPattern?: string } (e.g., "%@e2e.test")
 */
export async function POST(request: NextRequest) {
  if (process.env.E2E_TEST !== "true") {
    return NextResponse.json(
      { error: "Test endpoints are only available when E2E_TEST=true" },
      { status: 403 }
    );
  }

  const body = await request.json().catch(() => ({}));
  const emailPattern = body?.emailPattern;

  if (emailPattern) {
    // Find matching subscriptions
    const subs = await db.query.subscriptions.findMany({
      where: like(subscriptions.email, emailPattern),
    });

    for (const sub of subs) {
      // Cascade delete handles tokens and send_log
      await db.delete(subscriptions).where(eq(subscriptions.id, sub.id));
    }
  } else {
    // Delete all data (for test DB only!)
    await db.delete(sendLog);
    await db.delete(tokens);
    await db.delete(subscriptions);
  }

  // Clear captured emails
  clearTestEmails();

  return NextResponse.json({ success: true });
}

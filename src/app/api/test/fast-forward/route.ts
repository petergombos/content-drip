import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { subscriptions, sendLog } from "@/db/subscription-schema";
import { eq } from "drizzle-orm";

/**
 * POST /api/test/fast-forward
 * Backdates the subscription's updatedAt and all send_log sentAt entries
 * so the scheduler considers the subscription "due" on the next cron tick.
 *
 * Body: { subscriptionId: string, minutesBack?: number }
 */
export async function POST(request: NextRequest) {
  if (process.env.E2E_TEST !== "true") {
    return NextResponse.json(
      { error: "Test endpoints are only available when E2E_TEST=true" },
      { status: 403 }
    );
  }

  const body = await request.json().catch(() => null);
  if (!body?.subscriptionId) {
    return NextResponse.json(
      { error: "subscriptionId is required" },
      { status: 400 }
    );
  }

  const minutesBack = body.minutesBack ?? 10;
  const pastDate = new Date(Date.now() - minutesBack * 60 * 1000);

  // Backdate the subscription's updatedAt
  await db
    .update(subscriptions)
    .set({ updatedAt: pastDate })
    .where(eq(subscriptions.id, body.subscriptionId));

  // Backdate all send_log entries for this subscription
  await db
    .update(sendLog)
    .set({ sentAt: pastDate })
    .where(eq(sendLog.subscriptionId, body.subscriptionId));

  return NextResponse.json({
    success: true,
    backdatedTo: pastDate.toISOString(),
  });
}

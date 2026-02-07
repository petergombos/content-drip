import { NextRequest, NextResponse } from "next/server";
import {
  getTestEmails,
  clearTestEmails,
} from "@/domains/mail/adapters/test/test-adapter";

function guardTestMode() {
  if (process.env.E2E_TEST !== "true") {
    return NextResponse.json(
      { error: "Test endpoints are only available when E2E_TEST=true" },
      { status: 403 }
    );
  }
  return null;
}

/**
 * GET /api/test/emails
 * Returns captured test emails. Supports filtering:
 *   ?to=email@example.com   - filter by recipient
 *   ?subject=Welcome        - filter by subject (contains, case-insensitive)
 *   ?tag=confirm-dummy      - filter by tag
 *   ?after=<ISO timestamp>  - only emails sent after this time
 */
export async function GET(request: NextRequest) {
  const blocked = guardTestMode();
  if (blocked) return blocked;

  const url = new URL(request.url);
  const filterTo = url.searchParams.get("to");
  const filterSubject = url.searchParams.get("subject");
  const filterTag = url.searchParams.get("tag");
  const filterAfter = url.searchParams.get("after");

  let emails = getTestEmails();

  if (filterTo) {
    emails = emails.filter((e) => e.to === filterTo);
  }
  if (filterSubject) {
    const needle = filterSubject.toLowerCase();
    emails = emails.filter((e) => e.subject.toLowerCase().includes(needle));
  }
  if (filterTag) {
    emails = emails.filter((e) => e.tag === filterTag);
  }
  if (filterAfter) {
    const afterTime = new Date(filterAfter).getTime();
    emails = emails.filter((e) => new Date(e.sentAt).getTime() > afterTime);
  }

  return NextResponse.json({ emails, total: emails.length });
}

/**
 * DELETE /api/test/emails
 * Clears all captured test emails.
 */
export async function DELETE() {
  const blocked = guardTestMode();
  if (blocked) return blocked;

  clearTestEmails();
  return NextResponse.json({ success: true });
}

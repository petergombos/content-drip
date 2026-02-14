import { NextRequest, NextResponse } from "next/server";
import { pauseFromEmailAction, stopFromEmailAction } from "@/domains/subscriptions/actions/subscription-actions";
import { EmailService } from "@/domains/mail/services/email-service";
import { createMailAdapter } from "@/domains/mail/create-adapter";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const token = searchParams.get("token");
  const id = searchParams.get("id");
  const action = searchParams.get("action"); // optional legacy support

  if (!token || !id) {
    return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
  }

  try {
    if (!action || action === "pause") {
      const result = await pauseFromEmailAction({ subscriptionId: id, token });
      if (result?.serverError) {
        return NextResponse.json({ error: result.serverError }, { status: 400 });
      }
    } else if (action === "stop") {
      const result = await stopFromEmailAction({ subscriptionId: id, token });
      if (result?.serverError) {
        return NextResponse.json({ error: result.serverError }, { status: 400 });
      }
    } else {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    // Create a manage token so the user lands on an authenticated manage page
    const emailService = new EmailService(
      createMailAdapter(),
      process.env.APP_BASE_URL || "http://localhost:3000"
    );
    const { token: manageToken } = await emailService.createToken(id, "MANAGE");
    const actionParam = !action || action === "pause" ? "paused" : "unsubscribed";
    return NextResponse.redirect(
      new URL(`/manage/${manageToken}?action=${actionParam}`, request.url)
    );
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "An error occurred" },
      { status: 500 }
    );
  }
}

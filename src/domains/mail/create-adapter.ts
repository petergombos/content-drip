import type { MailAdapter } from "./ports/mail-adapter";
import { PostmarkAdapter } from "./adapters/postmark/postmark-adapter";
import { TestMailAdapter } from "./adapters/test/test-adapter";

/**
 * Create the appropriate mail adapter based on environment.
 * When E2E_TEST=true, returns a TestMailAdapter that captures emails to a file.
 * Otherwise, returns the real PostmarkAdapter.
 */
export function createMailAdapter(config?: {
  serverToken?: string;
  fromEmail?: string;
  messageStream?: string;
}): MailAdapter {
  if (process.env.E2E_TEST === "true") {
    return new TestMailAdapter();
  }

  return new PostmarkAdapter({
    serverToken: config?.serverToken || process.env.POSTMARK_SERVER_TOKEN!,
    fromEmail: config?.fromEmail || process.env.MAIL_FROM!,
    messageStream: config?.messageStream || process.env.POSTMARK_MESSAGE_STREAM,
  });
}

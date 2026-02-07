import { writeFileSync, readFileSync, existsSync } from "fs";
import { join } from "path";
import type { MailAdapter } from "../../ports/mail-adapter";

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

const EMAILS_FILE = join(process.cwd(), ".test-emails.json");

function readEmails(): CapturedEmail[] {
  if (!existsSync(EMAILS_FILE)) return [];
  try {
    return JSON.parse(readFileSync(EMAILS_FILE, "utf-8"));
  } catch {
    return [];
  }
}

function writeEmails(emails: CapturedEmail[]): void {
  writeFileSync(EMAILS_FILE, JSON.stringify(emails, null, 2));
}

export function getTestEmails(): CapturedEmail[] {
  return readEmails();
}

export function clearTestEmails(): void {
  writeEmails([]);
}

export class TestMailAdapter implements MailAdapter {
  async send(options: {
    to: string;
    subject: string;
    html: string;
    text?: string;
    tag?: string;
    headers?: Record<string, string>;
  }): Promise<{ providerMessageId?: string }> {
    const emails = readEmails();
    const id = `test-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

    emails.push({
      id,
      to: options.to,
      subject: options.subject,
      html: options.html,
      text: options.text,
      tag: options.tag,
      headers: options.headers,
      sentAt: new Date().toISOString(),
    });

    writeEmails(emails);

    return { providerMessageId: id };
  }
}

"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { SendIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface EmailData {
  subject: string;
  preview: string;
  html: string;
}

type EmailSelection =
  | { kind: "email"; pack: string; step: string }
  | { kind: "system"; name: string };

export function EmailPreview({ data }: { data: EmailData }) {
  return (
    <iframe
      srcDoc={data.html}
      className="inset-0 h-full w-full bg-white"
      sandbox="allow-same-origin"
      title="Email preview"
    />
  );
}

export function EmailTopBarInfo({ data }: { data: EmailData }) {
  return (
    <div className="flex items-baseline gap-3 overflow-hidden">
      <p className="truncate text-sm font-medium">{data.subject}</p>
      {data.preview && (
        <p className="hidden truncate text-xs text-muted-foreground md:block">
          {data.preview}
        </p>
      )}
    </div>
  );
}

export function EmailSendAction({
  selection,
}: {
  selection: EmailSelection;
}) {
  const [sendOpen, setSendOpen] = useState(false);
  const [sendEmail, setSendEmail] = useState("");
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!sendEmail) return;
    setSending(true);
    try {
      const body =
        selection.kind === "email"
          ? { email: sendEmail, pack: selection.pack, step: selection.step }
          : { email: sendEmail, system: selection.name };
      const res = await fetch("/content-preview/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        toast.success(`Sent to ${sendEmail}`);
        setSendOpen(false);
      } else {
        const err = await res.json();
        toast.error(err.error ?? "Send failed");
      }
    } catch (err) {
      toast.error(`Send failed: ${err}`);
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <Button
        size="sm"
        variant="outline"
        onClick={() => setSendOpen(true)}
        className="shrink-0"
      >
        <SendIcon />
        Send Test
      </Button>

      <Dialog open={sendOpen} onOpenChange={setSendOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Test Email</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-3 py-2">
            <Input
              type="email"
              placeholder="recipient@example.com"
              value={sendEmail}
              onChange={(e) => setSendEmail(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSend();
              }}
            />
          </div>
          <DialogFooter>
            <Button onClick={handleSend} disabled={sending || !sendEmail}>
              {sending ? "Sending..." : "Send"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

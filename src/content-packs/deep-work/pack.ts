import type { ContentPack } from "@/content-packs/registry";
import { registerPack } from "@/content-packs/registry";
import { DeepWorkEmailShell } from "@/content-packs/deep-work/email-shell";

const pack: ContentPack = {
  key: "deep-work",
  name: "Deep Work Essentials",
  description:
    "A free 2-day email course on mastering deep work.",
  steps: [
    { slug: "welcome", emailFile: "welcome.md" },
    { slug: "day-1", emailFile: "day-1.md" },
  ],
  EmailShell: DeepWorkEmailShell,
};

registerPack(pack);

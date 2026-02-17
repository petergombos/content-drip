import { notFound } from "next/navigation";
import { getAllPacks } from "@/content-packs/registry";
import "@/content-packs";
import { ContentPreviewer } from "./content-previewer";
import { existsSync } from "fs";
import { join } from "path";

export default function ContentPreviewPage() {
  if (process.env.VERCEL_ENV === "production") {
    notFound();
  }

  const packs = getAllPacks().map((p) => ({
    key: p.key,
    name: p.name,
    steps: p.steps.map((s) => ({
      slug: s.slug,
      hasPage: existsSync(
        join(
          process.cwd(),
          "src/content-packs",
          p.key,
          "pages",
          s.pageFile ?? s.emailFile
        )
      ),
    })),
  }));

  const systemDir = join(process.cwd(), "src/emails");
  const systemEmails: string[] = [];
  for (const name of ["confirm", "manage-link"]) {
    if (existsSync(join(systemDir, `${name}.md`))) {
      systemEmails.push(name);
    }
  }

  return <ContentPreviewer packs={packs} systemEmails={systemEmails} />;
}

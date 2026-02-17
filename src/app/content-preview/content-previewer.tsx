"use client";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Separator } from "@/components/ui/separator";
import { ChevronRightIcon, EyeIcon, FileTextIcon, MailIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Toaster, toast } from "sonner";
import { EmailPreview, EmailTopBarInfo, EmailSendAction } from "./email-preview";
import { PagePreview, PageTopBarInfo, PageMetaAction } from "./page-preview";

interface PackStep {
  slug: string;
  hasPage: boolean;
}

interface Pack {
  key: string;
  name: string;
  steps: PackStep[];
}

interface ContentPreviewerProps {
  packs: Pack[];
  systemEmails: string[];
}

type Selection =
  | { kind: "email"; pack: string; step: string }
  | { kind: "page"; pack: string; step: string }
  | { kind: "system"; name: string };

type RenderResult =
  | { kind: "email"; subject: string; preview: string; html: string }
  | { kind: "page"; frontmatter: Record<string, unknown>; html: string };

function selectionKey(sel: Selection): string {
  if (sel.kind === "system") return `system:${sel.name}`;
  return `${sel.kind}:${sel.pack}:${sel.step}`;
}

export function ContentPreviewer({
  packs,
  systemEmails,
}: ContentPreviewerProps) {
  const [selected, setSelected] = useState<Selection | null>(null);
  const [data, setData] = useState<RenderResult | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchPreview = useCallback(async (sel: Selection) => {
    setLoading(true);
    setData(null);
    const params = new URLSearchParams();
    if (sel.kind === "system") {
      params.set("system", sel.name);
    } else {
      params.set("pack", sel.pack);
      params.set("step", sel.step);
      if (sel.kind === "page") params.set("type", "page");
    }
    try {
      const res = await fetch(`/content-preview/render?${params}`);
      if (res.ok) {
        setData(await res.json());
      } else {
        const err = await res.json();
        toast.error(err.error ?? "Failed to render");
      }
    } catch (err) {
      toast.error(`Fetch failed: ${err}`);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (selected) fetchPreview(selected);
  }, [selected, fetchPreview]);

  const isActive = (sel: Selection) =>
    selected ? selectionKey(sel) === selectionKey(selected) : false;

  const selectedPackName =
    selected && selected.kind !== "system"
      ? packs.find((p) => p.key === selected.pack)?.name ?? selected.pack
      : "";
  const selectedStepSlug =
    selected && selected.kind !== "system" ? selected.step : "";

  return (
    <TooltipProvider>
      <SidebarProvider>
        <Toaster richColors />
        <Sidebar>
          <SidebarHeader>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton size="lg" className="pointer-events-none">
                  <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                    <EyeIcon className="size-4" />
                  </div>
                  <div className="flex flex-col gap-0.5 leading-none">
                    <span className="font-semibold">Content Previewer</span>
                    <span className="text-xs text-sidebar-foreground/60">
                      Dev tools
                    </span>
                  </div>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarHeader>
          <SidebarContent>
            {packs.map((pack, i) => (
              <Collapsible
                key={pack.key}
                defaultOpen={i === 0}
                className="group/collapsible"
              >
                <SidebarGroup>
                  <SidebarGroupLabel asChild>
                    <CollapsibleTrigger>
                      {pack.name}
                      <ChevronRightIcon className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                    </CollapsibleTrigger>
                  </SidebarGroupLabel>
                  <CollapsibleContent>
                    <SidebarGroupContent>
                      <SidebarMenu>
                        {pack.steps.map((step) => (
                          <SidebarMenuItem key={`email-${step.slug}`}>
                            <SidebarMenuButton
                              isActive={isActive({
                                kind: "email",
                                pack: pack.key,
                                step: step.slug,
                              })}
                              onClick={() =>
                                setSelected({
                                  kind: "email",
                                  pack: pack.key,
                                  step: step.slug,
                                })
                              }
                            >
                              <MailIcon />
                              <span>{step.slug}</span>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        ))}
                        {pack.steps
                          .filter((s) => s.hasPage)
                          .map((step) => (
                            <SidebarMenuItem key={`page-${step.slug}`}>
                              <SidebarMenuButton
                                isActive={isActive({
                                  kind: "page",
                                  pack: pack.key,
                                  step: step.slug,
                                })}
                                onClick={() =>
                                  setSelected({
                                    kind: "page",
                                    pack: pack.key,
                                    step: step.slug,
                                  })
                                }
                              >
                                <FileTextIcon />
                                <span>{step.slug}</span>
                              </SidebarMenuButton>
                            </SidebarMenuItem>
                          ))}
                      </SidebarMenu>
                    </SidebarGroupContent>
                  </CollapsibleContent>
                </SidebarGroup>
              </Collapsible>
            ))}

            {systemEmails.length > 0 && (
              <Collapsible defaultOpen className="group/collapsible">
                <SidebarGroup>
                  <SidebarGroupLabel asChild>
                    <CollapsibleTrigger>
                      System
                      <ChevronRightIcon className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
                    </CollapsibleTrigger>
                  </SidebarGroupLabel>
                  <CollapsibleContent>
                    <SidebarGroupContent>
                      <SidebarMenu>
                        {systemEmails.map((name) => (
                          <SidebarMenuItem key={name}>
                            <SidebarMenuButton
                              isActive={isActive({ kind: "system", name })}
                              onClick={() =>
                                setSelected({ kind: "system", name })
                              }
                            >
                              <MailIcon />
                              <span>{name}</span>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        ))}
                      </SidebarMenu>
                    </SidebarGroupContent>
                  </CollapsibleContent>
                </SidebarGroup>
              </Collapsible>
            )}
          </SidebarContent>
        </Sidebar>

        <SidebarInset>
          <header className="bg-background/95 supports-backdrop-filter:bg-background/60 sticky top-0 z-10 flex h-14 shrink-0 items-center gap-2 border-b px-4 backdrop-blur">
            <SidebarTrigger />
            <Separator orientation="vertical" className="mr-2 h-full" />
            <div className="min-w-0 flex-1">
              {data?.kind === "email" ? (
                <EmailTopBarInfo data={data} />
              ) : data?.kind === "page" ? (
                <PageTopBarInfo
                  data={data}
                  packName={selectedPackName}
                  stepSlug={selectedStepSlug}
                />
              ) : (
                <p className="text-sm text-muted-foreground">
                  {loading ? "Loading..." : "Select an item to preview"}
                </p>
              )}
            </div>
            {data?.kind === "email" && selected && selected.kind !== "page" && (
              <EmailSendAction
                selection={selected as { kind: "email"; pack: string; step: string } | { kind: "system"; name: string }}
              />
            )}
            {data?.kind === "page" && (
              <PageMetaAction
                data={data}
                packName={selectedPackName}
                stepSlug={selectedStepSlug}
              />
            )}
          </header>

          <div className="flex-1">
            {data?.kind === "email" ? (
              <EmailPreview data={data} />
            ) : data?.kind === "page" ? (
              <PagePreview data={data} />
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-2 p-4 text-muted-foreground">
                <EyeIcon className="size-8 opacity-20" />
                <p className="text-sm">
                  {loading
                    ? "Rendering..."
                    : "Select an email or page to preview"}
                </p>
              </div>
            )}
          </div>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
}

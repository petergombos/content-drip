import matter from "gray-matter";
import * as production from "react/jsx-runtime";
import rehypeReact from "rehype-react";
import rehypeStringify from "rehype-stringify";
import { remark } from "remark";
import remarkRehype from "remark-rehype";

export interface MarkdownFrontmatter {
  subject?: string;
  preview?: string;
  [key: string]: unknown;
}

export interface ParsedMarkdown {
  frontmatter: MarkdownFrontmatter;
  content: string;
  html: string;
}

/**
 * Parse markdown file with frontmatter
 */
export function parseMarkdown(markdown: string): ParsedMarkdown {
  const parsed = matter(markdown);
  const frontmatter = parsed.data as MarkdownFrontmatter;

  // Convert markdown to HTML for email rendering
  // Using unified pipeline: remark -> rehype -> stringify
  const html = String(
    remark()
      .use(remarkRehype, { allowDangerousHtml: true })
      .use(rehypeStringify, { allowDangerousHtml: true })
      .processSync(parsed.content)
  );

  return {
    frontmatter,
    content: parsed.content,
    html,
  };
}

/**
 * Render markdown to HTML string (for emails)
 */
export function renderMarkdownToHtml(markdown: string): string {
  const parsed = parseMarkdown(markdown);
  return parsed.html;
}

/**
 * Render markdown to React components (for web pages)
 */
export function renderMarkdownToReact(markdown: string): React.ReactElement {
  const parsed = parseMarkdown(markdown);

  // Use unified pipeline with rehype-react
  // rehype-react v8+ requires using the production JSX runtime
  const result = remark()
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeReact, {
      ...production,
      components: {
        h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
          <h1
            className="mb-4 mt-8 font-serif text-3xl font-bold tracking-tight"
            {...props}
          />
        ),
        h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
          <h2
            className="mb-3 mt-8 font-serif text-2xl font-semibold tracking-tight"
            {...props}
          />
        ),
        h3: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
          <h3
            className="mb-2 mt-6 text-xl font-semibold tracking-tight"
            {...props}
          />
        ),
        p: (props: React.HTMLAttributes<HTMLParagraphElement>) => (
          <p className="mb-4 leading-relaxed text-foreground/80" {...props} />
        ),
        ul: (props: React.HTMLAttributes<HTMLUListElement>) => (
          <ul
            className="mb-5 list-disc space-y-1.5 pl-6 text-foreground/80"
            {...props}
          />
        ),
        ol: (props: React.HTMLAttributes<HTMLOListElement>) => (
          <ol
            className="mb-5 list-decimal space-y-1.5 pl-6 text-foreground/80"
            {...props}
          />
        ),
        li: (props: React.HTMLAttributes<HTMLLIElement>) => (
          <li className="leading-relaxed" {...props} />
        ),
        a: (props: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
          <a
            className="font-medium text-primary underline underline-offset-4 decoration-primary/40 hover:decoration-primary/80 transition-colors"
            {...props}
          />
        ),
        blockquote: (
          props: React.BlockquoteHTMLAttributes<HTMLQuoteElement>
        ) => (
          <blockquote
            className="my-6 border-l-3 border-primary/30 pl-4 italic text-muted-foreground"
            {...props}
          />
        ),
        code: (props: React.HTMLAttributes<HTMLElement>) => (
          <code
            className="rounded bg-muted px-1.5 py-0.5 font-mono text-sm"
            {...props}
          />
        ),
        pre: (props: React.HTMLAttributes<HTMLPreElement>) => (
          <pre
            className="my-4 overflow-x-auto rounded-lg bg-muted p-4"
            {...props}
          />
        ),
        img: (
          props: React.ImgHTMLAttributes<HTMLImageElement> & {
            node?: unknown;
          }
        ) => {
          const { node: _node, ...rest } = props;
          // eslint-disable-next-line @next/next/no-img-element
          return (
            <img
              className="my-5 h-auto w-full rounded-lg"
              loading="lazy"
              alt={rest.alt ?? ""}
              {...rest}
            />
          );
        },
        hr: (props: React.HTMLAttributes<HTMLHRElement>) => (
          <hr className="my-8 border-border" {...props} />
        ),
        strong: (props: React.HTMLAttributes<HTMLElement>) => (
          <strong className="font-semibold text-foreground" {...props} />
        ),
      },
    })
    .processSync(parsed.content);

  return result.result as React.ReactElement;
}

/**
 * Extract frontmatter from markdown
 */
export function extractFrontmatter(markdown: string): MarkdownFrontmatter {
  const parsed = matter(markdown);
  return parsed.data as MarkdownFrontmatter;
}

import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import type { PackEmailShellProps } from "@/content-packs/registry";

/**
 * Branded email shell for the dummy content pack.
 *
 * Each content pack can define its own email shell with custom branding
 * (header, colors, footer). This serves as a polished example.
 */
export function DummyEmailShell(props: PackEmailShellProps) {
  return (
    <Html>
      <Head>
        <style>{`
          img { max-width: 100%; height: auto; border-radius: 8px; margin: 20px 0; }
          h2 { font-size: 20px; font-weight: 700; margin: 32px 0 12px; color: #1c1917; font-family: Georgia, 'Times New Roman', serif; }
          h3 { font-size: 17px; font-weight: 600; margin: 24px 0 8px; color: #1c1917; }
          p { margin: 0 0 16px; line-height: 28px; color: #44403c; }
          blockquote { border-left: 3px solid #d97706; padding-left: 16px; margin: 20px 0; color: #57534e; font-style: italic; }
          a { color: #b45309; }
          ul, ol { padding-left: 24px; margin: 0 0 16px; }
          li { margin-bottom: 8px; line-height: 26px; color: #44403c; }
          hr { border: none; border-top: 1px solid #e7e5e4; margin: 28px 0; }
          strong { color: #1c1917; }
        `}</style>
      </Head>
      {props.preview ? <Preview>{props.preview}</Preview> : null}
      <Body style={styles.body}>
        <Container style={styles.container}>
          {/* ── Header ── */}
          <Section style={styles.header}>
            <Text style={styles.headerTitle}>
              The Art of Mindful Productivity
            </Text>
          </Section>

          {/* ── Content ── */}
          <Section style={styles.main}>
            <Heading style={styles.h1}>{props.title}</Heading>
            <Section style={styles.content}>{props.children}</Section>
          </Section>

          {/* ── Footer ── */}
          <Section style={styles.footer}>
            <Hr style={styles.hr} />
            <Text style={styles.footerBrand}>
              The Art of Mindful Productivity&ensp;·&ensp;A free 5-day email
              course
            </Text>
            <Text style={styles.footerLinks}>
              {props.footer?.manageUrl ? (
                <>
                  <Link
                    href={props.footer.manageUrl}
                    style={styles.footerLink}
                  >
                    Manage preferences
                  </Link>
                  {props.footer?.unsubscribeUrl ? (
                    <span style={styles.footerDivider}>&ensp;·&ensp;</span>
                  ) : null}
                </>
              ) : null}
              {props.footer?.unsubscribeUrl ? (
                <Link
                  href={props.footer.unsubscribeUrl}
                  style={styles.footerLink}
                >
                  Unsubscribe
                </Link>
              ) : null}
            </Text>
            <Text style={styles.footerNote}>
              You&apos;re receiving this because you signed up for our free email
              course.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

/* ── Inline styles (required for email compatibility) ── */

const styles: Record<string, React.CSSProperties> = {
  body: {
    backgroundColor: "#fafaf9",
    fontFamily: "Georgia, 'Times New Roman', serif",
    margin: 0,
    padding: "32px 0",
    color: "#1c1917",
  },
  container: {
    margin: "0 auto",
    maxWidth: 560,
    backgroundColor: "#ffffff",
    border: "1px solid #e7e5e4",
  },
  /* Header bar */
  header: {
    backgroundColor: "#fffbeb",
    borderBottom: "3px solid #d97706",
    padding: "20px 32px",
    textAlign: "center" as const,
  },
  headerTitle: {
    margin: 0,
    fontSize: 13,
    fontWeight: 600,
    letterSpacing: "0.1em",
    textTransform: "uppercase" as const,
    color: "#78350f",
    fontFamily: "Georgia, 'Times New Roman', serif",
  },
  /* Main content area */
  main: {
    padding: "32px 32px 8px",
  },
  h1: {
    fontSize: 26,
    lineHeight: "34px",
    fontWeight: 700,
    margin: "0 0 20px",
    color: "#1c1917",
    fontFamily: "Georgia, 'Times New Roman', serif",
  },
  content: {
    fontSize: 16,
    lineHeight: "28px",
    color: "#44403c",
  },
  /* Footer */
  footer: {
    padding: "0 32px 32px",
  },
  hr: {
    borderColor: "#e7e5e4",
    margin: "8px 0 20px",
  },
  footerBrand: {
    margin: "0 0 8px",
    fontSize: 12,
    fontWeight: 600,
    color: "#92400e",
    textAlign: "center" as const,
    fontFamily: "Georgia, 'Times New Roman', serif",
  },
  footerLinks: {
    margin: "0 0 10px",
    fontSize: 12,
    color: "#78716c",
    textAlign: "center" as const,
  },
  footerLink: {
    color: "#78716c",
    textDecoration: "underline",
  },
  footerDivider: {
    color: "#d6d3d1",
  },
  footerNote: {
    margin: 0,
    fontSize: 11,
    color: "#a8a29e",
    textAlign: "center" as const,
  },
};

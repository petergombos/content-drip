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

export function EmailShell(props: {
  preview?: string;
  title: string;
  children: React.ReactNode;
  footer?: { unsubscribeUrl?: string; manageUrl?: string };
}) {
  return (
    <Html>
      <Head>
        <style>{`
          img { max-width: 100%; height: auto; border-radius: 6px; margin: 16px 0; }
          h2 { font-size: 20px; font-weight: 600; margin: 28px 0 12px; color: #1c1917; }
          h3 { font-size: 17px; font-weight: 600; margin: 24px 0 8px; color: #1c1917; }
          blockquote { border-left: 3px solid #d6d3d1; padding-left: 16px; margin: 16px 0; color: #57534e; font-style: italic; }
          a { color: #b45309; }
          ul, ol { padding-left: 24px; margin: 12px 0; }
          li { margin-bottom: 6px; line-height: 24px; color: #44403c; }
          hr { border: none; border-top: 1px solid #e7e5e4; margin: 24px 0; }
        `}</style>
      </Head>
      {props.preview ? <Preview>{props.preview}</Preview> : null}
      <Body style={styles.body}>
        <Container style={styles.container}>
          {/* Brand */}
          <Section style={styles.brand}>
            <Text style={styles.brandName}>ContentDrip</Text>
          </Section>

          {/* Title */}
          <Heading style={styles.h1}>{props.title}</Heading>

          {/* Content */}
          <Section style={styles.content}>{props.children}</Section>

          {/* Footer */}
          <Section style={styles.footer}>
            <Hr style={styles.hr} />
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
              Sent via ContentDrip — thoughtful content, delivered at your pace.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const styles: Record<string, React.CSSProperties> = {
  body: {
    backgroundColor: "#fafaf9",
    fontFamily:
      "Georgia, 'Times New Roman', serif",
    margin: 0,
    padding: "32px 0",
    color: "#1c1917",
  },
  container: {
    margin: "0 auto",
    padding: "0 24px",
    maxWidth: 560,
  },
  brand: {
    paddingBottom: 16,
    marginBottom: 24,
    borderBottom: "1px solid #e7e5e4",
  },
  brandName: {
    margin: 0,
    fontSize: 16,
    fontWeight: 600,
    letterSpacing: "0.02em",
    color: "#44403c",
  },
  h1: {
    fontSize: 26,
    lineHeight: "34px",
    fontWeight: 700,
    margin: "0 0 16px",
    color: "#1c1917",
    fontFamily: "Georgia, 'Times New Roman', serif",
  },
  content: {
    fontSize: 16,
    lineHeight: "26px",
    color: "#44403c",
  },
  footer: {
    marginTop: 8,
  },
  hr: {
    borderColor: "#e7e5e4",
    margin: "24px 0",
  },
  footerLinks: {
    margin: "0 0 8px",
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

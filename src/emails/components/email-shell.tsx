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
  footer?: { unsubscribeUrl?: string; manageUrl?: string; pauseUrl?: string };
}) {
  return (
    <Html>
      <Head>
        <style>{`
          img { max-width: 100%; height: auto; border-radius: 8px; margin: 24px 0; }
          h2 { font-size: 20px; font-weight: 700; margin: 36px 0 12px; color: #2c2418; font-family: Georgia, 'Times New Roman', serif; }
          h3 { font-size: 17px; font-weight: 600; margin: 28px 0 8px; color: #2c2418; }
          p { margin: 0 0 18px; line-height: 30px; color: #4a3f33; }
          blockquote { border-left: 2px solid #c4956a; padding-left: 18px; margin: 24px 0; color: #6b5c4d; font-style: italic; }
          a { color: #8b6834; }
          ul, ol { padding-left: 24px; margin: 0 0 18px; }
          li { margin-bottom: 10px; line-height: 28px; color: #4a3f33; }
          hr { border: none; border-top: 1px solid #e8e2d9; margin: 32px 0; }
          strong { color: #2c2418; }
        `}</style>
      </Head>
      {props.preview ? <Preview>{props.preview}</Preview> : null}
      <Body style={styles.body}>
        <Container style={styles.container}>
          {/* ── Header ── */}
          <Section style={styles.header}>
            <Text style={styles.headerTitle}>Learnwise</Text>
          </Section>

          {/* ── Content ── */}
          <Section style={styles.main}>
            <Heading style={styles.h1}>{props.title}</Heading>
            <Section style={styles.content}>{props.children}</Section>
          </Section>

          {/* ── Footer ── */}
          <Section style={styles.footer}>
            <Hr style={styles.hr} />
            <Text style={styles.footerLinks}>
              {props.footer?.manageUrl ? (
                <>
                  <Link href={props.footer.manageUrl} style={styles.footerLink}>
                    Manage preferences
                  </Link>
                  {props.footer?.pauseUrl || props.footer?.unsubscribeUrl ? (
                    <span style={styles.footerDivider}>
                      &ensp;&middot;&ensp;
                    </span>
                  ) : null}
                </>
              ) : null}
              {props.footer?.pauseUrl ? (
                <>
                  <Link href={props.footer.pauseUrl} style={styles.footerLink}>
                    Pause delivery
                  </Link>
                  {props.footer?.unsubscribeUrl ? (
                    <span style={styles.footerDivider}>
                      &ensp;&middot;&ensp;
                    </span>
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
            <Text style={styles.footerNote}>Sent with care by ContentDrip</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const styles: Record<string, React.CSSProperties> = {
  body: {
    backgroundColor: "#f8f5f0",
    fontFamily: "Georgia, 'Times New Roman', serif",
    margin: 0,
    padding: "40px 0",
    color: "#2c2418",
  },
  container: {
    margin: "0 auto",
    maxWidth: 560,
    backgroundColor: "#fffdf9",
    border: "1px solid #e8e2d9",
    borderRadius: 8,
    overflow: "hidden",
  },
  /* Header bar */
  header: {
    backgroundColor: "#faf6ef",
    borderBottom: "2px solid #c4956a",
    padding: "24px 32px 20px",
    textAlign: "center" as const,
  },
  headerTitle: {
    margin: 0,
    fontSize: 15,
    fontWeight: 700,
    letterSpacing: "0.04em",
    color: "#8b6834",
    fontFamily: "Georgia, 'Times New Roman', serif",
  },
  /* Main content area */
  main: {
    padding: "36px 32px 12px",
  },
  h1: {
    fontSize: 28,
    lineHeight: "36px",
    fontWeight: 700,
    margin: "0 0 24px",
    color: "#2c2418",
    fontFamily: "Georgia, 'Times New Roman', serif",
  },
  content: {
    fontSize: 16,
    lineHeight: "30px",
    color: "#4a3f33",
  },
  /* Footer */
  footer: {
    padding: "0 32px 32px",
  },
  hr: {
    borderColor: "#e8e2d9",
    margin: "8px 0 24px",
  },
  footerLinks: {
    margin: "0 0 10px",
    fontSize: 12,
    color: "#8b8078",
    textAlign: "center" as const,
  },
  footerLink: {
    color: "#8b8078",
    textDecoration: "underline",
  },
  footerDivider: {
    color: "#d4cdc4",
  },
  footerNote: {
    margin: 0,
    fontSize: 11,
    color: "#b5ada4",
    textAlign: "center" as const,
  },
};

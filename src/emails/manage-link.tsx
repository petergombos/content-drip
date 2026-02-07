import { Button, Section, Text } from "@react-email/components";
import { EmailShell } from "@/emails/components/email-shell";

export function ManageLinkEmail(props: { manageUrl: string }) {
  return (
    <EmailShell
      title="Manage your subscription"
      preview="Your management link (expires in 24 hours)."
    >
      <Text style={{ margin: "0 0 16px", fontSize: 16, lineHeight: "26px", color: "#44403c" }}>
        Use the button below to update your delivery schedule, pause
        deliveries, or unsubscribe.
      </Text>

      <Section style={{ margin: "24px 0" }}>
        <Button
          href={props.manageUrl}
          style={{
            background: "#78350f",
            color: "#fffbeb",
            padding: "12px 24px",
            borderRadius: 6,
            fontSize: 14,
            fontWeight: 600,
            textDecoration: "none",
            display: "inline-block",
            fontFamily: "system-ui, -apple-system, sans-serif",
          }}
        >
          Open preferences
        </Button>
      </Section>

      <Text
        style={{
          margin: 0,
          fontSize: 13,
          lineHeight: "20px",
          color: "#a8a29e",
        }}
      >
        This link expires in 24 hours. If you didn&apos;t request this, you can
        safely ignore this email.
      </Text>
    </EmailShell>
  );
}

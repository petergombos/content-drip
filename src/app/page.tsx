import { SubscribeForm } from "@/components/subscribe-form";
import { Card } from "@/components/ui/card";
import { PageShell } from "@/components/page-shell";

export default function HomePage() {
  return (
    <PageShell
      title="A calmer way to ship an email series"
      subtitle="Choose a pack, set a cadence, and we’ll deliver the writing—quietly, consistently, and with real unsubscribe controls."
    >
      <Card className="p-6 md:p-8">
        <SubscribeForm />
      </Card>
    </PageShell>
  );
}

"use client";

import {
  IntervalSelector,
  intervalToCron,
} from "@/components/interval-selector";
import {
  SendTimeSelector,
  mergeHourIntoCron,
} from "@/components/send-time-selector";
import { SuccessState } from "@/components/success-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import "@/content-packs"; // Register all packs
import { getAllPacks } from "@/content-packs/registry";
import { subscribeAction } from "@/domains/subscriptions/actions/subscription-actions";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const subscribeSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  sendTime: z.number().min(0).max(23),
  timezone: z.string().min(1, "Missing timezone"),
  interval: z.string().optional(),
});

type SubscribeFormData = z.infer<typeof subscribeSchema>;

interface SubscribeFormProps {
  packKey?: string;
  /** When set, locks the cadence — hides the interval selector. */
  cadence?: string;
}

export function SubscribeForm({ packKey, cadence }: SubscribeFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [alreadySubscribed, setAlreadySubscribed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const packs = getAllPacks();
  const defaultPackKey = useMemo(
    () => packKey || packs[0]?.key || "",
    [packKey, packs],
  );
  const hasFixedCadence = !!cadence;

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<SubscribeFormData>({
    resolver: zodResolver(subscribeSchema),
    defaultValues: {
      sendTime: 8,
      timezone: "",
      interval: "Daily",
    },
  });

  const sendTime = watch("sendTime");
  const timezone = watch("timezone");

  useEffect(() => {
    // Detect timezone from the browser
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (tz) {
      setValue("timezone", tz, { shouldValidate: true });
    }
  }, [setValue]);

  const onSubmit = async (data: SubscribeFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const cronExpression = hasFixedCadence
        ? mergeHourIntoCron(cadence!, data.sendTime)
        : mergeHourIntoCron(
            intervalToCron(data.interval || "Daily"),
            data.sendTime,
          );

      const result = await subscribeAction({
        email: data.email,
        packKey: defaultPackKey,
        timezone: data.timezone,
        cronExpression,
      });

      if (result?.serverError) {
        setError(
          typeof result.serverError === "string"
            ? result.serverError
            : "An error occurred",
        );
      } else if (result?.data) {
        if (result.data.alreadySubscribed) {
          setAlreadySubscribed(true);
        } else {
          setSuccess(true);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (alreadySubscribed) {
    return (
      <div data-testid="subscribe-already-subscribed">
        <SuccessState
          icon="mail"
          title="You're already subscribed"
          description="We've sent a management link to your email. Use it to view your subscription status, update preferences, or resume delivery."
        />
      </div>
    );
  }

  if (success) {
    return (
      <div data-testid="subscribe-success">
        <SuccessState
          icon="check"
          title="Check your inbox"
          description="We've sent a confirmation email. Click the link inside to start your journey."
        />
      </div>
    );
  }

  if (!defaultPackKey) {
    return (
      <div className="rounded-lg border p-6 text-center">
        <h2 className="mb-2 text-xl font-semibold">No content pack found</h2>
        <p className="text-muted-foreground">
          Add a pack in <code>src/content-packs</code> and register it.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4"
      data-testid="subscribe-form"
    >
      {/* timezone is auto-detected; keep it in the form payload */}
      <input type="hidden" {...register("timezone")} />

      <div className="space-y-1.5">
        <Label htmlFor="email" className="text-xs font-medium">
          Email address
        </Label>
        <Input
          id="email"
          type="email"
          {...register("email")}
          data-testid="subscribe-email-input"
          placeholder="you@example.com"
          autoComplete="email"
          className="h-10"
        />
        {errors.email && (
          <p className="text-xs text-destructive">{errors.email.message}</p>
        )}
      </div>

      {!hasFixedCadence && (
        <div className="space-y-1.5">
          <Label htmlFor="interval" className="text-xs font-medium">
            Frequency
          </Label>
          <IntervalSelector
            value={watch("interval") || "Daily"}
            onValueChange={(value) => setValue("interval", value)}
          />
        </div>
      )}

      <div className="space-y-1.5">
        <Label htmlFor="sendTime" className="text-xs font-medium">
          Preferred delivery time{" "}
          {timezone ? (
            <>
              <span className="font-medium text-muted-foreground">
                ({timezone.replace(/_/g, " ")})
              </span>
            </>
          ) : (
            "Detecting your timezone…"
          )}
        </Label>
        <SendTimeSelector
          value={sendTime}
          onValueChange={(value) => setValue("sendTime", value)}
        />
        {errors.timezone && (
          <p className="text-xs text-destructive">{errors.timezone.message}</p>
        )}
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2.5 text-sm text-destructive">
          {error}
        </div>
      )}

      <Button
        type="submit"
        disabled={isSubmitting || !timezone}
        className="w-full"
        size="lg"
        data-testid="subscribe-submit"
      >
        {isSubmitting ? (
          <span className="flex items-center gap-2">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            Subscribing…
          </span>
        ) : (
          "Start My Free Course"
        )}
      </Button>
    </form>
  );
}

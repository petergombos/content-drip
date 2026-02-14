"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { resumeSubscriptionAction } from "@/domains/subscriptions/actions/subscription-actions";
import type { Subscription } from "@/domains/subscriptions/model/types";

interface ActionNotificationProps {
  action: string;
  subscription: Subscription;
}

const NOTIFICATIONS: Record<
  string,
  {
    icon: "pause" | "stop" | "check";
    title: string;
    description: string;
    undoLabel: string;
    borderColor: string;
    bgColor: string;
    iconBg: string;
    iconColor: string;
  }
> = {
  paused: {
    icon: "pause",
    title: "Subscription paused",
    description:
      "You won't receive any more lessons until you resume. Your progress is saved.",
    undoLabel: "Resume delivery",
    borderColor: "border-primary/30",
    bgColor: "bg-primary/5",
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
  },
  unsubscribed: {
    icon: "stop",
    title: "You've been unsubscribed",
    description:
      "You won't receive any more emails from this course. If this was a mistake, you can resubscribe below.",
    undoLabel: "Resubscribe",
    borderColor: "border-destructive/30",
    bgColor: "bg-destructive/5",
    iconBg: "bg-destructive/10",
    iconColor: "text-destructive",
  },
  resumed: {
    icon: "check",
    title: "Welcome back! Your subscription is active again.",
    description: "You'll continue receiving lessons where you left off.",
    undoLabel: "",
    borderColor: "border-olive/30",
    bgColor: "bg-olive/5",
    iconBg: "bg-olive/10",
    iconColor: "text-olive",
  },
};

export function ActionNotification({
  action,
  subscription,
}: ActionNotificationProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const notification = NOTIFICATIONS[action];
  if (!notification) return null;

  const canResume =
    (action === "paused" && subscription.status === "PAUSED") ||
    (action === "unsubscribed" && subscription.status === "STOPPED");

  const handleResume = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await resumeSubscriptionAction({
        subscriptionId: subscription.id,
      });

      if (result?.serverError) {
        setError(
          typeof result.serverError === "string"
            ? result.serverError
            : "Something went wrong. Please try again."
        );
        setIsLoading(false);
      } else {
        router.replace(`${pathname}?action=resumed`);
        router.refresh();
      }
    } catch {
      setError("Something went wrong. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div
      className={`mb-6 animate-fade-in-up rounded-lg border ${notification.borderColor} ${notification.bgColor} p-4`}
      data-testid={`action-notification-${action}`}
    >
      <div className="flex items-start gap-3">
        <div
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${notification.iconBg}`}
        >
          {notification.icon === "pause" ? (
            <svg
              className={`h-4 w-4 ${notification.iconColor}`}
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <rect x="6" y="4" width="4" height="16" rx="1" />
              <rect x="14" y="4" width="4" height="16" rx="1" />
            </svg>
          ) : notification.icon === "check" ? (
            <svg
              className={`h-4 w-4 ${notification.iconColor}`}
              viewBox="0 0 24 24"
              fill="none"
              strokeWidth={2.5}
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg
              className={`h-4 w-4 ${notification.iconColor}`}
              viewBox="0 0 24 24"
              fill="none"
              strokeWidth={2.5}
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="15" y1="9" x2="9" y2="15" />
              <line x1="9" y1="9" x2="15" y2="15" />
            </svg>
          )}
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-foreground">
            {notification.title}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            {notification.description}
          </p>
          {error && (
            <p className="mt-2 text-xs text-destructive">{error}</p>
          )}
          {canResume && (
            <Button
              onClick={handleResume}
              disabled={isLoading}
              size="sm"
              variant="outline"
              className="mt-3"
              data-testid="action-notification-undo"
            >
              {isLoading ? "Resuming..." : notification.undoLabel}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

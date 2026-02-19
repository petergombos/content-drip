"use server";

import { actionClient } from "@/lib/actions/client";
import { z } from "zod";
import { createHash } from "crypto";
import { revalidatePath } from "next/cache";
import { SubscriptionService } from "@/domains/subscriptions/services/subscription-service";
import { SubscriptionRepo } from "@/domains/subscriptions/repo/subscription-repo";
import { EmailService } from "@/domains/mail/services/email-service";
import { createMailAdapter } from "@/domains/mail/create-adapter";
import { buildCronExpression } from "@/lib/cron-utils";
// Ensure packs are registered
import "@/content-packs";

// Initialize services (singleton pattern)
const getSubscriptionService = () => {
  const repo = new SubscriptionRepo();
  const mailAdapter = createMailAdapter();
  const emailService = new EmailService(mailAdapter);
  return new SubscriptionService(repo, emailService);
};

const subscribeSchema = z.object({
  email: z.email(),
  packKey: z.string(),
  timezone: z.string(),
  frequency: z.string(),
  sendTime: z.number().int().min(0).max(23),
});

export const subscribeAction = actionClient
  .inputSchema(subscribeSchema)
  .action(async ({ parsedInput }) => {
    const service = getSubscriptionService();
    const cronExpression = buildCronExpression(parsedInput.frequency, parsedInput.sendTime);
    const result = await service.subscribe({ ...parsedInput, cronExpression });
    return {
      success: true,
      subscriptionId: result.subscriptionId,
      alreadySubscribed: result.alreadySubscribed ?? false,
    };
  });

const confirmSchema = z.object({
  token: z.string(),
});

export const confirmSubscriptionAction = actionClient
  .inputSchema(confirmSchema)
  .action(async ({ parsedInput }) => {
    const service = getSubscriptionService();
    const tokenHash = createHash("sha256")
      .update(parsedInput.token)
      .digest("hex");
    await service.confirmSubscription(tokenHash);
    return { success: true };
  });

const requestManageLinkSchema = z.object({
  email: z.email(),
});

export const requestManageLinkAction = actionClient
  .inputSchema(requestManageLinkSchema)
  .action(async ({ parsedInput }) => {
    const service = getSubscriptionService();
    await service.requestManageLink(parsedInput.email);
    return { success: true };
  });

const updateSubscriptionSchema = z.object({
  subscriptionId: z.string(),
  timezone: z.string(),
  frequency: z.string(),
  sendTime: z.number().int().min(0).max(23),
});

export const updateSubscriptionAction = actionClient
  .inputSchema(updateSubscriptionSchema)
  .action(async ({ parsedInput }) => {
    const service = getSubscriptionService();
    const cronExpression = buildCronExpression(parsedInput.frequency, parsedInput.sendTime);
    await service.updateSubscription(parsedInput.subscriptionId, {
      timezone: parsedInput.timezone,
      cronExpression,
    });
    revalidatePath("/manage", "layout");
    return { success: true };
  });

const pauseFromEmailSchema = z.object({
  subscriptionId: z.string(),
  token: z.string(),
});

export const pauseFromEmailAction = actionClient
  .inputSchema(pauseFromEmailSchema)
  .action(async ({ parsedInput }) => {
    const service = getSubscriptionService();
    await service.pauseFromEmail(
      parsedInput.subscriptionId,
      parsedInput.token
    );
    revalidatePath("/manage", "layout");
    return { success: true };
  });

const stopFromEmailSchema = z.object({
  subscriptionId: z.string(),
  token: z.string(),
});

export const stopFromEmailAction = actionClient
  .inputSchema(stopFromEmailSchema)
  .action(async ({ parsedInput }) => {
    const service = getSubscriptionService();
    await service.stopFromEmail(parsedInput.subscriptionId, parsedInput.token);
    revalidatePath("/manage", "layout");
    return { success: true };
  });

const pauseSubscriptionSchema = z.object({
  subscriptionId: z.string(),
});

export const pauseSubscriptionAction = actionClient
  .inputSchema(pauseSubscriptionSchema)
  .action(async ({ parsedInput }) => {
    const service = getSubscriptionService();
    await service.pauseSubscription(parsedInput.subscriptionId);
    revalidatePath("/manage", "layout");
    return { success: true };
  });

const resumeSubscriptionSchema = z.object({
  subscriptionId: z.string(),
});

export const resumeSubscriptionAction = actionClient
  .inputSchema(resumeSubscriptionSchema)
  .action(async ({ parsedInput }) => {
    const service = getSubscriptionService();
    await service.resumeSubscription(parsedInput.subscriptionId);
    revalidatePath("/manage", "layout");
    return { success: true };
  });

const restartSubscriptionSchema = z.object({
  subscriptionId: z.string(),
});

export const restartSubscriptionAction = actionClient
  .inputSchema(restartSubscriptionSchema)
  .action(async ({ parsedInput }) => {
    const service = getSubscriptionService();
    await service.restartSubscription(parsedInput.subscriptionId);
    revalidatePath("/manage", "layout");
    return { success: true };
  });

const unsubscribeFromManageSchema = z.object({
  subscriptionId: z.string(),
});

export const unsubscribeFromManageAction = actionClient
  .inputSchema(unsubscribeFromManageSchema)
  .action(async ({ parsedInput }) => {
    const emailService = new EmailService(
      createMailAdapter(),
      process.env.APP_BASE_URL || "http://localhost:3000"
    );
    const stopToken = emailService.createSignedToken(
      parsedInput.subscriptionId,
      "STOP"
    );
    const service = getSubscriptionService();
    await service.stopFromEmail(parsedInput.subscriptionId, stopToken);
    revalidatePath("/manage", "layout");
    return { success: true };
  });


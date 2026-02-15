import { test, expect } from "@playwright/test";
import type { Page } from "@playwright/test";
import {
  getEmails,
  waitForEmail,
  triggerCron,
  fastForward,
  cleanup,
  subscribeViaApi,
  extractConfirmUrl,
  extractManageUrl,
  extractPauseUrl,
  extractStopUrl,
  extractCompanionUrl,
} from "./helpers/test-api";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const PACK_KEY = "mindful-productivity";

// ---------------------------------------------------------------------------
// Hooks
// ---------------------------------------------------------------------------
test.beforeEach(async ({ request }) => {
  await cleanup(request);
});

test.afterAll(async ({ request }) => {
  await cleanup(request);
});

async function expectConfirmSuccess(page: Page) {
  await expect(page.getByTestId("confirm-success")).toBeVisible({
    timeout: 10_000,
  });
}

/**
 * Helper: subscribe, confirm, and return welcome email + subscription ID.
 */
async function setupConfirmedSubscription(
  page: Page,
  request: Parameters<typeof subscribeViaApi>[0],
  emailPrefix: string
) {
  const email = `${emailPrefix}-${Date.now()}@e2e.test`;
  const subscriptionId = await subscribeViaApi(request, { email });

  const confirmEmail = await waitForEmail(request, {
    to: email,
    subject: "Confirm",
  });
  await page.goto(extractConfirmUrl(confirmEmail.html)!);
  await expectConfirmSuccess(page);

  const welcomeEmail = await waitForEmail(request, {
    to: email,
    subject: "Welcome",
  });

  return { email, subscriptionId, welcomeEmail };
}

// ===========================================================================
// TEST 1: Happy Path - Subscribe via UI, confirm, receive all emails
// ===========================================================================
test.describe("Happy Path: Subscribe and receive emails", () => {
  test("complete subscription flow via landing page", async ({
    page,
    request,
  }) => {
    const email = `happy-${Date.now()}@e2e.test`;

    // -----------------------------------------------------------------------
    // Step 1: Visit landing page
    // -----------------------------------------------------------------------
    await page.goto("/example");
    await expect(page.getByTestId("subscribe-form").first()).toBeVisible();

    // -----------------------------------------------------------------------
    // Step 2: Fill in the subscription form
    // -----------------------------------------------------------------------
    await page.getByTestId("subscribe-email-input").first().fill(email);
    // The timezone is auto-detected, and sendTime defaults to 8

    // -----------------------------------------------------------------------
    // Step 3: Submit the form
    // -----------------------------------------------------------------------
    await page.getByTestId("subscribe-submit").first().click();

    // -----------------------------------------------------------------------
    // Step 4: Verify success message
    // -----------------------------------------------------------------------
    await expect(page.getByTestId("subscribe-success")).toBeVisible({
      timeout: 10_000,
    });

    // -----------------------------------------------------------------------
    // Step 5: Verify confirmation email was sent
    // -----------------------------------------------------------------------
    const confirmEmail = await waitForEmail(request, {
      to: email,
      subject: "Confirm",
    });
    expect(confirmEmail).toBeTruthy();
    expect(confirmEmail.subject).toContain("Confirm your subscription");
    expect(confirmEmail.tag).toBe(`confirm-${PACK_KEY}`);

    // -----------------------------------------------------------------------
    // Step 6: Extract and visit confirmation URL
    // -----------------------------------------------------------------------
    const confirmUrl = extractConfirmUrl(confirmEmail.html);
    expect(confirmUrl).toBeTruthy();
    expect(confirmUrl).toContain("/confirm/");

    await page.goto(confirmUrl!);

    // -----------------------------------------------------------------------
    // Step 7: Verify confirmation page
    // -----------------------------------------------------------------------
    await expectConfirmSuccess(page);

    // -----------------------------------------------------------------------
    // Step 8: Verify welcome email was sent
    // -----------------------------------------------------------------------
    const welcomeEmail = await waitForEmail(request, {
      to: email,
      subject: "Welcome",
    });
    expect(welcomeEmail).toBeTruthy();
    expect(welcomeEmail.subject).toContain("Welcome");
    expect(welcomeEmail.tag).toBe(`welcome-${PACK_KEY}`);

    // -----------------------------------------------------------------------
    // Step 9: Verify welcome email contains all required links
    // -----------------------------------------------------------------------
    const companionUrl = extractCompanionUrl(welcomeEmail.html);
    const manageUrl = extractManageUrl(welcomeEmail.html);
    const stopUrl = extractStopUrl(welcomeEmail.html);

    expect(companionUrl).toBeTruthy();
    expect(companionUrl).toContain(`/p/${PACK_KEY}/welcome`);
    expect(manageUrl).toBeTruthy();
    expect(manageUrl).toContain("/manage/");
    expect(stopUrl).toBeTruthy();
    expect(stopUrl).toContain("/api/stop");
  });

  test("full drip delivery via API subscribe + cron", async ({
    page,
    request,
  }) => {
    const email = `drip-${Date.now()}@e2e.test`;

    // -----------------------------------------------------------------------
    // Step 1: Subscribe via API for faster setup
    // -----------------------------------------------------------------------
    const subscriptionId = await subscribeViaApi(request, { email });
    expect(subscriptionId).toBeTruthy();

    // -----------------------------------------------------------------------
    // Step 2: Get and use confirmation email
    // -----------------------------------------------------------------------
    const confirmEmail = await waitForEmail(request, {
      to: email,
      subject: "Confirm",
    });
    const confirmUrl = extractConfirmUrl(confirmEmail.html);
    expect(confirmUrl).toBeTruthy();

    // Visit confirm page
    await page.goto(confirmUrl!);
    await expectConfirmSuccess(page);

    // -----------------------------------------------------------------------
    // Step 3: Verify welcome email (step 0)
    // -----------------------------------------------------------------------
    const welcomeEmail = await waitForEmail(request, {
      to: email,
      subject: "Welcome",
    });
    expect(welcomeEmail).toBeTruthy();
    expect(welcomeEmail.subject).toContain("Welcome");
    expect(welcomeEmail.tag).toBe(`welcome-${PACK_KEY}`);

    // -----------------------------------------------------------------------
    // Step 4: Fast-forward and trigger cron for day-1
    // -----------------------------------------------------------------------
    await fastForward(request, subscriptionId);
    const cron1 = await triggerCron(request);
    expect(cron1.sent).toBeGreaterThanOrEqual(1);

    const day1Email = await waitForEmail(request, {
      to: email,
      subject: "Day 1",
    });
    expect(day1Email.subject).toContain("Day 1");
    expect(day1Email.tag).toBe(`content-${PACK_KEY}-day-1`);

    // Verify day-1 email has companion URL
    const day1Companion = extractCompanionUrl(day1Email.html);
    expect(day1Companion).toContain(`/p/${PACK_KEY}/day-1`);

    // -----------------------------------------------------------------------
    // Step 5: Fast-forward and trigger cron for day-2
    // -----------------------------------------------------------------------
    await fastForward(request, subscriptionId);
    const cron2 = await triggerCron(request);
    expect(cron2.sent).toBeGreaterThanOrEqual(1);

    const day2Email = await waitForEmail(request, {
      to: email,
      subject: "Day 2",
    });
    expect(day2Email.subject).toContain("Day 2");
    expect(day2Email.tag).toBe(`content-${PACK_KEY}-day-2`);

    // Verify day-2 email has companion URL
    const day2Companion = extractCompanionUrl(day2Email.html);
    expect(day2Companion).toContain(`/p/${PACK_KEY}/day-2`);

    // -----------------------------------------------------------------------
    // Step 6: Trigger the next drip email and verify delivery continues
    // -----------------------------------------------------------------------
    await fastForward(request, subscriptionId);
    const cron3 = await triggerCron(request);
    expect(cron3.sent).toBeGreaterThanOrEqual(1);

    const day3Email = await waitForEmail(request, {
      to: email,
      subject: "Day 3",
    });
    expect(day3Email.tag).toBe(`content-${PACK_KEY}-day-3`);
  });
});

// ===========================================================================
// TEST 2: Email Link Validation
// ===========================================================================
test.describe("Email links point to correct URLs", () => {
  test("all email links resolve to valid pages", async ({
    page,
    request,
  }) => {
    const email = `links-${Date.now()}@e2e.test`;

    // Setup: subscribe and confirm
    const subscriptionId = await subscribeViaApi(request, { email });
    const confirmEmail = await waitForEmail(request, {
      to: email,
      subject: "Confirm",
    });
    const confirmUrl = extractConfirmUrl(confirmEmail.html);

    // Confirm URL format check
    expect(confirmUrl).toMatch(/\/confirm\/[a-f0-9]{64}/);

    // Visit confirm page
    await page.goto(confirmUrl!);
    await expectConfirmSuccess(page);

    // Get welcome email
    const welcomeEmail = await waitForEmail(request, {
      to: email,
      subject: "Welcome",
    });

    // -----------------------------------------------------------------------
    // Verify companion page URL works
    // -----------------------------------------------------------------------
    const companionUrl = extractCompanionUrl(welcomeEmail.html);
    expect(companionUrl).toBeTruthy();
    expect(companionUrl).toContain(`/p/${PACK_KEY}/welcome`);

    await page.goto(companionUrl!);
    await expect(page.getByTestId("companion-article")).toBeVisible({
      timeout: 10_000,
    });

    // -----------------------------------------------------------------------
    // Verify manage URL format
    // -----------------------------------------------------------------------
    const manageUrl = extractManageUrl(welcomeEmail.html);
    expect(manageUrl).toBeTruthy();
    expect(manageUrl).toMatch(/\/manage\/[a-f0-9]{64}/);

    // Visit manage page - should show subscription details
    await page.goto(manageUrl!);
    await expect(page.getByTestId("manage-overview-card")).toBeVisible({
      timeout: 10_000,
    });
    await expect(page.getByTestId("manage-email")).toContainText(email);

    // -----------------------------------------------------------------------
    // Verify pause URL format
    // -----------------------------------------------------------------------
    const pauseUrl = extractPauseUrl(welcomeEmail.html);
    expect(pauseUrl).toBeTruthy();
    expect(pauseUrl).toContain("/api/pause?token=");
    expect(pauseUrl).toContain(`id=${subscriptionId}`);

    // -----------------------------------------------------------------------
    // Verify stop URL format
    // -----------------------------------------------------------------------
    const stopUrl = extractStopUrl(welcomeEmail.html);
    expect(stopUrl).toBeTruthy();
    expect(stopUrl).toContain("/api/stop?token=");
    expect(stopUrl).toContain(`&id=${subscriptionId}`);

    // -----------------------------------------------------------------------
    // Trigger day-1 and verify its links too
    // -----------------------------------------------------------------------
    await fastForward(request, subscriptionId);
    await triggerCron(request);

    const day1Email = await waitForEmail(request, {
      to: email,
      subject: "Day 1",
    });

    // Day-1 should have companion URL for day-1
    const day1Companion = extractCompanionUrl(day1Email.html);
    expect(day1Companion).toContain(`/p/${PACK_KEY}/day-1`);

    // Visit day-1 companion page
    await page.goto(day1Companion!);
    await expect(page.getByTestId("companion-article")).toBeVisible({
      timeout: 10_000,
    });
  });
});

// ===========================================================================
// TEST 3: Pause via email link
// ===========================================================================
test.describe("Pause subscription via email link", () => {
  test("pause redirects to manage page with notification and stops delivery", async ({
    page,
    request,
  }) => {
    const { email, subscriptionId, welcomeEmail } =
      await setupConfirmedSubscription(page, request, "pause-email");

    const pauseUrl = extractPauseUrl(welcomeEmail.html);
    expect(pauseUrl).toBeTruthy();

    // -----------------------------------------------------------------------
    // Step 1: Click pause link — should redirect to manage page
    // -----------------------------------------------------------------------
    await page.goto(pauseUrl!);
    await page.waitForURL(/\/manage\/[a-f0-9]+\?action=paused/, {
      timeout: 10_000,
    });

    // -----------------------------------------------------------------------
    // Step 2: Manage page should show pause notification
    // -----------------------------------------------------------------------
    await expect(page.getByTestId("action-notification-paused")).toBeVisible({
      timeout: 10_000,
    });
    await expect(page.getByTestId("action-notification-undo")).toBeVisible();

    // Status badge should show "Paused"
    await expect(page.getByTestId("manage-status-badge")).toContainText(
      /paused/i
    );

    // -----------------------------------------------------------------------
    // Step 3: Verify no emails are sent while paused
    // -----------------------------------------------------------------------
    const emailCountBefore = (await getEmails(request, { to: email })).length;

    await fastForward(request, subscriptionId);
    await triggerCron(request);

    const emailCountAfter = (await getEmails(request, { to: email })).length;
    expect(emailCountAfter).toBe(emailCountBefore);
  });

  test("resume via notification after pause restores active state", async ({
    page,
    request,
  }) => {
    const { email, subscriptionId, welcomeEmail } =
      await setupConfirmedSubscription(page, request, "pause-resume");

    const pauseUrl = extractPauseUrl(welcomeEmail.html);

    // Pause via email link
    await page.goto(pauseUrl!);
    await page.waitForURL(/\/manage\/[a-f0-9]+\?action=paused/, {
      timeout: 10_000,
    });
    await expect(page.getByTestId("action-notification-paused")).toBeVisible({
      timeout: 10_000,
    });

    // -----------------------------------------------------------------------
    // Click "Resume delivery" in the notification
    // -----------------------------------------------------------------------
    await page.getByTestId("action-notification-undo").click();

    // Should show "resumed" notification
    await expect(page.getByTestId("action-notification-resumed")).toBeVisible({
      timeout: 10_000,
    });

    // Status badge should show "Active"
    await expect(page.getByTestId("manage-status-badge")).toContainText(
      /active/i
    );

    // -----------------------------------------------------------------------
    // Verify emails resume after unpausing
    // -----------------------------------------------------------------------
    await fastForward(request, subscriptionId);
    const cronResult = await triggerCron(request);
    expect(cronResult.sent).toBeGreaterThanOrEqual(1);

    const day1Email = await waitForEmail(request, {
      to: email,
      subject: "Day 1",
    });
    expect(day1Email).toBeTruthy();
  });
});

// ===========================================================================
// TEST 4: Pause via manage page
// ===========================================================================
test.describe("Pause subscription via manage page", () => {
  test("pause button refreshes page showing paused state with resume option", async ({
    page,
    request,
  }) => {
    const { email, welcomeEmail } = await setupConfirmedSubscription(
      page,
      request,
      "pause-manage"
    );

    const manageUrl = extractManageUrl(welcomeEmail.html);
    expect(manageUrl).toBeTruthy();

    // Visit manage page
    await page.goto(manageUrl!);
    await expect(page.getByTestId("manage-overview-card")).toBeVisible({
      timeout: 10_000,
    });

    // Should show active state with pause button
    await expect(page.getByTestId("manage-status-badge")).toContainText(
      /active/i
    );
    await expect(page.getByTestId("manage-pause-button")).toBeVisible();

    // -----------------------------------------------------------------------
    // Click pause
    // -----------------------------------------------------------------------
    await page.getByTestId("manage-pause-button").click();

    // Page should refresh and show paused state
    await expect(page.getByTestId("manage-paused-banner")).toBeVisible({
      timeout: 10_000,
    });
    await expect(page.getByTestId("manage-status-badge")).toContainText(
      /paused/i
    );
    await expect(page.getByTestId("manage-resume-button")).toBeVisible();

    // -----------------------------------------------------------------------
    // Click resume
    // -----------------------------------------------------------------------
    await page.getByTestId("manage-resume-button").click();

    // Page should refresh and show active state
    await expect(page.getByTestId("manage-active-banner")).toBeVisible({
      timeout: 10_000,
    });
    await expect(page.getByTestId("manage-status-badge")).toContainText(
      /active/i
    );
  });
});

// ===========================================================================
// TEST 5: Unsubscribe via email link
// ===========================================================================
test.describe("Unsubscribe via email link", () => {
  test("unsubscribe redirects to manage page with notification and stops delivery", async ({
    page,
    request,
  }) => {
    const { email, subscriptionId, welcomeEmail } =
      await setupConfirmedSubscription(page, request, "unsub-email");

    const stopUrl = extractStopUrl(welcomeEmail.html);
    expect(stopUrl).toBeTruthy();

    // -----------------------------------------------------------------------
    // Step 1: Click unsubscribe link — should redirect to manage page
    // -----------------------------------------------------------------------
    await page.goto(stopUrl!);
    await page.waitForURL(/\/manage\/[a-f0-9]+\?action=unsubscribed/, {
      timeout: 10_000,
    });

    // -----------------------------------------------------------------------
    // Step 2: Manage page should show unsubscribed notification
    // -----------------------------------------------------------------------
    await expect(
      page.getByTestId("action-notification-unsubscribed")
    ).toBeVisible({ timeout: 10_000 });
    await expect(page.getByTestId("action-notification-undo")).toBeVisible();

    // Status badge should show "Unsubscribed"
    await expect(page.getByTestId("manage-status-badge")).toContainText(
      /unsubscribed/i
    );

    // Danger zone (unsubscribe card) should be hidden
    await expect(page.getByTestId("manage-danger-zone")).not.toBeVisible();

    // -----------------------------------------------------------------------
    // Step 3: Verify no emails are sent after unsubscribing
    // -----------------------------------------------------------------------
    const emailCountBefore = (await getEmails(request, { to: email })).length;

    await fastForward(request, subscriptionId);
    await triggerCron(request);

    const emailCountAfter = (await getEmails(request, { to: email })).length;
    expect(emailCountAfter).toBe(emailCountBefore);
  });

  test("resubscribe via notification after unsubscribe restores active state", async ({
    page,
    request,
  }) => {
    const { email, subscriptionId, welcomeEmail } =
      await setupConfirmedSubscription(page, request, "resub");

    const stopUrl = extractStopUrl(welcomeEmail.html);

    // Unsubscribe via email link
    await page.goto(stopUrl!);
    await page.waitForURL(/\/manage\/[a-f0-9]+\?action=unsubscribed/, {
      timeout: 10_000,
    });
    await expect(
      page.getByTestId("action-notification-unsubscribed")
    ).toBeVisible({ timeout: 10_000 });

    // -----------------------------------------------------------------------
    // Click "Resubscribe" in the notification
    // -----------------------------------------------------------------------
    await page.getByTestId("action-notification-undo").click();

    // Should show "resumed" notification
    await expect(page.getByTestId("action-notification-resumed")).toBeVisible({
      timeout: 10_000,
    });

    // Status badge should show "Active"
    await expect(page.getByTestId("manage-status-badge")).toContainText(
      /active/i
    );

    // Danger zone should be visible again
    await expect(page.getByTestId("manage-danger-zone")).toBeVisible();

    // -----------------------------------------------------------------------
    // Verify emails resume after resubscribing
    // -----------------------------------------------------------------------
    await fastForward(request, subscriptionId);
    const cronResult = await triggerCron(request);
    expect(cronResult.sent).toBeGreaterThanOrEqual(1);

    const day1Email = await waitForEmail(request, {
      to: email,
      subject: "Day 1",
    });
    expect(day1Email).toBeTruthy();
  });
});

// ===========================================================================
// TEST 6: Unsubscribe via manage page
// ===========================================================================
test.describe("Unsubscribe via manage page", () => {
  test("unsubscribe button redirects to manage page with notification", async ({
    page,
    request,
  }) => {
    const { email, subscriptionId, welcomeEmail } =
      await setupConfirmedSubscription(page, request, "unsub-manage");

    const manageUrl = extractManageUrl(welcomeEmail.html);
    expect(manageUrl).toBeTruthy();

    // Visit manage page
    await page.goto(manageUrl!);
    await expect(page.getByTestId("manage-overview-card")).toBeVisible({
      timeout: 10_000,
    });

    // -----------------------------------------------------------------------
    // Click unsubscribe button
    // -----------------------------------------------------------------------
    await page.getByTestId("manage-unsubscribe-button").click();

    // Should redirect to manage page with unsubscribed notification
    await page.waitForURL(/\/manage\/[a-f0-9]+\?action=unsubscribed/, {
      timeout: 10_000,
    });
    await expect(
      page.getByTestId("action-notification-unsubscribed")
    ).toBeVisible({ timeout: 10_000 });
    await expect(page.getByTestId("manage-status-badge")).toContainText(
      /unsubscribed/i
    );

    // -----------------------------------------------------------------------
    // Verify no more emails
    // -----------------------------------------------------------------------
    const emailCountBefore = (await getEmails(request, { to: email })).length;

    await fastForward(request, subscriptionId);
    await triggerCron(request);

    const emailCountAfter = (await getEmails(request, { to: email })).length;
    expect(emailCountAfter).toBe(emailCountBefore);
  });

  test("resubscribe from manage page when already unsubscribed", async ({
    page,
    request,
  }) => {
    const { email, subscriptionId, welcomeEmail } =
      await setupConfirmedSubscription(page, request, "resub-manage");

    // Unsubscribe via stop link
    const stopUrl = extractStopUrl(welcomeEmail.html);
    await page.goto(stopUrl!);
    await page.waitForURL(/\/manage\/[a-f0-9]+\?action=unsubscribed/, {
      timeout: 10_000,
    });

    // Now request a fresh manage link (simulates returning later)
    await page.goto("/manage");
    await page.getByTestId("manage-request-email-input").fill(email);
    await page.getByTestId("manage-request-submit").click();
    await expect(page.getByTestId("manage-request-success")).toBeVisible({
      timeout: 10_000,
    });

    const manageLinkEmail = await waitForEmail(request, {
      to: email,
      subject: "Manage your subscription",
    });
    const manageUrl = extractManageUrl(manageLinkEmail.html);

    // Visit manage page — should show stopped banner with resubscribe button
    await page.goto(manageUrl!);
    await expect(page.getByTestId("manage-overview-card")).toBeVisible({
      timeout: 10_000,
    });
    await expect(page.getByTestId("manage-status-badge")).toContainText(
      /unsubscribed/i
    );
    await expect(page.getByTestId("manage-stopped-banner")).toBeVisible();

    // -----------------------------------------------------------------------
    // Click resubscribe
    // -----------------------------------------------------------------------
    await page.getByTestId("manage-resubscribe-button").click();

    // Page should refresh showing active state
    await expect(page.getByTestId("manage-active-banner")).toBeVisible({
      timeout: 10_000,
    });
    await expect(page.getByTestId("manage-status-badge")).toContainText(
      /active/i
    );

    // Verify emails resume
    await fastForward(request, subscriptionId);
    const cronResult = await triggerCron(request);
    expect(cronResult.sent).toBeGreaterThanOrEqual(1);
  });
});

// ===========================================================================
// TEST 7: Manage Feature
// ===========================================================================
test.describe("Manage subscription", () => {
  test("request manage link, view preferences, update settings", async ({
    page,
    request,
  }) => {
    const { email } = await setupConfirmedSubscription(
      page,
      request,
      "manage"
    );

    // -----------------------------------------------------------------------
    // Step 1: Go to /manage page
    // -----------------------------------------------------------------------
    await page.goto("/manage");
    await expect(page.getByTestId("manage-request-form")).toBeVisible();

    // -----------------------------------------------------------------------
    // Step 2: Fill in email and submit to request manage link
    // -----------------------------------------------------------------------
    await page.getByTestId("manage-request-email-input").fill(email);
    await page.getByTestId("manage-request-submit").click();

    // -----------------------------------------------------------------------
    // Step 3: Verify success message
    // -----------------------------------------------------------------------
    await expect(page.getByTestId("manage-request-success")).toBeVisible({
      timeout: 10_000,
    });

    // -----------------------------------------------------------------------
    // Step 4: Get manage link from email
    // -----------------------------------------------------------------------
    const manageLinkEmail = await waitForEmail(request, {
      to: email,
      subject: "Manage your subscription",
    });
    expect(manageLinkEmail).toBeTruthy();

    const manageUrl = extractManageUrl(manageLinkEmail.html);
    expect(manageUrl).toBeTruthy();
    expect(manageUrl).toMatch(/\/manage\/[a-f0-9]{64}/);

    // -----------------------------------------------------------------------
    // Step 5: Visit manage page
    // -----------------------------------------------------------------------
    await page.goto(manageUrl!);
    await expect(page.getByTestId("manage-overview-card")).toBeVisible({
      timeout: 10_000,
    });

    // -----------------------------------------------------------------------
    // Step 6: Verify subscription details are shown
    // -----------------------------------------------------------------------
    await expect(page.getByTestId("manage-email")).toContainText(email);
    await expect(page.getByTestId("manage-pack-name")).toBeVisible();
    await expect(page.getByTestId("manage-status-badge")).toContainText(
      /active/i
    );

    // -----------------------------------------------------------------------
    // Step 7: Update preferences
    // -----------------------------------------------------------------------
    await page.getByTestId("manage-preferences-submit").click();

    // Should show success
    await expect(page.getByTestId("manage-preferences-success")).toBeVisible({
      timeout: 10_000,
    });
  });

  test("manage link can be revisited (not single-use)", async ({
    page,
    request,
  }) => {
    const { email } = await setupConfirmedSubscription(
      page,
      request,
      "manage-reuse"
    );

    // Request manage link
    await page.goto("/manage");
    await page.getByTestId("manage-request-email-input").fill(email);
    await page.getByTestId("manage-request-submit").click();
    await expect(page.getByTestId("manage-request-success")).toBeVisible({
      timeout: 10_000,
    });

    const manageLinkEmail = await waitForEmail(request, {
      to: email,
      subject: "Manage your subscription",
    });
    const manageUrl = extractManageUrl(manageLinkEmail.html);

    // First visit should work
    await page.goto(manageUrl!);
    await expect(page.getByTestId("manage-overview-card")).toBeVisible({
      timeout: 10_000,
    });

    // Second visit should also work (token is reusable until expiry)
    await page.goto(manageUrl!);
    await expect(page.getByTestId("manage-overview-card")).toBeVisible({
      timeout: 10_000,
    });
  });
});

// ===========================================================================
// TEST 8: Email delivery completeness
// ===========================================================================
test.describe("Email delivery completeness", () => {
  test("all emails in the pack are delivered in order", async ({
    page,
    request,
  }) => {
    const email = `complete-${Date.now()}@e2e.test`;

    // Subscribe and confirm
    const subscriptionId = await subscribeViaApi(request, { email });
    const confirmEmail = await waitForEmail(request, {
      to: email,
      subject: "Confirm",
    });
    await page.goto(extractConfirmUrl(confirmEmail.html)!);
    await expectConfirmSuccess(page);

    // Welcome email (step 0)
    const welcomeEmail = await waitForEmail(request, {
      to: email,
      subject: "Welcome",
    });
    expect(welcomeEmail.tag).toBe(`welcome-${PACK_KEY}`);

    // Day 1 (step 1)
    await fastForward(request, subscriptionId);
    await triggerCron(request);
    const day1 = await waitForEmail(request, {
      to: email,
      subject: "Day 1",
    });
    expect(day1.tag).toBe(`content-${PACK_KEY}-day-1`);

    // Day 2 (step 2)
    await fastForward(request, subscriptionId);
    await triggerCron(request);
    const day2 = await waitForEmail(request, {
      to: email,
      subject: "Day 2",
    });
    expect(day2.tag).toBe(`content-${PACK_KEY}-day-2`);

    // Verify total email count: confirm + welcome + day-1 + day-2 = 4
    const allEmails = await getEmails(request, { to: email });
    expect(allEmails.length).toBe(4);

    // Verify correct order
    expect(allEmails[0].subject).toContain("Confirm");
    expect(allEmails[1].subject).toContain("Welcome");
    expect(allEmails[2].subject).toContain("Day 1");
    expect(allEmails[3].subject).toContain("Day 2");

    // Next trigger should continue with the next step
    await fastForward(request, subscriptionId);
    await triggerCron(request);
    const finalEmails = await getEmails(request, { to: email });
    expect(finalEmails.length).toBe(5);
    expect(finalEmails[4].subject).toContain("Day 3");
  });
});

// ===========================================================================
// TEST 9: Multi-subscription manage page
// ===========================================================================
test.describe("Multi-subscription manage page", () => {
  test("manage page shows all subscriptions for the same email", async ({
    page,
    request,
  }) => {
    const email = `multi-${Date.now()}@e2e.test`;

    // -----------------------------------------------------------------------
    // Step 1: Subscribe to two different packs with the same email
    // -----------------------------------------------------------------------
    const sub1Id = await subscribeViaApi(request, {
      email,
      packKey: "mindful-productivity",
    });
    const sub2Id = await subscribeViaApi(request, {
      email,
      packKey: "deep-work",
    });

    // Confirm both subscriptions
    const confirm1 = await waitForEmail(request, {
      to: email,
      subject: "Confirm",
      tag: "confirm-mindful-productivity",
    });
    await page.goto(extractConfirmUrl(confirm1.html)!);
    await expectConfirmSuccess(page);

    const confirm2 = await waitForEmail(request, {
      to: email,
      subject: "Confirm",
      tag: "confirm-deep-work",
    });
    await page.goto(extractConfirmUrl(confirm2.html)!);
    await expectConfirmSuccess(page);

    // -----------------------------------------------------------------------
    // Step 2: Request manage link (email only, no pack selector)
    // -----------------------------------------------------------------------
    await page.goto("/manage");
    await page.getByTestId("manage-request-email-input").fill(email);
    await page.getByTestId("manage-request-submit").click();
    await expect(page.getByTestId("manage-request-success")).toBeVisible({
      timeout: 10_000,
    });

    const manageLinkEmail = await waitForEmail(request, {
      to: email,
      subject: "Manage your subscription",
    });
    const manageUrl = extractManageUrl(manageLinkEmail.html);
    expect(manageUrl).toBeTruthy();

    // -----------------------------------------------------------------------
    // Step 3: Visit manage page — should show both subscriptions
    // -----------------------------------------------------------------------
    await page.goto(manageUrl!);
    await expect(page.getByTestId("manage-email")).toBeVisible({
      timeout: 10_000,
    });
    await expect(page.getByTestId("manage-email")).toContainText(email);

    // Both subscription cards should be visible
    await expect(
      page.getByTestId("subscription-card-mindful-productivity")
    ).toBeVisible();
    await expect(
      page.getByTestId("subscription-card-deep-work")
    ).toBeVisible();

    // Both should show active status
    const badges = page.getByTestId("manage-status-badge");
    await expect(badges).toHaveCount(2);
  });
});

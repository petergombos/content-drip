import { test, expect } from "@playwright/test";
import {
  getEmails,
  waitForEmail,
  clearEmails,
  triggerCron,
  fastForward,
  cleanup,
  subscribeViaApi,
  extractConfirmUrl,
  extractManageUrl,
  extractPauseUrl,
  extractStopUrl,
  extractCompanionUrl,
  extractAllUrls,
} from "./helpers/test-api";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------
const TEST_EMAIL = `e2e-${Date.now()}@e2e.test`;
const PACK_KEY = "dummy";
const BASE_URL = "http://localhost:3000";

// ---------------------------------------------------------------------------
// Hooks
// ---------------------------------------------------------------------------
test.beforeEach(async ({ request }) => {
  await cleanup(request);
});

test.afterAll(async ({ request }) => {
  await cleanup(request);
});

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
    await page.goto("/");
    await expect(page.locator("h1")).toContainText("email series");
    await expect(page.locator("text=Available pack")).toBeVisible();

    // -----------------------------------------------------------------------
    // Step 2: Fill in the subscription form
    // -----------------------------------------------------------------------
    await page.fill('input[type="email"]', email);
    // The timezone is auto-detected, and sendTime defaults to 8

    // -----------------------------------------------------------------------
    // Step 3: Submit the form
    // -----------------------------------------------------------------------
    await page.click('button[type="submit"]');

    // -----------------------------------------------------------------------
    // Step 4: Verify success message
    // -----------------------------------------------------------------------
    await expect(page.locator("text=Check your email!")).toBeVisible({
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
    await expect(page.locator("text=Confirmed")).toBeVisible({
      timeout: 10_000,
    });
    // The subtitle uses a typographic apostrophe; use a flexible match
    await expect(page.getByText(/subscribed/i)).toBeVisible();

    // -----------------------------------------------------------------------
    // Step 8: Verify welcome email was sent
    // -----------------------------------------------------------------------
    const welcomeEmail = await waitForEmail(request, {
      to: email,
      subject: "Welcome",
    });
    expect(welcomeEmail).toBeTruthy();
    expect(welcomeEmail.subject).toContain("Welcome to ContentDrip");
    expect(welcomeEmail.tag).toBe(`welcome-${PACK_KEY}`);

    // -----------------------------------------------------------------------
    // Step 9: Verify welcome email contains all required links
    // -----------------------------------------------------------------------
    const companionUrl = extractCompanionUrl(welcomeEmail.html);
    const manageUrl = extractManageUrl(welcomeEmail.html);
    const pauseUrl = extractPauseUrl(welcomeEmail.html);
    const stopUrl = extractStopUrl(welcomeEmail.html);

    expect(companionUrl).toBeTruthy();
    expect(companionUrl).toContain(`/p/${PACK_KEY}/welcome`);
    expect(manageUrl).toBeTruthy();
    expect(manageUrl).toContain("/manage/");
    expect(pauseUrl).toBeTruthy();
    expect(pauseUrl).toContain("/api/pause");
    expect(stopUrl).toBeTruthy();
    expect(stopUrl).toContain("/api/stop");

    // -----------------------------------------------------------------------
    // Step 10: Trigger cron to send day-1 email
    // -----------------------------------------------------------------------
    // Get the subscriptionId from the subscribe API response
    // (we need it for fast-forward; extract from the confirm URL token -> lookup)
    // Instead, let's use the emails to find the subscription.
    // Actually, we subscribed via UI so we don't have the ID directly.
    // Let's subscribe via API for the cron tests.
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
    await expect(page.locator("text=Confirmed")).toBeVisible({
      timeout: 10_000,
    });

    // -----------------------------------------------------------------------
    // Step 3: Verify welcome email (step 0)
    // -----------------------------------------------------------------------
    const welcomeEmail = await waitForEmail(request, {
      to: email,
      subject: "Welcome",
    });
    expect(welcomeEmail.subject).toContain("Welcome to ContentDrip");

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
    // Step 6: After all 3 steps (welcome + day-1 + day-2), subscription should complete
    // No more emails should be sent
    // -----------------------------------------------------------------------
    await fastForward(request, subscriptionId);
    const cron3 = await triggerCron(request);
    // No new emails should be sent for this subscription (it's completed)

    const allEmails = await getEmails(request, { to: email });
    // Should have: confirm + welcome + day-1 + day-2 = 4 emails total
    expect(allEmails.length).toBe(4);
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
    await expect(page.locator("text=Confirmed")).toBeVisible({
      timeout: 10_000,
    });

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
    await expect(page.locator("body")).not.toContainText("404");
    // The companion page should render content
    await page.waitForLoadState("networkidle");

    // -----------------------------------------------------------------------
    // Verify manage URL format
    // -----------------------------------------------------------------------
    const manageUrl = extractManageUrl(welcomeEmail.html);
    expect(manageUrl).toBeTruthy();
    expect(manageUrl).toMatch(/\/manage\/[a-f0-9]{64}/);

    // Visit manage page - should show subscription details
    await page.goto(manageUrl!);
    await expect(
      page.getByRole("heading", { name: "Preferences" })
    ).toBeVisible({ timeout: 10_000 });
    await expect(page.locator(`text=${email}`)).toBeVisible();

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
    await expect(page.locator("body")).not.toContainText("404");
  });
});

// ===========================================================================
// TEST 3: Pause Feature
// ===========================================================================
test.describe("Pause subscription", () => {
  test("pause via email link stops delivery, resume via manage page restarts it", async ({
    page,
    request,
  }) => {
    const email = `pause-${Date.now()}@e2e.test`;

    // Setup: subscribe and confirm
    const subscriptionId = await subscribeViaApi(request, { email });
    const confirmEmail = await waitForEmail(request, {
      to: email,
      subject: "Confirm",
    });
    await page.goto(extractConfirmUrl(confirmEmail.html)!);
    await expect(page.locator("text=Confirmed")).toBeVisible({
      timeout: 10_000,
    });

    // Get welcome email for pause link
    const welcomeEmail = await waitForEmail(request, {
      to: email,
      subject: "Welcome",
    });
    const pauseUrl = extractPauseUrl(welcomeEmail.html);
    expect(pauseUrl).toBeTruthy();

    // -----------------------------------------------------------------------
    // Step 1: Click pause link
    // -----------------------------------------------------------------------
    const pauseResponse = await page.goto(pauseUrl!);
    // The API should redirect to /?paused=true
    await page.waitForLoadState("networkidle");
    expect(page.url()).toContain("paused=true");

    // -----------------------------------------------------------------------
    // Step 2: Verify no emails are sent while paused
    // -----------------------------------------------------------------------
    const emailCountBefore = (await getEmails(request, { to: email })).length;

    await fastForward(request, subscriptionId);
    await triggerCron(request);

    const emailCountAfter = (await getEmails(request, { to: email })).length;
    // No new emails should have been sent (paused)
    expect(emailCountAfter).toBe(emailCountBefore);

    // -----------------------------------------------------------------------
    // Step 3: Request manage link to resume
    // -----------------------------------------------------------------------
    await page.goto("/manage");
    await expect(
      page.locator("text=Manage your subscription")
    ).toBeVisible();

    await page.fill('input[type="email"]', email);
    await page.click('button[type="submit"]');

    await expect(page.locator("text=Check your email!")).toBeVisible({
      timeout: 10_000,
    });

    // Get the manage link email
    const manageLinkEmail = await waitForEmail(request, {
      to: email,
      subject: "Manage your subscription",
    });
    const manageUrl = extractManageUrl(manageLinkEmail.html);
    expect(manageUrl).toBeTruthy();

    // -----------------------------------------------------------------------
    // Step 4: Visit manage page and resume
    // -----------------------------------------------------------------------
    await page.goto(manageUrl!);
    await expect(
      page.getByRole("heading", { name: "Preferences" })
    ).toBeVisible({ timeout: 10_000 });

    // Should show "paused" status
    await expect(
      page.locator("text=Your subscription is currently paused")
    ).toBeVisible();

    // Click resume button
    await page.click("text=Resume Subscription");

    // Should show success
    await expect(
      page.locator("text=Preferences updated successfully")
    ).toBeVisible({ timeout: 10_000 });

    // -----------------------------------------------------------------------
    // Step 5: Verify emails resume after unpausing
    // -----------------------------------------------------------------------
    await fastForward(request, subscriptionId);
    const cronResult = await triggerCron(request);
    expect(cronResult.sent).toBeGreaterThanOrEqual(1);

    // Day-1 email should now be sent
    const day1Email = await waitForEmail(request, {
      to: email,
      subject: "Day 1",
    });
    expect(day1Email).toBeTruthy();
  });
});

// ===========================================================================
// TEST 4: Unsubscribe Feature
// ===========================================================================
test.describe("Unsubscribe", () => {
  test("unsubscribe via email stop link", async ({ page, request }) => {
    const email = `unsub-${Date.now()}@e2e.test`;

    // Setup: subscribe and confirm
    const subscriptionId = await subscribeViaApi(request, { email });
    const confirmEmail = await waitForEmail(request, {
      to: email,
      subject: "Confirm",
    });
    await page.goto(extractConfirmUrl(confirmEmail.html)!);
    await expect(page.locator("text=Confirmed")).toBeVisible({
      timeout: 10_000,
    });

    // Get welcome email for unsubscribe link
    const welcomeEmail = await waitForEmail(request, {
      to: email,
      subject: "Welcome",
    });
    const stopUrl = extractStopUrl(welcomeEmail.html);
    expect(stopUrl).toBeTruthy();

    // -----------------------------------------------------------------------
    // Step 1: Click unsubscribe link
    // -----------------------------------------------------------------------
    await page.goto(stopUrl!);
    await page.waitForLoadState("networkidle");

    // Should redirect to /?unsubscribed=true
    expect(page.url()).toContain("unsubscribed=true");

    // -----------------------------------------------------------------------
    // Step 2: Verify no emails are sent after unsubscribing
    // -----------------------------------------------------------------------
    const emailCountBefore = (await getEmails(request, { to: email })).length;

    await fastForward(request, subscriptionId);
    await triggerCron(request);

    const emailCountAfter = (await getEmails(request, { to: email })).length;
    expect(emailCountAfter).toBe(emailCountBefore);
  });

  test("unsubscribe via manage page", async ({ page, request }) => {
    const email = `unsub-manage-${Date.now()}@e2e.test`;

    // Setup: subscribe and confirm
    const subscriptionId = await subscribeViaApi(request, { email });
    const confirmEmail = await waitForEmail(request, {
      to: email,
      subject: "Confirm",
    });
    await page.goto(extractConfirmUrl(confirmEmail.html)!);
    await expect(page.locator("text=Confirmed")).toBeVisible({
      timeout: 10_000,
    });

    // Get welcome email for manage link
    const welcomeEmail = await waitForEmail(request, {
      to: email,
      subject: "Welcome",
    });
    const manageUrl = extractManageUrl(welcomeEmail.html);
    expect(manageUrl).toBeTruthy();

    // -----------------------------------------------------------------------
    // Step 1: Visit manage page
    // -----------------------------------------------------------------------
    await page.goto(manageUrl!);
    await expect(
      page.getByRole("heading", { name: "Preferences" })
    ).toBeVisible({ timeout: 10_000 });

    // -----------------------------------------------------------------------
    // Step 2: Click unsubscribe button
    // -----------------------------------------------------------------------
    await page.getByRole("button", { name: "Unsubscribe" }).click();
    await page.waitForLoadState("networkidle");

    // Should redirect to /?unsubscribed=true
    expect(page.url()).toContain("unsubscribed=true");

    // -----------------------------------------------------------------------
    // Step 3: Verify no more emails
    // -----------------------------------------------------------------------
    const emailCountBefore = (await getEmails(request, { to: email })).length;

    await fastForward(request, subscriptionId);
    await triggerCron(request);

    const emailCountAfter = (await getEmails(request, { to: email })).length;
    expect(emailCountAfter).toBe(emailCountBefore);
  });
});

// ===========================================================================
// TEST 5: Manage Feature
// ===========================================================================
test.describe("Manage subscription", () => {
  test("request manage link, view preferences, update settings", async ({
    page,
    request,
  }) => {
    const email = `manage-${Date.now()}@e2e.test`;

    // Setup: subscribe and confirm
    const subscriptionId = await subscribeViaApi(request, { email });
    const confirmEmail = await waitForEmail(request, {
      to: email,
      subject: "Confirm",
    });
    await page.goto(extractConfirmUrl(confirmEmail.html)!);
    await expect(page.locator("text=Confirmed")).toBeVisible({
      timeout: 10_000,
    });

    // Wait for welcome email to be sent
    await waitForEmail(request, { to: email, subject: "Welcome" });

    // -----------------------------------------------------------------------
    // Step 1: Go to /manage page
    // -----------------------------------------------------------------------
    await page.goto("/manage");
    await expect(
      page.locator("text=Manage your subscription")
    ).toBeVisible();

    // -----------------------------------------------------------------------
    // Step 2: Fill in email and submit to request manage link
    // -----------------------------------------------------------------------
    await page.fill('input[type="email"]', email);
    // Pack selector should default to the first pack
    await page.click('button[type="submit"]');

    // -----------------------------------------------------------------------
    // Step 3: Verify success message
    // -----------------------------------------------------------------------
    await expect(page.locator("text=Check your email!")).toBeVisible({
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
    await expect(
      page.getByRole("heading", { name: "Preferences" })
    ).toBeVisible({ timeout: 10_000 });

    // -----------------------------------------------------------------------
    // Step 6: Verify subscription details are shown
    // -----------------------------------------------------------------------
    await expect(page.locator(`text=${email}`)).toBeVisible();
    await expect(page.locator(`text=${PACK_KEY}`)).toBeVisible();
    await expect(page.locator("text=ACTIVE")).toBeVisible();

    // -----------------------------------------------------------------------
    // Step 7: Update preferences (click Update Preferences)
    // -----------------------------------------------------------------------
    await page.getByRole("button", { name: "Update Preferences" }).click();

    // Should show success
    await expect(
      page.locator("text=Preferences updated successfully")
    ).toBeVisible({ timeout: 10_000 });
  });

  test("manage link expires after use (single-use token)", async ({
    page,
    request,
  }) => {
    const email = `manage-expire-${Date.now()}@e2e.test`;

    // Setup: subscribe and confirm
    await subscribeViaApi(request, { email });
    const confirmEmail = await waitForEmail(request, {
      to: email,
      subject: "Confirm",
    });
    await page.goto(extractConfirmUrl(confirmEmail.html)!);
    await expect(page.locator("text=Confirmed")).toBeVisible({
      timeout: 10_000,
    });
    await waitForEmail(request, { to: email, subject: "Welcome" });

    // Request manage link
    await page.goto("/manage");
    await page.fill('input[type="email"]', email);
    await page.click('button[type="submit"]');
    await expect(page.locator("text=Check your email!")).toBeVisible({
      timeout: 10_000,
    });

    const manageLinkEmail = await waitForEmail(request, {
      to: email,
      subject: "Manage your subscription",
    });
    const manageUrl = extractManageUrl(manageLinkEmail.html);

    // First visit should work
    await page.goto(manageUrl!);
    await expect(
      page.getByRole("heading", { name: "Preferences" })
    ).toBeVisible({ timeout: 10_000 });

    // Second visit should show expired (token is single-use)
    await page.goto(manageUrl!);
    await expect(
      page.getByRole("heading", { name: /expired/i })
    ).toBeVisible({ timeout: 10_000 });
  });
});

// ===========================================================================
// TEST 6: Email delivery completeness
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
    await expect(page.locator("text=Confirmed")).toBeVisible({
      timeout: 10_000,
    });

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

    // After completion, no more emails should be sent
    await fastForward(request, subscriptionId);
    await triggerCron(request);
    const finalEmails = await getEmails(request, { to: email });
    expect(finalEmails.length).toBe(4); // Still 4, no new ones
  });
});

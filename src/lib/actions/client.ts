import { createSafeActionClient } from "next-safe-action";

export const actionClient = createSafeActionClient({
  handleServerError(e) {
    console.error("Action error:", e);
    return e instanceof Error ? e.message : "An error occurred";
  },
});

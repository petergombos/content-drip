import { describe, it, expect, beforeEach } from "vitest";
import {
  registerPack,
  getAllPacks,
  getPackByKey,
  getPackStep,
  getNextStep,
  type ContentPack,
} from "./registry";

// The registry uses a module-level array, so packs accumulate across tests.
// We rely on unique keys per test to avoid interference.

function makePack(overrides: Partial<ContentPack> = {}): ContentPack {
  return {
    key: `test-pack-${Math.random().toString(36).slice(2, 8)}`,
    name: "Test Pack",
    description: "A test pack",
    steps: [
      { slug: "welcome", emailFile: "welcome.md" },
      { slug: "day-1", emailFile: "day-1.md" },
      { slug: "day-2", emailFile: "day-2.md" },
    ],
    ...overrides,
  };
}

describe("Content Pack Registry", () => {
  // ==========================================
  // registerPack / getAllPacks
  // ==========================================
  describe("registerPack / getAllPacks", () => {
    it("registers a pack and makes it retrievable", () => {
      const pack = makePack({ key: "reg-test-1" });
      const countBefore = getAllPacks().length;

      registerPack(pack);

      expect(getAllPacks().length).toBe(countBefore + 1);
      expect(getPackByKey("reg-test-1")).toBe(pack);
    });
  });

  // ==========================================
  // getPackByKey
  // ==========================================
  describe("getPackByKey", () => {
    it("returns the pack for a valid key", () => {
      const pack = makePack({ key: "lookup-test-1" });
      registerPack(pack);

      expect(getPackByKey("lookup-test-1")).toBe(pack);
    });

    it("returns undefined for unknown key", () => {
      expect(getPackByKey("does-not-exist")).toBeUndefined();
    });
  });

  // ==========================================
  // getPackStep
  // ==========================================
  describe("getPackStep", () => {
    it("returns pack and step for valid key+slug", () => {
      const pack = makePack({ key: "step-test-1" });
      registerPack(pack);

      const result = getPackStep("step-test-1", "day-1");
      expect(result).not.toBeNull();
      expect(result!.pack).toBe(pack);
      expect(result!.step.slug).toBe("day-1");
    });

    it("returns null for unknown pack key", () => {
      expect(getPackStep("unknown-pack", "day-1")).toBeNull();
    });

    it("returns null for unknown step slug", () => {
      const pack = makePack({ key: "step-test-2" });
      registerPack(pack);

      expect(getPackStep("step-test-2", "day-99")).toBeNull();
    });
  });

  // ==========================================
  // getNextStep
  // ==========================================
  describe("getNextStep", () => {
    it("returns step at the given index", () => {
      const pack = makePack({ key: "next-test-1" });
      registerPack(pack);

      expect(getNextStep("next-test-1", 0)?.slug).toBe("welcome");
      expect(getNextStep("next-test-1", 1)?.slug).toBe("day-1");
      expect(getNextStep("next-test-1", 2)?.slug).toBe("day-2");
    });

    it("returns null when index exceeds steps length", () => {
      const pack = makePack({ key: "next-test-2" });
      registerPack(pack);

      expect(getNextStep("next-test-2", 3)).toBeNull();
      expect(getNextStep("next-test-2", 100)).toBeNull();
    });

    it("returns null for unknown pack", () => {
      expect(getNextStep("unknown-pack", 0)).toBeNull();
    });
  });
});

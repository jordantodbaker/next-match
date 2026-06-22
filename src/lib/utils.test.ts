import { describe, expect, it } from "vitest";
import { cn, getSunday } from "./utils";

describe("cn", () => {
  it("joins class names", () => {
    expect(cn("a", "b")).toBe("a b");
  });

  it("drops falsy values", () => {
    expect(cn("a", false, undefined, null, "b")).toBe("a b");
  });

  it("dedupes conflicting tailwind classes (last wins)", () => {
    expect(cn("p-2", "p-4")).toBe("p-4");
  });
});

describe("getSunday", () => {
  it("returns a Date that falls on a Sunday", () => {
    expect(getSunday().getDay()).toBe(0);
  });

  it("returns a date not in the future", () => {
    expect(getSunday().getTime()).toBeLessThanOrEqual(Date.now());
  });

  it("returns a Sunday within the last 7 days", () => {
    const diffDays = (Date.now() - getSunday().getTime()) / (1000 * 60 * 60 * 24);
    expect(diffDays).toBeGreaterThanOrEqual(0);
    expect(diffDays).toBeLessThan(7);
  });
});

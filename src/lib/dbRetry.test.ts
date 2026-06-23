import { describe, expect, it, vi } from "vitest";
import { isTransientDbError, withDbRetry } from "./dbRetry";

describe("isTransientDbError", () => {
  it("flags PrismaClientInitializationError", () => {
    expect(isTransientDbError({ name: "PrismaClientInitializationError" })).toBe(
      true
    );
  });

  it("flags the P1001 'can't reach database' code", () => {
    expect(isTransientDbError({ code: "P1001" })).toBe(true);
  });

  it("flags by message text", () => {
    expect(
      isTransientDbError({ message: "Can't reach database server at neon..." })
    ).toBe(true);
  });

  it("does not flag ordinary errors", () => {
    expect(isTransientDbError(new Error("Unique constraint failed"))).toBe(false);
    expect(isTransientDbError({ code: "P2002" })).toBe(false);
    expect(isTransientDbError(null)).toBe(false);
  });
});

describe("withDbRetry", () => {
  it("returns the result on first success without retrying", async () => {
    const op = vi.fn().mockResolvedValue("ok");
    expect(await withDbRetry(op)).toBe("ok");
    expect(op).toHaveBeenCalledTimes(1);
  });

  it("retries a transient connection error and then succeeds", async () => {
    const op = vi
      .fn()
      .mockRejectedValueOnce({ name: "PrismaClientInitializationError" })
      .mockResolvedValue("ok");

    const result = await withDbRetry(op, { baseDelayMs: 0 });

    expect(result).toBe("ok");
    expect(op).toHaveBeenCalledTimes(2);
  });

  it("does not retry a non-transient error", async () => {
    const op = vi.fn().mockRejectedValue(new Error("Unique constraint failed"));
    await expect(withDbRetry(op, { baseDelayMs: 0 })).rejects.toThrow(
      "Unique constraint failed"
    );
    expect(op).toHaveBeenCalledTimes(1);
  });

  it("gives up after the configured attempts and rethrows", async () => {
    const err = { name: "PrismaClientInitializationError" };
    const op = vi.fn().mockRejectedValue(err);
    await expect(
      withDbRetry(op, { attempts: 3, baseDelayMs: 0 })
    ).rejects.toBe(err);
    expect(op).toHaveBeenCalledTimes(3);
  });
});

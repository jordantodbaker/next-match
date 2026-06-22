import { describe, expect, it } from "vitest";
import { userSchema } from "./userSchema";

const valid = {
  name: "Jordan",
  email: "jordan@example.com",
  password: "secret123",
};

describe("userSchema", () => {
  it("accepts a valid payload", () => {
    expect(userSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects a name shorter than 2 chars", () => {
    expect(userSchema.safeParse({ ...valid, name: "J" }).success).toBe(false);
  });

  it("rejects an invalid email", () => {
    expect(userSchema.safeParse({ ...valid, email: "not-an-email" }).success).toBe(false);
  });

  it("allows an empty password", () => {
    expect(userSchema.safeParse({ ...valid, password: "" }).success).toBe(true);
  });

  it("rejects a non-empty password shorter than 6 chars", () => {
    expect(userSchema.safeParse({ ...valid, password: "12345" }).success).toBe(false);
  });
});

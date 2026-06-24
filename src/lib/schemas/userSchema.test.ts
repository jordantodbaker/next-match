import { describe, expect, it } from "vitest";
import { userSchema } from "./userSchema";

const valid = {
  name: "Jordan",
  email: "jordan@example.com",
};

describe("userSchema", () => {
  it("accepts a valid payload", () => {
    expect(userSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects a name shorter than 2 chars", () => {
    expect(userSchema.safeParse({ ...valid, name: "J" }).success).toBe(false);
  });

  it("rejects an invalid email", () => {
    expect(userSchema.safeParse({ ...valid, email: "not-an-email" }).success).toBe(
      false
    );
  });
});

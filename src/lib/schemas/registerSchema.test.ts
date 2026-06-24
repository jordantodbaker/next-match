import { describe, expect, it } from "vitest";
import { registerSchema } from "./registerSchema";

const valid = {
  id: 0,
  name: "Jordan",
  email: "jordan@example.com",
  companyId: 1,
};

describe("registerSchema", () => {
  it("accepts a valid payload", () => {
    expect(registerSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects a name shorter than 3 chars", () => {
    expect(registerSchema.safeParse({ ...valid, name: "Jo" }).success).toBe(false);
  });

  it("rejects an invalid email", () => {
    expect(registerSchema.safeParse({ ...valid, email: "nope" }).success).toBe(
      false
    );
  });

  it("accepts an optional clerkId (linking an existing Clerk user)", () => {
    expect(
      registerSchema.safeParse({ ...valid, clerkId: "user_123" }).success
    ).toBe(true);
  });

  it("accepts an optional securityRole", () => {
    expect(
      registerSchema.safeParse({ ...valid, securityRole: "ADMIN" }).success
    ).toBe(true);
  });
});

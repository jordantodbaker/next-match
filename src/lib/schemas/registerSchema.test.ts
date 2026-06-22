import { describe, expect, it } from "vitest";
import { registerSchema } from "./registerSchema";

const valid = {
  id: 0,
  name: "Jordan",
  email: "jordan@example.com",
  password: "secret123",
  companyId: 1,
  updatePassword: true,
};

describe("registerSchema", () => {
  it("accepts a valid payload", () => {
    expect(registerSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects a name shorter than 3 chars", () => {
    expect(registerSchema.safeParse({ ...valid, name: "Jo" }).success).toBe(false);
  });

  it("rejects an invalid email", () => {
    expect(registerSchema.safeParse({ ...valid, email: "nope" }).success).toBe(false);
  });

  it("allows an empty password (edit without password change)", () => {
    expect(registerSchema.safeParse({ ...valid, password: "" }).success).toBe(true);
  });

  it("rejects a non-empty password shorter than 6 chars", () => {
    expect(registerSchema.safeParse({ ...valid, password: "abc" }).success).toBe(false);
  });

  it("accepts an optional clerkId (linking an existing Clerk user)", () => {
    const result = registerSchema.safeParse({ ...valid, clerkId: "user_123" });
    expect(result.success).toBe(true);
  });

  it("treats updatePassword and hasTakenWFPTour as optional", () => {
    const { updatePassword, ...rest } = valid;
    expect(registerSchema.safeParse(rest).success).toBe(true);
  });
});

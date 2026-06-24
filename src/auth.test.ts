import { describe, expect, it, vi, beforeEach, type Mock } from "vitest";

// getCurrentUser is wrapped in React `cache()`; make it identity so it's
// callable outside a request scope.
vi.mock("react", async (importOriginal) => {
  const actual = await importOriginal<typeof import("react")>();
  return { ...actual, cache: (fn: unknown) => fn };
});

vi.mock("@clerk/nextjs/server", () => ({ auth: vi.fn() }));
vi.mock("@/lib/prisma", () => ({
  prisma: { user: { findUnique: vi.fn() } },
}));

import { auth as clerkAuth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "./auth";

const mockClerkAuth = clerkAuth as unknown as Mock;
const mockFindUnique = prisma.user.findUnique as unknown as Mock;

beforeEach(() => vi.clearAllMocks());

describe("getCurrentUser", () => {
  it("returns null and skips the DB when signed out", async () => {
    mockClerkAuth.mockResolvedValue({ userId: null });
    expect(await getCurrentUser()).toBeNull();
    expect(mockFindUnique).not.toHaveBeenCalled();
  });

  it("looks up the Prisma user by clerkId when signed in", async () => {
    const user = { id: 6, clerkId: "user_1", companyId: 21, securityRole: "USER" };
    mockClerkAuth.mockResolvedValue({ userId: "user_1" });
    mockFindUnique.mockResolvedValue(user);

    expect(await getCurrentUser()).toEqual(user);
    expect(mockFindUnique).toHaveBeenCalledWith({ where: { clerkId: "user_1" } });
  });
});

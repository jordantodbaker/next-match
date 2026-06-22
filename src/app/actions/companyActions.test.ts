import { describe, expect, it, vi, beforeEach } from "vitest";

const { mockPrisma, mockGetCurrentUser } = vi.hoisted(() => ({
  mockPrisma: {
    companyAccount: {
      findFirst: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
  mockGetCurrentUser: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({ prisma: mockPrisma }));
vi.mock("@/auth", () => ({ getCurrentUser: mockGetCurrentUser }));

import { getCompany, saveCompany } from "./companyActions";

beforeEach(() => vi.clearAllMocks());

describe("getCompany", () => {
  it("returns undefined and skips the query when the user has no company", async () => {
    mockGetCurrentUser.mockResolvedValue(null);
    expect(await getCompany()).toBeUndefined();
    expect(mockPrisma.companyAccount.findFirst).not.toHaveBeenCalled();
  });

  it("returns the user's company when a companyId is present", async () => {
    const company = { id: 21, name: "Grand Sierra", powerBiUrl: "https://x" };
    mockGetCurrentUser.mockResolvedValue({ companyId: 21 });
    mockPrisma.companyAccount.findFirst.mockResolvedValue(company);

    expect(await getCompany()).toEqual(company);
    expect(mockPrisma.companyAccount.findFirst).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: 21 } })
    );
  });
});

describe("saveCompany", () => {
  it("creates a new company when id is 0", async () => {
    const res = await saveCompany(
      { id: 0, name: "X", companyCode: "X", powerBiUrl: null } as never,
      [],
      []
    );
    expect(res.status).toBe("success");
    expect(mockPrisma.companyAccount.create).toHaveBeenCalled();
    expect(mockPrisma.companyAccount.update).not.toHaveBeenCalled();
  });

  it("updates an existing company when id is non-zero", async () => {
    const res = await saveCompany(
      { id: 5, name: "X", companyCode: "X", powerBiUrl: null } as never,
      [],
      []
    );
    expect(res.status).toBe("success");
    expect(mockPrisma.companyAccount.update).toHaveBeenCalled();
    expect(mockPrisma.companyAccount.create).not.toHaveBeenCalled();
  });
});

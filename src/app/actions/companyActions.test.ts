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

import {
  getCompany,
  getCompanies,
  saveCompany,
  deleteCompany,
} from "./companyActions";

beforeEach(() => vi.clearAllMocks());

describe("getCompanies", () => {
  it("excludes the internal ACE company", async () => {
    mockPrisma.companyAccount.findMany.mockResolvedValue([{ id: 2, name: "Acme" }]);

    const res = await getCompanies();

    expect(res).toEqual([{ id: 2, name: "Acme" }]);
    expect(mockPrisma.companyAccount.findMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { companyCode: { not: "ACE" } } })
    );
  });
});

describe("deleteCompany", () => {
  it("deletes the company by id", async () => {
    mockPrisma.companyAccount.delete.mockResolvedValue({});
    const res = await deleteCompany({ id: 5 } as never);

    expect(res.status).toBe("success");
    expect(mockPrisma.companyAccount.delete).toHaveBeenCalledWith({
      where: { id: 5 },
    });
  });

  it("returns an error result when the delete throws (e.g. FK constraint)", async () => {
    mockPrisma.companyAccount.delete.mockRejectedValue(new Error("FK constraint"));
    const res = await deleteCompany({ id: 5 } as never);
    expect(res.status).toBe("error");
  });
});

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

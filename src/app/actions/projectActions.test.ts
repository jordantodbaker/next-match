import { describe, expect, it, vi, beforeEach } from "vitest";
import { emptyProject } from "@/lib/schemas/defaultModels";

const { mockPrisma, mockGetCurrentUser } = vi.hoisted(() => ({
  mockPrisma: {
    project: { findMany: vi.fn() },
    companyAccount: { findFirst: vi.fn() },
  },
  mockGetCurrentUser: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({ prisma: mockPrisma }));
vi.mock("@/auth", () => ({ getCurrentUser: mockGetCurrentUser }));

import { getProjects } from "./projectActions";

beforeEach(() => vi.clearAllMocks());

describe("getProjects", () => {
  it("returns every project for admins", async () => {
    const all = [{ id: 1 }, { id: 2 }];
    mockGetCurrentUser.mockResolvedValue({ securityRole: "ADMIN", companyId: 1 });
    mockPrisma.project.findMany.mockResolvedValue(all);

    expect(await getProjects()).toBe(all);
    expect(mockPrisma.companyAccount.findFirst).not.toHaveBeenCalled();
  });

  it("returns the empty placeholder when there is no company", async () => {
    mockGetCurrentUser.mockResolvedValue(null);
    expect(await getProjects()).toEqual([emptyProject]);
  });

  it("returns the user's company projects for a regular user", async () => {
    const projects = [{ id: 9, name: "Proj" }];
    mockGetCurrentUser.mockResolvedValue({ securityRole: "USER", companyId: 21 });
    mockPrisma.companyAccount.findFirst.mockResolvedValue({ projects });

    expect(await getProjects()).toBe(projects);
  });
});

import { describe, expect, it, vi, beforeEach } from "vitest";

const { mockPrisma } = vi.hoisted(() => ({
  mockPrisma: {
    role: {
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

vi.mock("@/lib/prisma", () => ({ prisma: mockPrisma }));

import { saveRole, deleteRole } from "./rolesActions";

const role = { id: 0, code: "PM", name: "Project Manager", description: "", categoryId: 1 };

beforeEach(() => vi.clearAllMocks());

describe("saveRole", () => {
  it("creates a role when id is 0", async () => {
    const res = await saveRole(role as never);
    expect(res.status).toBe("success");
    expect(mockPrisma.role.create).toHaveBeenCalled();
    expect(mockPrisma.role.update).not.toHaveBeenCalled();
  });

  it("updates a role when id is non-zero", async () => {
    const res = await saveRole({ ...role, id: 3 } as never);
    expect(res.status).toBe("success");
    expect(mockPrisma.role.update).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: 3 } })
    );
  });
});

describe("deleteRole", () => {
  it("returns an error result when the delete throws (e.g. FK constraint)", async () => {
    mockPrisma.role.delete.mockRejectedValue(new Error("FK constraint"));
    const res = await deleteRole({ ...role, id: 3 } as never);
    expect(res.status).toBe("error");
  });
});

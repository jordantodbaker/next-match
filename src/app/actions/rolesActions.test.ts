import { describe, expect, it, vi, beforeEach } from "vitest";

const { mockPrisma } = vi.hoisted(() => ({
  mockPrisma: {
    role: {
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
      createMany: vi.fn(),
      updateMany: vi.fn(),
    },
  },
}));

vi.mock("@/lib/prisma", () => ({ prisma: mockPrisma }));

import { saveRole, saveRoles, deleteRole } from "./rolesActions";

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

describe("saveRoles", () => {
  it("createMany for new roles and updateMany for existing ones", async () => {
    const roles = [
      { id: 0, code: "A", name: "RoleA", description: "", categoryId: 1 },
      { id: 3, code: "B", name: "RoleB", description: "", categoryId: 1 },
    ];

    const res = await saveRoles(roles as never);

    expect(res.status).toBe("success");
    expect(mockPrisma.role.createMany).toHaveBeenCalledTimes(1);
    expect(mockPrisma.role.updateMany).toHaveBeenCalledTimes(1);
  });

  it("skips createMany when there are no new roles", async () => {
    await saveRoles([
      { id: 3, code: "B", name: "RoleB", description: "", categoryId: 1 },
    ] as never);
    expect(mockPrisma.role.createMany).not.toHaveBeenCalled();
    expect(mockPrisma.role.updateMany).toHaveBeenCalledTimes(1);
  });
});

describe("deleteRole", () => {
  it("returns an error result when the delete throws (e.g. FK constraint)", async () => {
    mockPrisma.role.delete.mockRejectedValue(new Error("FK constraint"));
    const res = await deleteRole({ ...role, id: 3 } as never);
    expect(res.status).toBe("error");
  });
});

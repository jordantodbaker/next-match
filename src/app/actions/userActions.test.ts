import { describe, expect, it, vi, beforeEach } from "vitest";

const { mockUsers, mockPrisma, mockGetCurrentUser } = vi.hoisted(() => ({
  mockUsers: {
    createUser: vi.fn(),
    updateUser: vi.fn(),
    deleteUser: vi.fn(),
    getUserList: vi.fn(),
  },
  mockPrisma: {
    user: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
  mockGetCurrentUser: vi.fn(),
}));

vi.mock("@clerk/nextjs/server", () => ({
  clerkClient: vi.fn(async () => ({ users: mockUsers })),
}));
vi.mock("@/lib/prisma", () => ({ prisma: mockPrisma }));
vi.mock("@/auth", () => ({ getCurrentUser: mockGetCurrentUser }));

import {
  getPostLoginPath,
  saveUser,
  deleteUser,
  getUnlinkedClerkUsers,
} from "./userActions";

beforeEach(() => vi.clearAllMocks());

describe("getPostLoginPath", () => {
  it("routes admins to /admin/users", async () => {
    mockGetCurrentUser.mockResolvedValue({ securityRole: "ADMIN" });
    expect(await getPostLoginPath()).toBe("/admin/users");
  });

  it("routes regular users to /report", async () => {
    mockGetCurrentUser.mockResolvedValue({ securityRole: "USER" });
    expect(await getPostLoginPath()).toBe("/report");
  });

  it("defaults unlinked users to /report", async () => {
    mockGetCurrentUser.mockResolvedValue(null);
    expect(await getPostLoginPath()).toBe("/report");
  });
});

describe("saveUser", () => {
  const base = {
    id: 0,
    name: "Jordan",
    email: "jordan@example.com",
    companyId: 21,
    updatePassword: false,
  };

  it("links an existing Clerk identity without creating a new Clerk user", async () => {
    mockPrisma.user.create.mockResolvedValue({ id: 6 });
    const res = await saveUser({ ...base, clerkId: "user_1" } as never);

    expect(res.status).toBe("success");
    expect(mockUsers.createUser).not.toHaveBeenCalled();
    expect(mockPrisma.user.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ clerkId: "user_1", companyId: 21 }),
      })
    );
  });

  it("requires a password when creating a brand-new user", async () => {
    const res = await saveUser({ ...base } as never);
    expect(res).toEqual({
      status: "error",
      error: "Password is required for new users",
    });
    expect(mockUsers.createUser).not.toHaveBeenCalled();
    expect(mockPrisma.user.create).not.toHaveBeenCalled();
  });

  it("creates a Clerk user then the DB record for a new password user", async () => {
    mockUsers.createUser.mockResolvedValue({ id: "user_new" });
    mockPrisma.user.create.mockResolvedValue({ id: 7 });
    const res = await saveUser({ ...base, password: "secret123" } as never);

    expect(res.status).toBe("success");
    expect(mockUsers.createUser).toHaveBeenCalled();
    expect(mockPrisma.user.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ clerkId: "user_new" }),
      })
    );
  });
});

describe("deleteUser", () => {
  it("deletes the Prisma row then the linked Clerk user", async () => {
    mockPrisma.user.findUnique.mockResolvedValue({ id: 6, clerkId: "user_1" });
    mockPrisma.user.delete.mockResolvedValue({ id: 6 });

    const res = await deleteUser(6);

    expect(res.status).toBe("success");
    expect(mockPrisma.user.delete).toHaveBeenCalledWith({ where: { id: 6 } });
    expect(mockUsers.deleteUser).toHaveBeenCalledWith("user_1");
  });

  it("returns an error when the user does not exist", async () => {
    mockPrisma.user.findUnique.mockResolvedValue(null);
    const res = await deleteUser(99);
    expect(res).toEqual({ status: "error", error: "User not found" });
  });
});

describe("getUnlinkedClerkUsers", () => {
  it("returns only Clerk users with no matching Prisma clerkId", async () => {
    mockUsers.getUserList.mockResolvedValue({
      data: [
        {
          id: "user_1",
          firstName: "Linked",
          lastName: "User",
          primaryEmailAddress: { emailAddress: "linked@example.com" },
          emailAddresses: [{ emailAddress: "linked@example.com" }],
        },
        {
          id: "user_2",
          firstName: "Orphan",
          lastName: null,
          primaryEmailAddress: { emailAddress: "orphan@example.com" },
          emailAddresses: [{ emailAddress: "orphan@example.com" }],
        },
      ],
    });
    mockPrisma.user.findMany.mockResolvedValue([{ clerkId: "user_1" }]);

    const res = await getUnlinkedClerkUsers();

    expect(res).toEqual([
      { clerkId: "user_2", name: "Orphan", email: "orphan@example.com" },
    ]);
  });
});

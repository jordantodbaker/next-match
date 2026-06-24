import { describe, expect, it, vi, beforeEach } from "vitest";

const {
  mockUsers,
  mockInvitations,
  mockPrisma,
  mockGetCurrentUser,
  mockClerkAuth,
} = vi.hoisted(() => ({
  mockUsers: {
    updateUser: vi.fn(),
    deleteUser: vi.fn(),
    getUserList: vi.fn(),
    getUser: vi.fn(),
  },
  mockInvitations: { createInvitation: vi.fn() },
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
  mockClerkAuth: vi.fn(),
}));

vi.mock("@clerk/nextjs/server", () => ({
  clerkClient: vi.fn(async () => ({
    users: mockUsers,
    invitations: mockInvitations,
  })),
  auth: mockClerkAuth,
}));
vi.mock("@/lib/prisma", () => ({ prisma: mockPrisma }));
vi.mock("@/auth", () => ({ getCurrentUser: mockGetCurrentUser }));

import {
  getPostLoginPath,
  getCurrentUserProvisioned,
  inviteUser,
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

  it("defaults unprovisioned users to /report", async () => {
    mockGetCurrentUser.mockResolvedValue(null);
    mockClerkAuth.mockResolvedValue({ userId: null });
    expect(await getPostLoginPath()).toBe("/report");
  });
});

describe("getCurrentUserProvisioned", () => {
  it("returns the existing row without touching Clerk", async () => {
    mockGetCurrentUser.mockResolvedValue({ id: 6, securityRole: "USER" });
    expect(await getCurrentUserProvisioned()).toEqual({
      id: 6,
      securityRole: "USER",
    });
    expect(mockUsers.getUser).not.toHaveBeenCalled();
    expect(mockPrisma.user.create).not.toHaveBeenCalled();
  });

  it("provisions a row from invitation metadata on first login", async () => {
    mockGetCurrentUser.mockResolvedValue(null);
    mockClerkAuth.mockResolvedValue({ userId: "user_inv" });
    mockUsers.getUser.mockResolvedValue({
      publicMetadata: { companyId: 21, securityRole: "ADMIN", name: "Invitee" },
      primaryEmailAddress: { emailAddress: "invitee@example.com" },
      emailAddresses: [{ emailAddress: "invitee@example.com" }],
    });
    mockPrisma.user.create.mockResolvedValue({ id: 9 });

    await getCurrentUserProvisioned();

    expect(mockPrisma.user.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          clerkId: "user_inv",
          companyId: 21,
          securityRole: "ADMIN",
          name: "Invitee",
        }),
      })
    );
  });

  it("returns null (no provisioning) when there is no invitation metadata", async () => {
    mockGetCurrentUser.mockResolvedValue(null);
    mockClerkAuth.mockResolvedValue({ userId: "user_x" });
    mockUsers.getUser.mockResolvedValue({ publicMetadata: {} });

    expect(await getCurrentUserProvisioned()).toBeNull();
    expect(mockPrisma.user.create).not.toHaveBeenCalled();
  });
});

describe("inviteUser", () => {
  it("creates a Clerk invitation carrying the company/role metadata", async () => {
    mockInvitations.createInvitation.mockResolvedValue({ id: "inv_1" });

    const res = await inviteUser({
      email: "new@example.com",
      name: "New Person",
      companyId: 21,
      securityRole: "USER" as never,
    });

    expect(res.status).toBe("success");
    expect(mockInvitations.createInvitation).toHaveBeenCalledWith(
      expect.objectContaining({
        emailAddress: "new@example.com",
        publicMetadata: expect.objectContaining({
          companyId: 21,
          securityRole: "USER",
          name: "New Person",
        }),
      })
    );
    expect(mockPrisma.user.create).not.toHaveBeenCalled();
  });
});

describe("saveUser", () => {
  const base = { id: 0, name: "Jordan", email: "jordan@example.com", companyId: 21 };

  it("links an existing Clerk identity", async () => {
    mockPrisma.user.create.mockResolvedValue({ id: 6 });
    const res = await saveUser({ ...base, clerkId: "user_1" } as never);

    expect(res.status).toBe("success");
    expect(mockPrisma.user.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ clerkId: "user_1", companyId: 21 }),
      })
    );
  });

  it("persists securityRole when linking", async () => {
    mockPrisma.user.create.mockResolvedValue({ id: 8 });
    await saveUser({ ...base, clerkId: "user_2", securityRole: "ADMIN" } as never);

    expect(mockPrisma.user.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ securityRole: "ADMIN" }),
      })
    );
  });

  it("rejects creating a brand-new user (must be invited)", async () => {
    const res = await saveUser({ ...base } as never);
    expect(res).toEqual({ status: "error", error: "New users must be invited" });
    expect(mockPrisma.user.create).not.toHaveBeenCalled();
    expect(mockInvitations.createInvitation).not.toHaveBeenCalled();
  });

  it("updates an existing user", async () => {
    mockPrisma.user.findUnique.mockResolvedValue({ id: 5, clerkId: "user_5" });
    mockPrisma.user.update.mockResolvedValue({ id: 5 });
    const res = await saveUser({ ...base, id: 5 } as never);

    expect(res.status).toBe("success");
    expect(mockPrisma.user.update).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: 5 } })
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

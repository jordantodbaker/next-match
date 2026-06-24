"use server";

import { prisma } from "@/lib/prisma";
import { registerSchema, RegisterSchema } from "@/lib/schemas/registerSchema";
import { SecurityRole, User } from "@prisma/client";
import { auth as clerkAuth, clerkClient } from "@clerk/nextjs/server";
import { getCurrentUser } from "@/auth";

/**
 * Returns the current app user, provisioning their Prisma row on first login
 * if they arrived via a Clerk invitation. The invitation carries the intended
 * company/role in `publicMetadata`, which Clerk copies onto the user when they
 * accept — so we can create the linked record here without a webhook. Users
 * who signed up without an invitation (no metadata) return null and fall to
 * the admin "Unassigned sign-ups" section.
 */
export async function getCurrentUserProvisioned(): Promise<User | null> {
  const existing = await getCurrentUser();
  if (existing) return existing;

  const { userId } = await clerkAuth();
  if (!userId) return null;

  const clerk = await clerkClient();
  const clerkUser = await clerk.users.getUser(userId);
  const meta = clerkUser.publicMetadata as {
    companyId?: number;
    securityRole?: SecurityRole;
    name?: string;
  };

  if (!meta?.companyId) return null;

  const email =
    clerkUser.primaryEmailAddress?.emailAddress ??
    clerkUser.emailAddresses[0]?.emailAddress;
  if (!email) return null;

  const name =
    meta.name ||
    [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") ||
    email;

  return prisma.user.create({
    data: {
      name,
      email,
      clerkId: userId,
      companyId: meta.companyId,
      securityRole: meta.securityRole ?? SecurityRole.USER,
    },
  });
}

/**
 * Resolves where a freshly signed-in user should land. Provisions invited
 * users on the way (the role lives in Prisma): ADMIN -> user management,
 * everyone else -> their org's Power BI report.
 */
export async function getPostLoginPath(): Promise<string> {
  const user = await getCurrentUserProvisioned();
  return user?.securityRole === SecurityRole.ADMIN ? "/admin/users" : "/report";
}

/**
 * Invite a brand-new user. Clerk emails them; the Clerk user (and, on first
 * login, the linked Prisma row) is created only when they accept and set their
 * own password. The intended company/role ride along in `publicMetadata`.
 */
export async function inviteUser({
  email,
  name,
  companyId,
  securityRole,
}: {
  email: string;
  name: string;
  companyId: number;
  securityRole: SecurityRole;
}): Promise<ActionResult<string>> {
  try {
    const clerk = await clerkClient();
    await clerk.invitations.createInvitation({
      emailAddress: email,
      redirectUrl: `${process.env.BASE_URL}/sign-up`,
      publicMetadata: { name, companyId, securityRole },
    });
    return { status: "success", data: "Invitation sent" };
  } catch (error) {
    console.error(error);
    return {
      status: "error",
      error:
        "Could not send invitation. They may already be invited or registered.",
    };
  }
}

/**
 * Persists an existing user — either linking an unlinked Clerk identity to a
 * company, or editing an already-linked user. Brand-new users go through
 * `inviteUser`, not here. Passwords are owned entirely by Clerk.
 */
export async function saveUser(
  data: RegisterSchema
): Promise<ActionResult<User>> {
  try {
    const validated = registerSchema.safeParse(data);
    if (!validated.success) {
      return { status: "error", error: validated.error.errors };
    }

    const { id, name, email, securityRole, companyId, clerkId, hasTakenWFPTour } =
      validated.data;

    const clerk = await clerkClient();
    let user: User;

    if (id === 0 && clerkId) {
      // Link an existing (unlinked) Clerk identity to a company.
      user = await prisma.user.create({
        data: { name, email, securityRole, companyId, clerkId, hasTakenWFPTour },
      });
    } else if (id === 0) {
      return { status: "error", error: "New users must be invited" };
    } else {
      // Edit an existing user; keep the Clerk display name in sync.
      const existing = await prisma.user.findUnique({ where: { id } });
      if (existing?.clerkId) {
        await clerk.users.updateUser(existing.clerkId, { firstName: name });
      }
      user = await prisma.user.update({
        where: { id },
        data: { name, email, securityRole, companyId, hasTakenWFPTour },
      });
    }

    return { status: "success", data: user };
  } catch (error) {
    console.error(error);
    return { status: "error", error: "Something went wrong" };
  }
}

export async function getUser(): Promise<ActionResult<User>> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { status: "error", error: "No session user" };
    }
    return { status: "success", data: user };
  } catch (error) {
    console.error(error);
    return { status: "error", error: "Something went wrong" };
  }
}

export async function deleteUser(id: number): Promise<ActionResult<string>> {
  try {
    const existing = await prisma.user.findUnique({ where: { id } });
    if (!existing) {
      return { status: "error", error: "User not found" };
    }

    // Delete the app record first. If it fails (e.g. a required-FK relation),
    // the linked Clerk identity is left intact so the two systems stay in sync.
    await prisma.user.delete({ where: { id } });

    if (existing.clerkId) {
      const clerk = await clerkClient();
      await clerk.users.deleteUser(existing.clerkId);
    }

    return { status: "success", data: "User deleted" };
  } catch (error) {
    console.error(error);
    return {
      status: "error",
      error: "Could not delete user. They may still have related records.",
    };
  }
}

type UnlinkedClerkUser = {
  clerkId: string;
  name: string;
  email: string;
};

/**
 * Clerk users that have no linked Prisma `User` row yet (e.g. someone who
 * signed up through Clerk directly, without an invitation). The admin can
 * assign them a company to finish setting them up.
 */
export async function getUnlinkedClerkUsers(): Promise<UnlinkedClerkUser[]> {
  const clerk = await clerkClient();
  const [{ data: clerkUsers }, prismaUsers] = await Promise.all([
    clerk.users.getUserList({ limit: 200 }),
    prisma.user.findMany({ select: { clerkId: true } }),
  ]);

  const linked = new Set(prismaUsers.map((u) => u.clerkId).filter(Boolean));

  return clerkUsers
    .filter((u) => !linked.has(u.id))
    .map((u) => ({
      clerkId: u.id,
      name: [u.firstName, u.lastName].filter(Boolean).join(" "),
      email:
        u.primaryEmailAddress?.emailAddress ??
        u.emailAddresses[0]?.emailAddress ??
        "",
    }));
}

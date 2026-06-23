"use server";

import { prisma } from "@/lib/prisma";
import { registerSchema, RegisterSchema } from "@/lib/schemas/registerSchema";
import { SecurityRole, User } from "@prisma/client";
import { clerkClient } from "@clerk/nextjs/server";
import { getCurrentUser } from "@/auth";

/**
 * Resolves where a freshly signed-in user should land. The role lives in
 * Prisma (not Clerk), so this has to run server-side: ADMIN -> user
 * management, everyone else -> their org's Power BI report.
 */
export async function getPostLoginPath(): Promise<string> {
  const user = await getCurrentUser();
  return user?.securityRole === SecurityRole.ADMIN ? "/admin/users" : "/report";
}

export async function saveUser(
  data: RegisterSchema
): Promise<ActionResult<User>> {
  try {
    const validated = registerSchema.safeParse(data);

    if (!validated.success) {
      return { status: "error", error: validated.error.errors };
    }

    const {
      id,
      name,
      email,
      address,
      securityRole,
      password,
      companyId,
      clerkId,
      updatePassword,
      hasTakenWFPTour,
    } = validated.data;

    const clerk = await clerkClient();

    let user: User;

    if (id === 0 && clerkId) {
      // Linking an existing Clerk identity (e.g. a self-signed-up user) to a
      // company. The Clerk user already exists, so just create the DB record.
      user = await prisma.user.create({
        data: { name, email, address, securityRole, companyId, clerkId, hasTakenWFPTour },
      });
    } else if (id === 0) {
      // New user: create the Clerk identity first, then the linked DB record.
      if (!password) {
        return { status: "error", error: "Password is required for new users" };
      }

      const clerkUser = await clerk.users.createUser({
        emailAddress: [email],
        password,
        firstName: name,
      });

      user = await prisma.user.create({
        data: {
          name,
          email,
          address,
          securityRole,
          companyId,
          clerkId: clerkUser.id,
          hasTakenWFPTour,
        },
      });
    } else {
      // Existing user: keep the linked Clerk identity in sync.
      const existing = await prisma.user.findUnique({ where: { id } });

      if (existing?.clerkId) {
        await clerk.users.updateUser(existing.clerkId, {
          firstName: name,
          ...(updatePassword && password ? { password } : {}),
        });
      }

      user = await prisma.user.update({
        where: { id },
        data: { name, email, address, securityRole, companyId, hasTakenWFPTour },
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
 * signed up through Clerk directly). These don't belong to a company, so the
 * admin needs to see and assign them.
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
      email: u.primaryEmailAddress?.emailAddress ?? u.emailAddresses[0]?.emailAddress ?? "",
    }));
}

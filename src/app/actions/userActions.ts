"use server";

import { prisma } from "@/lib/prisma";
import { registerSchema, RegisterSchema } from "@/lib/schemas/registerSchema";
import { User } from "@prisma/client";
import { clerkClient } from "@clerk/nextjs/server";
import { getCurrentUser } from "@/auth";

export async function saveUser(
  data: RegisterSchema
): Promise<ActionResult<User>> {
  try {
    const validated = registerSchema.safeParse(data);

    if (!validated.success) {
      return { status: "error", error: validated.error.errors };
    }

    const { id, name, email, password, companyId, updatePassword, hasTakenWFPTour } =
      validated.data;

    const clerk = await clerkClient();

    let user: User;

    if (id === 0) {
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
        data: { name, email, companyId, clerkId: clerkUser.id, hasTakenWFPTour },
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
        data: { name, email, companyId, hasTakenWFPTour },
      });
    }

    return { status: "success", data: user };
  } catch (error) {
    console.log(error);
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
    console.log(error);
    return { status: "error", error: "Something went wrong" };
  }
}

import { auth as clerkAuth } from "@clerk/nextjs/server";
import { cache } from "react";
import { prisma } from "./lib/prisma";
import { User } from "@prisma/client";

/**
 * Returns the application `User` (Prisma) for the currently signed-in Clerk
 * identity, or `null` when signed out / not yet linked.
 *
 * Wrapped in React `cache()` so the Clerk lookup + Prisma query run at most
 * once per request, no matter how many times it's called (the layout and
 * several server actions each call it during a single render).
 */
export const getCurrentUser = cache(async (): Promise<User | null> => {
  const { userId } = await clerkAuth();
  if (!userId) return null;

  return prisma.user.findUnique({ where: { clerkId: userId } });
});

/**
 * Compatibility wrapper that mirrors the old NextAuth `auth()` shape
 * (`{ user }`) so existing server-side call sites keep working unchanged.
 */
export async function auth(): Promise<{ user: User } | null> {
  const user = await getCurrentUser();
  return user ? { user } : null;
}

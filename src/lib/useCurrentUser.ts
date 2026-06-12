"use client";

import { useContext } from "react";
import { UserContext } from "@/components/UserContext";

/**
 * Returns the current application `User` (Prisma) on the client, or `null`
 * when signed out. Backed by `UserContext`, populated server-side in the
 * root layout. Replaces the old NextAuth `useSession()` hook.
 */
export function useCurrentUser() {
  return useContext(UserContext);
}

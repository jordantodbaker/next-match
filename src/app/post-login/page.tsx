import { redirect } from "next/navigation";
import { SecurityRole } from "@prisma/client";
import { getCurrentUser } from "@/auth";

/**
 * Post-login landing decider. Clerk's <SignIn> redirect is static, but the
 * role lives in Prisma — so we route here after login and send the user on
 * by role: ADMIN -> user management, everyone else -> their org's report.
 */
export default async function PostLoginPage() {
  const user = await getCurrentUser();

  if (user?.securityRole === SecurityRole.ADMIN) {
    redirect("/admin/users");
  }

  redirect("/report");
}

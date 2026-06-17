import { redirect } from "next/navigation";
import { SecurityRole } from "@prisma/client";
import { getCurrentUser } from "@/auth";

/**
 * Server-side role gate for the entire `/admin/*` section. The role lives in
 * Prisma (not Clerk), so this can't be done in Edge middleware — a server
 * layout is the enforcement point. Non-admins are redirected to their report.
 */
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (user?.securityRole !== SecurityRole.ADMIN) {
    redirect("/report");
  }

  return <>{children}</>;
}

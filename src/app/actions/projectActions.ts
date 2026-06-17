"use server";

import { prisma } from "@/lib/prisma";
import { SecurityRole } from "@prisma/client";
import { getCurrentUser } from "@/auth";
import { emptyProject } from "@/lib/schemas/defaultModels";

export async function getProjects() {
  const user = await getCurrentUser();

  // Admins see every project — no need to first load the company account
  // (the old code fetched it and then threw it away).
  if (user?.securityRole === SecurityRole.ADMIN) {
    return prisma.project.findMany();
  }

  // Guard against `where: { id: undefined }` (Prisma treats it as no filter).
  if (!user?.companyId) return [emptyProject];

  const companyAccount = await prisma.companyAccount.findFirst({
    where: { id: user.companyId },
    include: { projects: true },
  });

  return companyAccount?.projects ?? [emptyProject];
}
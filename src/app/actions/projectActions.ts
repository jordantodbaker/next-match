"use server";

import { prisma } from "@/lib/prisma";
import { SafetySchema } from "@/lib/schemas/safetySchema";
import { Narrative, NarrativeType, SecurityRole, User } from "@prisma/client";
import { auth } from "@/auth";

export async function getProjects() {
  const session = await auth();
  const user = session?.user;

  const companyAccount = await prisma.companyAccount.findFirst({where: {id: user?.companyId}, include: {projects: true}});
  
  const projects =
    user?.securityRole === SecurityRole.ADMIN && companyAccount
      ? 
          await prisma.project.findMany()
        
      : companyAccount?.projects;
  return projects;
}
"use server";

import { prisma } from "@/lib/prisma";

export async function getCompanies() {
  return await prisma.companyAccount.findMany({
    where: { companyCode: { not: "ACE" } },
  });
}

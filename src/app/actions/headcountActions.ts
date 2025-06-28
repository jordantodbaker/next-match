"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { CompanyAccount, Headcount, Role } from "@prisma/client";
import { hasCustomGetInitialProps } from "next/dist/build/utils";

// export async function getCompanies() {
//   return await prisma.companyAccount.findMany({
//     where: { companyCode: { not: "ACE" } },
//     include: { roles: true },
//   });
// }

export async function getHeadcount() {
  const session = await auth();
  const user = session?.user;
  const company = await prisma.headcount.findFirst({
    where: { id: user?.companyId },
    include: { role: true },
  });

  return [company].filter((c) => !!c);
}

export async function saveHeadcount(headcount: Headcount[]) {
  const session = await auth();
  const user = session?.user;

  const newHeadcounts = headcount.filter((hc) => hc.id === 0);
  const oldHeadcounts = headcount.filter((hc) => hc.id > 0);

  try {
    const data = {
      dayCount: headcount.dayCount,
      nightCount: headcount.nightCount,
      roleId: headcount.roleId,
      companyId: headcount.companyId,
      userId: headcount.userId,
      date: headcount.date,
      projectId: headcount.projectId,
    };
    if (headcount.id === 0) {
      await prisma.headcount.create({
        data: data,
      });
    } else {
      await prisma.headcount.update({
        where: { id: headcount.id },
        data: { ...data, roles: { set: roles.map((r) => ({ id: r.id })) } },
      });
    }
    return { status: "success", data: "Company Saved" };
  } catch (error) {
    return { status: "error", error: "Something went wrong" };
  }
}

export async function deleteCompany(company: CompanyAccount) {
  console.log("DELETING COMPANY: ", company);
  try {
    await prisma.companyAccount.delete({ where: { id: company.id } });
    return { status: "success", data: "Company Delete" };
  } catch (error) {
    return {
      status: "error",
      error: "Save failed. Are there existing narratives with this type?",
    };
  }
}

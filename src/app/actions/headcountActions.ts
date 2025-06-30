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
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const company = await prisma.headcount.findMany({
    where: { companyId: user?.companyId, date: { gte: today } },
    include: { role: true },
  });

  return [company].filter((c) => !!c);
}

export async function saveHeadcount(headcount: Headcount[]) {
  const session = await auth();
  const user = session?.user;

  const newHeadcounts = headcount
    .filter((hc) => hc.id === 0)
    .map((hc) => ({
      dayCount: hc.dayCount,
      nightCount: hc.nightCount,
      roleId: hc.roleId,
      companyId: hc.companyId,
      userId: hc.userId,
      date: hc.date,
      projectId: hc.projectId,
    }));
  const oldHeadcounts = headcount.filter((hc) => hc.id > 0);

  console.log("New: ", newHeadcounts);
  console.log("Old: ", oldHeadcounts);

  try {
    if (newHeadcounts.length > 0) {
      await prisma.headcount.createMany({
        data: newHeadcounts,
      });
    }
    if (oldHeadcounts.length > 0) {
      //   await prisma.headcount.updateMany({
      //     data: oldHeadcounts,
      //   });
      await Promise.all(
        oldHeadcounts.map(
          async (hc) =>
            await prisma.headcount.update({
              where: { id: hc.id },
              data: { ...hc },
            })
        )
      );
    }

    return { status: "success", data: "Company Saved" };
  } catch (error) {
    console.log(error);
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

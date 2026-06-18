"use server";

import { getCurrentUser } from "@/auth";
import { prisma } from "@/lib/prisma";
import { CompanyAccount, Prisma, Project, Role } from "@prisma/client";

// Shared shape for company reads: roles (ordered, with their category) and
// projects. `workforcePlans`/`headcounts` were intentionally dropped — they
// were eagerly loaded on every admin navigation and never read.
const companyInclude = {
  roles: { orderBy: { categoryId: "asc" }, include: { category: true } },
  projects: true,
} satisfies Prisma.CompanyAccountInclude;

export async function getCompanies() {
  return await prisma.companyAccount.findMany({
    where: { companyCode: { not: "ACE" } },
    include: companyInclude,
  });
}

export async function getCompany() {
  const user = await getCurrentUser();
  const companyId = user?.companyId;

  // Guard against `where: { id: undefined }`, which Prisma treats as "no
  // filter" and would return an arbitrary company instead of the user's own.
  const company = companyId
    ? await prisma.companyAccount.findFirst({
        where: { id: companyId },
        include: companyInclude,
      })
    : null;

  return [company].filter((c) => !!c)[0];
}

export async function getCompaniesWithUsers() {
  const companies = await prisma.companyAccount.findMany({
    include: { users: true },
  });

  return companies.filter((c) => !!c);
}

export async function saveCompany(
  company: CompanyAccount,
  roles: Role[],
  projects: Project[]
) {
  try {
    const data = {
      name: company.name,
      companyCode: company.companyCode,
      powerBiUrl: company.powerBiUrl,
      roles: {
        connect: roles.map((r) => ({ id: r.id })),
      },
      projects: {
        connect: projects.map((p) => ({ id: p.id })),
      },
    };
    if (company.id === 0) {
      await prisma.companyAccount.create({
        data: data,
      });
    } else {
      await prisma.companyAccount.update({
        where: { id: company.id },
        data: {
          ...data,
          roles: { set: roles.map((r) => ({ id: r.id })) },
          projects: { set: projects.map((p) => ({ id: p.id })) },
        },
      });
    }
    return { status: "success", data: "Company Saved" };
  } catch (error) {
    return { status: "error", error: "Something went wrong" };
  }
}

export async function deleteCompany(company: CompanyAccount) {
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

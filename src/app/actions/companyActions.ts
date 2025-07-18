"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { CompanyAccount, Project, Role } from "@prisma/client";

export async function getCompanies() {
  return await prisma.companyAccount.findMany({
    where: { companyCode: { not: "ACE" } },
    include: {
      roles: {orderBy: {categoryId: 'asc'}, include: {category: true}},
      projects: true,
      workforcePlans: true,
      headcounts: true,
    },
  });
}

export async function getCompany() {
  const session = await auth();
  const user = session?.user;
  const company = await prisma.companyAccount.findFirst({
    where: { id: user?.companyId },
    include: { roles: {orderBy: {categoryId: 'asc'}, include: {category: true}}, projects: true },
  });

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
  console.log("ROLES: ", roles);
  try {
    const data = {
      name: company.name,
      companyCode: company.companyCode,
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

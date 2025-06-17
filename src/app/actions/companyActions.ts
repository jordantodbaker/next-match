"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { CompanyAccount } from "@prisma/client";

export async function getCompanies() {
  return await prisma.companyAccount.findMany({
    where: { companyCode: { not: "ACE" } },
  });
}


export async function getCompany() {
  const session = await auth();
  const user = session?.user;
  const company = await prisma.companyAccount.findFirst({
    where: { id: user?.companyId },
  });

  return [company].filter(c => !!c)
}

export async function saveNarrativeType(company: any) {
    try{
        if(company.id === 0) {
            //await prisma.narrativeType.create({data: { name: company.name}});
        }
        else {
            //await prisma.narrativeType.update({where: {id: narrativeType.id}, data: {id: narrativeType.id, type: narrativeType.type}});
        }
    return { status: "success", data: "Narrative Saved" };
    } 
    catch (error) {
        return { status: "error", error: "Something went wrong" };
    }
}

export async function deleteCompany(company: CompanyAccount) {
    try{
        await prisma.narrativeType.delete({where: {id: company.id}});
        return { status: "success", data: "Narrative Delete" };
    } 
    catch (error) {
        return { status: "error", error: "Save failed. Are there existing narratives with this type?" };
    }
}

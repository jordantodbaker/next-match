"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { CompanyAccount, Project, Role, RoleCategory } from "@prisma/client";

export async function getCategories() {
  return await prisma.roleCategory.findMany();
}

export async function saveCategory(category: RoleCategory) {
  console.log("SAVING: ", category);
  try {
    const data = {
      name: category.name,
    };
    if (category.id === 0) {
      await prisma.roleCategory.create({
        data: data,
      });
    } else {
      await prisma.roleCategory.update({
        where: { id: category.id },
        data: {
          ...category,
        },
      });
    }
    return { status: "success", data: "Company Saved" };
  } catch (error) {
    return { status: "error", error: "Something went wrong" };
  }
}

export async function deleteCategory(category: RoleCategory) {
  console.log("DELETING COMPANY: ", category);
  try {
    await prisma.roleCategory.delete({ where: { id: category.id } });
    return { status: "success", data: "Company Delete" };
  } catch (error) {
    return {
      status: "error",
      error: "Save failed. Are there existing narratives with this type?",
    };
  }
}

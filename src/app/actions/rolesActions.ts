"use server";

import { prisma } from "@/lib/prisma";
//import { Role } from "@prisma/client";
import { Role } from "@/lib/types";

export async function getRoles() {
  return await prisma.role.findMany({ include: { category: true }, orderBy: [{categoryId: 'asc'}] });
}

export async function saveRole(role: Role) {
  const data = {code: role.code, name: role.name, description: role.description, categoryId: role.categoryId}
  try {
    if (role.id === 0) {
      await prisma.role.create({
        data: data
      });
    } else {
      await prisma.role.update({
        where: { id: role.id },
        data: data,
      });
    }
    return { status: "success", data: "Narrative Saved" };
  } catch (error) {
    console.error(error);
    return { status: "error", error: "Something went wrong" };
  }
}

export async function saveRoles(roles: Role[]) {
  const newRoles = roles.filter((r) => r.id === 0);
  const filteredNewRoles = newRoles.map((r) => ({
    name: r.name,
    code: r.code,
    categoryId: r.categoryId,
    description: r.description
  }));
  const existingRoles = roles.filter((r) => r.id !== 0);
  try {
    if (filteredNewRoles.length > 0) {
      await prisma.role.createMany({ data: filteredNewRoles });
    }
    if (existingRoles.length > 0) {
      await prisma.role.updateMany({ data: existingRoles });
    }
    return { status: "success", data: "Narrative Saved" };
  } catch (error) {
    console.error(error);
    return { status: "error", error: "Something went wrong" };
  }
}

export async function deleteRole(role: Role) {
  try {
    await prisma.role.delete({ where: { id: role.id } });
    return { status: "success", data: "Narrative Delete" };
  } catch (error) {
    console.error(error);
    return {
      status: "error",
      error: "Save failed. Are there existing narratives with this type?",
    };
  }
}

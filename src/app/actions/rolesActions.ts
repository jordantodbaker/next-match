"use server";

import { prisma } from "@/lib/prisma";
import { NarrativeType, Role } from "@prisma/client";

export async function getRoles() {
  return await prisma.role.findMany({orderBy: {isDirect: 'asc'}});
}

export async function saveRoles(roles: Role[]) {
    const newRoles = roles.filter(r => r.id === 0);
    const filteredNewRoles = newRoles.map(r => ({name: r.name, code: r.code, projectId: r.projectId}))
    const existingRoles = roles.filter(r => r.id !== 0);
    try{
        if(filteredNewRoles.length > 0) {
            await prisma.role.createMany({data: filteredNewRoles});
        }
        if(existingRoles.length > 0) {
            await prisma.role.updateMany({data: existingRoles});
        }
    return { status: "success", data: "Narrative Saved" };
    } 
    catch (error) {
        console.log(error);
        return { status: "error", error: "Something went wrong" };
    }
}

export async function deleteRole(role: Role) {
    try{
        await prisma.role.delete({where: {id: role.id}});
        return { status: "success", data: "Narrative Delete" };
    } 
    catch (error) {
        console.log(error)
        return { status: "error", error: "Save failed. Are there existing narratives with this type?" };
    }
}


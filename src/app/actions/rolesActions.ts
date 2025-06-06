"use server";

import { prisma } from "@/lib/prisma";
import { NarrativeType } from "@prisma/client";

export async function getRoles() {
  return await prisma.narrativeType.findMany();
}

export async function saveRoles(narrativeType: NarrativeType) {
    try{
        if(narrativeType.id === 0) {
            await prisma.narrativeType.create({data: { type: narrativeType.type}});
        }
        else {
            await prisma.narrativeType.update({where: {id: narrativeType.id}, data: {id: narrativeType.id, type: narrativeType.type}});
        }
    return { status: "success", data: "Narrative Saved" };
    } 
    catch (error) {
        return { status: "error", error: "Something went wrong" };
    }
}

export async function deleteRole(narrativeType: NarrativeType) {
    console.log(narrativeType)
    try{
        await prisma.narrativeType.delete({where: {id: narrativeType.id}});
        return { status: "success", data: "Narrative Delete" };
    } 
    catch (error) {
        return { status: "error", error: "Save failed. Are there existing narratives with this type?" };
    }
}


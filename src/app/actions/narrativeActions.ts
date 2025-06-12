"use server";

import { prisma } from "@/lib/prisma";
import { SafetySchema } from "@/lib/schemas/safetySchema";
import { Narrative, NarrativeType, User } from "@prisma/client";
import { auth } from "@/auth";

export async function submitNarrative(
  data: {narrative: Narrative}
): Promise<ActionResult<string>> {
  const session = await auth();
  const user = session?.user as User | undefined;

  try {
    if (data.narrative.id !== 0) {
      console.log("Update", data);
      await prisma.narrative.update({
        where: { id: data.narrative.id },
        data: {
          userId: user?.id,
          narrative: data.narrative.narrative,
          narrativeTypeId: data.narrative.narrativeTypeId,
          companyId: data.narrative.companyId
        },
      });
    } else {
      console.log("New narrative", data);
      await prisma.narrative.create({
        data: {
          userId: user?.id,
          narrative: data.narrative.narrative,
          narrativeTypeId: data.narrative.narrativeTypeId,
          companyId: data.narrative.companyId
        },
      });
    }
    return { status: "success", data: "Narrative Submitted" };
  } catch (error) {
    if (error) {
      switch (error) {
        case "CredentialsSignin":
          return { status: "error", error: "Invalid credentials" };
        default:
          return { status: "error", error: "Something went wrong" };
      }
    } else {
      return { status: "error", error: "Something else went wrong" };
    }
  }
}

export async function getNarratives() {
  const session = await auth();

  const user = session?.user;
  const narratives =
    user?.securityRole === "USER"
      ? 
          await prisma.narrative.findMany({
            where: { companyId: user?.companyId },
          })
        
      : await prisma.narrative.findMany();
  return narratives;
}

export async function getNarrativeTypes() {
  return await prisma.narrativeType.findMany();
}

export async function authorizeNarrative(narrative: Narrative) {
  try{
    const result = await prisma.narrative.update({
      where: { id: narrative.id },
      data: { authorized: !narrative.authorized },
  });
    return { status: "success", data: "Narrative Deleted" };
  }catch (error) {
      return { status: "error", error: "Something else went wrong" };
    }
}

export async function deleteNarrative(narrative: Narrative) {
  try{
    await prisma.narrative.delete({where: {id: narrative.id}})
    return { status: "success", data: "Narrative Deleted" };
  } catch (error) {
      return { status: "error", error: "Something else went wrong" };
  }
}

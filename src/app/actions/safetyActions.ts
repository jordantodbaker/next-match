"use server";

import { prisma } from "@/lib/prisma";
import { SafetySchema } from "@/lib/schemas/safetySchema";
import { Narrative, User } from "@prisma/client";
import { auth } from "@/auth";

export async function submitNarrative(
  data: SafetySchema
): Promise<ActionResult<string>> {
  const session = await auth();
  const user = session?.user as User | undefined;

  const narratives = await prisma.safetyNarrative.findFirst({
    where: { id: data.id },
  });

  try {
    if (narratives) {
      console.log("Update", data);
      await prisma.safetyNarrative.update({
        where: { id: data.id },
        data: {
          userId: user?.id,
          narrative: data.narrative,
          companyId: data.companyId,
        },
      });
    } else {
      console.log("New narrative", data);
      await prisma.safetyNarrative.create({
        data: {
          userId: user?.id,
          companyId: user?.companyId,
          narrative: data.narrative,
        },
      });
    }
    return { status: "success", data: "Narrative Submitted" };
  } catch (error) {
    console.log(error);
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
  if (!user) return [];
  else {
    const narratives =
      user.role === "USER"
        ? [
            await prisma.safetyNarrative.findFirst({
              where: { companyId: user.companyId },
            }),
          ]
        : await prisma.safetyNarrative.findMany();
    return narratives;
  }
}

export async function authorizeNarrative(narrative: Narrative) {
  const result = await prisma.safetyNarrative.update({
    where: { id: narrative.id },
    data: { authorized: !narrative.authorized },
  });
  return result;
}

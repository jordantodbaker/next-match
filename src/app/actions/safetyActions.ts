"use server";

import { prisma } from "@/lib/prisma";
import { SafetySchema } from "@/lib/schemas/safetySchema";
import { User } from "@prisma/client";

export async function submitNarrative(
  data: SafetySchema
): Promise<ActionResult<string>> {
  try {
    console.log(data);
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

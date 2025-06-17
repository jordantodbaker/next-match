import { prisma } from "@/lib/prisma";
import { SafetySchema } from "@/lib/schemas/safetySchema";
import { Narrative, NarrativeType, SecurityRole, User } from "@prisma/client";
import { auth } from "@/auth";

export async function submitWorkforcePlan(
  data: any
): Promise<ActionResult<string>> {
  const session = await auth();
  const user = session?.user as User | undefined;

  const workforcePlan = JSON.parse(data.get("workforcePlan"));
  const company = JSON.parse(data.get("company"));
  const project = JSON.parse(data.get("project"));

  const existingWFP = await prisma.workforcePlan.findFirst({where: {companyId: company.id, projectId: project.id}});

  const dates = workforcePlan.map((p: any) => ([...p.weekdays.map((w: any) => ({
    ...w,
    projectId: project.id,
    companyId: company.id
  })) ])).flat()

  console.log('WFPS TO GO => ', workforcePlan)
  

  if(existingWFP){
    console.log('--------------------------------------------------------');
    console.log('UPDATE');
    console.log('--------------------------------------------------------');
    await Promise.all(dates.map(async (date: any) => await prisma.workforcePlan.update({where: {id: date.id}, data: {...date}})));
  } else {
    console.log('--------------------------------------------------------');
    console.log('CREATE');
    console.log('--------------------------------------------------------');
    await prisma.workforcePlan.createMany({data: dates});
  }


  //   try {
  //     if (data.narrative.id !== 0) {
  //       console.log("Update", data);
  //       await prisma.narrative.update({
  //         where: { id: data.narrative.id },
  //         data: {
  //           userId: user?.id,
  //           narrative: data.narrative.narrative,
  //           narrativeTypeId: data.narrative.narrativeTypeId,
  //           companyId: data.narrative.companyId
  //         },
  //       });
  //     } else {
  //       console.log("New narrative", data);
  //       await prisma.narrative.create({
  //         data: {
  //           userId: user?.id,
  //           narrative: data.narrative.narrative,
  //           narrativeTypeId: data.narrative.narrativeTypeId,
  //           companyId: data.narrative.companyId
  //         },
  //       });
  //     }
  //     return { status: "success", data: "Narrative Submitted" };
  //   } catch (error) {
  //     if (error) {
  //       switch (error) {
  //         case "CredentialsSignin":
  //           return { status: "error", error: "Invalid credentials" };
  //         default:
  //           return { status: "error", error: "Something went wrong" };
  //       }
  //     } else {
  //       return { status: "error", error: "Something else went wrong" };
  //     }
  //   }
  return { status: "error", error: "Something else went wrong" };
}

export async function getWorkforcePlans(){
  const session = await auth();
  const user = session?.user;

  return user?.securityRole === SecurityRole.ADMIN ? await prisma.workforcePlan.findMany({}) : await prisma.workforcePlan.findMany({ where: {companyId: user?.companyId}});
}
import { prisma } from "@/lib/prisma";
import { registerSchema, RegisterSchema } from "@/lib/schemas/registerSchema";
import { User } from "@prisma/client";
import { auth } from "@/auth";
import bcrypt from "bcryptjs";

export async function saveUser(
  data: RegisterSchema
): Promise<ActionResult<User>> {
  try {
    const validated = registerSchema.safeParse(data);

    if (!validated.success) {
      return { status: "error", error: validated.error.errors };
    }

    const { id, name, email, passwordHash, companyId, updatePassword, hasTakenWFPTour } =
      validated.data;

    let saveData = {
      name,
      email,
      companyId,
      hasTakenWFPTour
    } as any;

    if (id === 0 || updatePassword) {
      const hash = await bcrypt.hash(passwordHash, 10);
      saveData = { ...saveData, passwordHash: hash };
    }

    let user;

    if (id === 0) {
      user = await prisma.user.create({
        data: saveData,
      });
    } else {
      user = await prisma.user.update({ where: { id: id }, data: saveData });
    }

    return { status: "success", data: user };
  } catch (error) {
    console.log(error);
    return { status: "error", error: "Something went wrong" };
  }
}

export async function getUser(): Promise<ActionResult<User>> {
  try {
    const session = await auth();
    const sessionUser = session?.user as User | undefined;
    if(!sessionUser){
      return { status: "error", error: "No session user" }; 
    }

    const user = await prisma.user.findUnique({where: {id: sessionUser.id}})

    if(!user){
      return { status: "error", error: "No user found" }; 
    }

    return { status: "success", data: user };
  } catch (error) {
    console.log(error);
    return { status: "error", error: "Something went wrong" };
  }
}

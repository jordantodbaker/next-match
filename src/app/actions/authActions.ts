'use server';

import { prisma } from "@/lib/prisma";
import { registerSchema, RegisterSchema } from "@/lib/schemas/registerSchema";
import bcrypt from 'bcryptjs';

export async function registerUser(data: RegisterSchema) {
    const validated = registerSchema.safeParse(data);

    if (!validated.success) {
        return {error: validated.error.errors}
    }

    const {name, email, password} = validated.data;

    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await prisma.user.findUnique({where: {email}});

    if(existingUser) return {error: 'User already exists'}

    return prisma.user.create({
        data: {
            name,
            email,
            passwordHash: hashedPassword
        }
    });
}
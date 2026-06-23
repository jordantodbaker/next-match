import { z } from "zod";
import { SecurityRole } from "@prisma/client";

export const registerSchema = z.object({
  id: z.number(),
  name: z.string().min(3),
  email: z.string().email(),
  address: z.string().optional(),
  securityRole: z.nativeEnum(SecurityRole).optional(),
  password: z
    .string()
    .min(6, { message: "Must be at least 6 characters" })
    .optional()
    .or(z.literal("")),
  companyId: z.number(),
  // Present when linking an already-existing Clerk identity (e.g. a user who
  // self-signed-up) to a company, rather than creating a brand-new Clerk user.
  clerkId: z.string().optional(),
  updatePassword: z.boolean().optional(),
  hasTakenWFPTour: z.boolean().optional(),
});

export type RegisterSchema = z.infer<typeof registerSchema>;

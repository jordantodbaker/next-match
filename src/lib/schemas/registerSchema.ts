import { z } from "zod";
import { SecurityRole } from "@prisma/client";

export const registerSchema = z.object({
  id: z.number(),
  name: z.string().min(3),
  email: z.string().email(),
  securityRole: z.nativeEnum(SecurityRole).optional(),
  companyId: z.number(),
  // Present when linking an already-existing Clerk identity (e.g. a user who
  // self-signed-up) to a company, rather than creating a brand-new Clerk user.
  clerkId: z.string().optional(),
  hasTakenWFPTour: z.boolean().optional(),
});

export type RegisterSchema = z.infer<typeof registerSchema>;

import { z } from "zod";

export const registerSchema = z.object({
  id: z.number(),
  name: z.string().min(3),
  email: z.string().email(),
  password: z
    .string()
    .min(6, { message: "Must be at least 6 characters" })
    .optional()
    .or(z.literal("")),
  companyId: z.number(),
  updatePassword: z.boolean().optional(),
  hasTakenWFPTour: z.boolean().optional(),
});

export type RegisterSchema = z.infer<typeof registerSchema>;

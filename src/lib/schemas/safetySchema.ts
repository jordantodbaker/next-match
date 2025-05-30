import { z } from "zod";

export const safetySchema = z.object({
  narrative: z.string().min(2),
  id: z.number(),
  companyId: z.number(),
});

export type SafetySchema = z.infer<typeof safetySchema>;

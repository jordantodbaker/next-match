import { z } from "zod";

export const safetySchema = z.object({
  narrative: z.string().min(2),
});

export type SafetySchema = z.infer<typeof safetySchema>;

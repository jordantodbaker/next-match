import { z } from "zod";

export const userSchema = z.object({
  name: z.string().min(2, { message: "Must be at least 2 characters" }),
  email: z.string().email(),
  password: z
    .string()
    .min(6, { message: "Must be at least 6 characters" })
    .optional()
    .or(z.literal("")),
});

export type LoginSchema = z.infer<typeof userSchema>;

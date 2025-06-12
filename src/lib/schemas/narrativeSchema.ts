import {z} from 'zod';

export const narrativeSchema = z.object({
    narratives: z.array(z.object({
        narrative: z.object({
            id: z.number(),
            narrative: z.string(),
            userId: z.number(),
            companyId: z.number(),
            authorized: z.boolean(),
            updatedAt: z.date(),
            narrativeTypeId: z.number(),
        }),
        narrativeType: z.object({
            id: z.number(),
            type: z.string().min(1, "Please selected a narrative type")
        })

}))})

export type NarrativeSchema = z.infer<typeof narrativeSchema>
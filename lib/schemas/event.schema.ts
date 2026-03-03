import { z } from "zod"

export const eventFormSchema = z.object({
    name: z
        .string()
        .min(1, "Nome é obrigatório")
        .max(100, "Máximo de 100 caracteres"),
    date: z.string().min(1, "Data é obrigatória"),
    location: z
        .string()
        .min(1, "Local é obrigatório")
        .max(200, "Máximo de 200 caracteres"),
    status: z.enum(["Ativo", "Encerrado"]),
    description: z
        .string()
        .max(500, "Máximo de 500 caracteres")
        .optional()
        .default(""),
})

export type EventFormData = z.infer<typeof eventFormSchema>

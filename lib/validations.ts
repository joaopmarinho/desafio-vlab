import { z } from "zod"

export const eventSchema = z.object({
    name: z.string().min(1, "Nome é obrigatório").max(100, "Máximo de 100 caracteres"),
    date: z.string().min(1, "Data é obrigatória"),
    location: z.string().min(1, "Local é obrigatório").max(200, "Máximo de 200 caracteres"),
    status: z.enum(["Ativo", "Encerrado"]),
    description: z.string().max(500, "Máximo de 500 caracteres").optional().default(""),
})

export type EventFormData = z.infer<typeof eventSchema>

export const participantSchema = z.object({
    name: z.string().min(1, "Nome é obrigatório").max(100, "Máximo de 100 caracteres"),
    email: z.string().min(1, "E-mail é obrigatório").email("E-mail inválido"),
    eventId: z.string().min(1, "Selecione um evento"),
})

export type ParticipantFormData = z.infer<typeof participantSchema>

export const loginSchema = z.object({
    email: z.string().min(1, "O e-mail é obrigatório").email("E-mail inválido"),
    password: z.string().min(1, "A senha é obrigatória"),
})

export type LoginFormData = z.infer<typeof loginSchema>

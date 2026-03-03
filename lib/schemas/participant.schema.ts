import { z } from "zod"

export const participantFormSchema = z.object({
    name: z
        .string()
        .min(1, "Nome é obrigatório")
        .max(100, "Máximo de 100 caracteres"),
    email: z
        .string()
        .min(1, "E-mail é obrigatório")
        .email("E-mail inválido"),
    eventId: z.string().min(1, "Selecione um evento"),
})

export type ParticipantFormData = z.infer<typeof participantFormSchema>

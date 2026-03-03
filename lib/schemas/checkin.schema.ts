import { z } from "zod"

export const checkinRuleSchema = z.object({
    id: z.string(),
    eventId: z.string(),
    name: z.string().min(1, "Nome da regra é obrigatório"),
    enabled: z.boolean(),
    required: z.boolean(),
    minutesBefore: z.number().min(0, "O valor deve ser >= 0"),
    minutesAfter: z.number().min(0, "O valor deve ser >= 0"),
})

export type CheckinRuleFormData = z.infer<typeof checkinRuleSchema>

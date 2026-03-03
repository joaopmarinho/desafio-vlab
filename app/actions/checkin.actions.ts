"use server"

import { api } from "@/lib/api"
import type { CheckinRule } from "@/lib/types"
import type { ActionResult } from "./event.actions"

export async function updateCheckinRulesAction(
    eventId: string,
    rules: CheckinRule[]
): Promise<ActionResult<CheckinRule[]>> {
    try {
        const saved = await api.updateCheckinRules(eventId, rules)
        return { success: true, data: saved }
    } catch {
        return { success: false, error: "Erro ao salvar regras de check-in" }
    }
}

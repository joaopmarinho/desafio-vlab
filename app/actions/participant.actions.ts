"use server"

import { participantFormSchema } from "@/lib/schemas/participant.schema"
import { api } from "@/lib/api"
import type { ActionResult } from "./event.actions"

export async function createParticipantAction(
    raw: Record<string, unknown>
): Promise<ActionResult> {
    const parsed = participantFormSchema.safeParse(raw)
    if (!parsed.success) {
        return {
            success: false,
            error: "Dados inválidos",
            fieldErrors: parsed.error.flatten().fieldErrors as Record<
                string,
                string[]
            >,
        }
    }

    try {
        await api.createParticipant({
            ...parsed.data,
            checkedIn: false,
            eventName: "",
        })
        return { success: true, data: undefined }
    } catch {
        return { success: false, error: "Erro ao cadastrar participante" }
    }
}

export async function updateParticipantAction(
    id: string,
    raw: Record<string, unknown>
): Promise<ActionResult> {
    const parsed = participantFormSchema.safeParse(raw)
    if (!parsed.success) {
        return {
            success: false,
            error: "Dados inválidos",
            fieldErrors: parsed.error.flatten().fieldErrors as Record<
                string,
                string[]
            >,
        }
    }

    try {
        await api.updateParticipant(id, parsed.data)
        return { success: true, data: undefined }
    } catch {
        return { success: false, error: "Erro ao atualizar participante" }
    }
}

export async function deleteParticipantAction(
    id: string
): Promise<ActionResult> {
    try {
        await api.deleteParticipant(id)
        return { success: true, data: undefined }
    } catch {
        return { success: false, error: "Erro ao remover participante" }
    }
}

export async function toggleCheckinAction(
    id: string,
    currentCheckedIn: boolean
): Promise<ActionResult> {
    try {
        await api.updateParticipant(id, { checkedIn: !currentCheckedIn })
        return { success: true, data: undefined }
    } catch {
        return { success: false, error: "Erro ao atualizar check-in" }
    }
}

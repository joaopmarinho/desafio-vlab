"use server"

import { eventFormSchema } from "@/lib/schemas/event.schema"
import { api } from "@/lib/api"

export type ActionResult<T = void> =
    | { success: true; data: T }
    | { success: false; error: string; fieldErrors?: Record<string, string[]> }

export async function createEventAction(
    raw: Record<string, unknown>
): Promise<ActionResult> {
    const parsed = eventFormSchema.safeParse(raw)
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
        await api.createEvent(parsed.data)
        return { success: true, data: undefined }
    } catch {
        return { success: false, error: "Erro ao criar evento" }
    }
}

export async function updateEventAction(
    id: string,
    raw: Record<string, unknown>
): Promise<ActionResult> {
    const parsed = eventFormSchema.safeParse(raw)
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
        await api.updateEvent(id, parsed.data)
        return { success: true, data: undefined }
    } catch {
        return { success: false, error: "Erro ao atualizar evento" }
    }
}

export async function deleteEventAction(id: string): Promise<ActionResult> {
    try {
        await api.deleteEvent(id)
        return { success: true, data: undefined }
    } catch {
        return { success: false, error: "Erro ao remover evento" }
    }
}

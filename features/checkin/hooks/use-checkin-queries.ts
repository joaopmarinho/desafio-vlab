"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/api"
import type { CheckinRule } from "@/lib/types"
import { toast } from "sonner"

export const checkinKeys = {
    all: ["checkin"] as const,
    rules: (eventId: string) =>
        [...checkinKeys.all, "rules", eventId] as const,
}

export function useCheckinRulesQuery(eventId: string) {
    return useQuery({
        queryKey: checkinKeys.rules(eventId),
        queryFn: () => api.getCheckinRules(eventId),
        enabled: !!eventId,
    })
}

export function useSaveCheckinRules() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({
            eventId,
            rules,
        }: {
            eventId: string
            rules: CheckinRule[]
        }) => api.updateCheckinRules(eventId, rules),
        onSuccess: (_data, { eventId }) => {
            queryClient.invalidateQueries({
                queryKey: checkinKeys.rules(eventId),
            })
            toast.success("Regras de check-in salvas com sucesso!")
        },
        onError: () => {
            toast.error("Erro ao salvar regras")
        },
    })
}

"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/api"
import type { Event } from "@/lib/types"
import { toast } from "sonner"

export const eventKeys = {
    all: ["events"] as const,
    list: () => [...eventKeys.all, "list"] as const,
    detail: (id: string) => [...eventKeys.all, "detail", id] as const,
}

export function useEvents() {
    return useQuery({
        queryKey: eventKeys.list(),
        queryFn: () => api.getEvents(),
    })
}

export function useCreateEvent() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: Omit<Event, "id">) => api.createEvent(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: eventKeys.all })
            toast.success("Evento criado com sucesso!")
        },
        onError: () => {
            toast.error("Erro ao criar evento")
        },
    })
}

export function useUpdateEvent() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<Event> }) =>
            api.updateEvent(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: eventKeys.all })
            toast.success("Evento atualizado com sucesso!")
        },
        onError: () => {
            toast.error("Erro ao atualizar evento")
        },
    })
}

export function useDeleteEvent() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: string) => api.deleteEvent(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: eventKeys.all })
            toast.success("Evento removido com sucesso!")
        },
        onError: () => {
            toast.error("Erro ao remover evento")
        },
    })
}

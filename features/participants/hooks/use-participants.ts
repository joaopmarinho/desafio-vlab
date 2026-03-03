"use client"

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/api"
import type { Participant } from "@/lib/types"
import { toast } from "sonner"

export const participantKeys = {
    all: ["participants"] as const,
    list: () => [...participantKeys.all, "list"] as const,
}

export function useParticipants() {
    return useQuery({
        queryKey: participantKeys.list(),
        queryFn: () => api.getParticipants(),
    })
}

export function useCreateParticipant() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: Omit<Participant, "id">) =>
            api.createParticipant(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: participantKeys.all })
            toast.success("Participante cadastrado com sucesso!")
        },
        onError: () => {
            toast.error("Erro ao cadastrar participante")
        },
    })
}

export function useUpdateParticipant() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({
            id,
            data,
        }: {
            id: string
            data: Partial<Participant>
        }) => api.updateParticipant(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: participantKeys.all })
        },
        onError: () => {
            toast.error("Erro ao atualizar participante")
        },
    })
}

export function useDeleteParticipant() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: string) => api.deleteParticipant(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: participantKeys.all })
            toast.success("Participante removido com sucesso!")
        },
        onError: () => {
            toast.error("Erro ao remover participante")
        },
    })
}

export function useToggleCheckin() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (participant: Participant) =>
            api.updateParticipant(participant.id, {
                checkedIn: !participant.checkedIn,
            }),
        onSuccess: (_data, participant) => {
            queryClient.invalidateQueries({ queryKey: participantKeys.all })
            toast.success(
                participant.checkedIn ? "Check-in desfeito" : "Check-in realizado!"
            )
        },
        onError: () => {
            toast.error("Erro ao atualizar check-in")
        },
    })
}

"use client"

import { ErrorCard } from "@/components/shared/error-card"

export default function ParticipantesError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    return (
        <ErrorCard
            title="Erro ao carregar participantes"
            message={error.message}
            onRetry={reset}
        />
    )
}

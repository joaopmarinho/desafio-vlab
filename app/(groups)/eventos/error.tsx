"use client"

import { ErrorCard } from "@/components/shared/error-card"

export default function EventosError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    return (
        <ErrorCard
            title="Erro ao carregar eventos"
            message={error.message}
            onRetry={reset}
        />
    )
}

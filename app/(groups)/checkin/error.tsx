"use client"

import { ErrorCard } from "@/components/shared/error-card"

export default function CheckinError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    return (
        <ErrorCard
            title="Erro ao carregar check-in"
            message={error.message}
            onRetry={reset}
        />
    )
}

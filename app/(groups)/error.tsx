"use client"

import { ErrorCard } from "@/components/shared/error-card"

export default function DashboardError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    return (
        <ErrorCard
            title="Erro ao carregar o dashboard"
            message={error.message}
            onRetry={reset}
        />
    )
}

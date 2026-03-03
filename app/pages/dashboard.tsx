"use client"

import { useDashboard } from "@/features/dashboard"
import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { UpcomingEvents } from "@/components/dashboard/upcoming-events"
import { RecentCheckins } from "@/components/dashboard/recent-checkins"
import { DashboardSkeleton } from "@/components/dashboard/dashboard-skeleton"

import { ErrorCard } from "@/components/shared/error-card"

export default function DashboardPage() {
    const { data, isLoading, error, refetch } = useDashboard()

    if (isLoading) {
        return <DashboardSkeleton />
    }

    if (error || !data) {
        return (
            <ErrorCard
                title="Erro ao carregar dados"
                message={error?.message || "Dados indisponíveis"}
                onRetry={() => refetch()}
            />
        )
    }

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground">Dashboard</h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Resumo geral do sistema de eventos
                </p>
            </div>
            <DashboardStats
                totalEvents={data.totalEvents}
                totalParticipants={data.totalParticipants}
                checkinCount={data.checkinCount}
                pendingCheckins={data.pendingCheckins}
            />
            <div className="grid gap-6 lg:grid-cols-2">
                <UpcomingEvents events={data.upcomingEvents} />
                <RecentCheckins checkins={data.recentCheckins} />
            </div>
        </div>
    )
}

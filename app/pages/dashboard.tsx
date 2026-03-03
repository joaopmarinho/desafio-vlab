import { useEffect, useState, useCallback } from "react"
import { api } from "@/lib/api"
import type { DashboardData } from "@/lib/types"
import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { UpcomingEvents } from "@/components/dashboard/upcoming-events"
import { RecentCheckins } from "@/components/dashboard/recent-checkins"
import { DashboardSkeleton } from "@/components/dashboard/dashboard-skeleton"
import { CheckinChart } from "@/components/dashboard/checkin-chart"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle, RefreshCw } from "lucide-react"

export default function DashboardPage() {
    const [data, setData] = useState<DashboardData | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const load = useCallback(async () => {
        setIsLoading(true)
        setError(null)
        try {
            const dashboard = await api.getDashboard()
            setData(dashboard)
        } catch {
            setError("Não foi possível carregar os dados do dashboard.")
        } finally {
            setIsLoading(false)
        }
    }, [])

    useEffect(() => {
        load()
    }, [load])

    if (isLoading) {
        return <DashboardSkeleton />
    }

    if (error || !data) {
        return (
            <Card>
                <CardContent className="flex flex-col items-center justify-center py-16">
                    <div className="flex items-center justify-center h-12 w-12 rounded-full bg-destructive/10 mb-3">
                        <AlertTriangle className="h-6 w-6 text-destructive" />
                    </div>
                    <p className="text-sm font-medium text-foreground">Erro ao carregar dados</p>
                    <p className="text-xs text-muted-foreground mt-1">
                        {error || "Dados indisponíveis"}
                    </p>
                    <Button variant="outline" size="sm" className="mt-4" onClick={load}>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Tentar novamente
                    </Button>
                </CardContent>
            </Card>
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
                attendanceRate={data.attendanceRate}
            />
            <div className="grid gap-6 lg:grid-cols-2">
                <UpcomingEvents events={data.upcomingEvents} />
                <RecentCheckins checkins={data.recentCheckins} />
            </div>
            <CheckinChart
                checkinCount={data.checkinCount}
                totalParticipants={data.totalParticipants}
            />
        </div>
    )
}

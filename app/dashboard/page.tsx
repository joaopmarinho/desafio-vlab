"use client"

import { useEffect, useState } from "react"
import { api } from "@/lib/api"
import type { DashboardData } from "@/lib/types"
import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { UpcomingEvents } from "@/components/dashboard/upcoming-events"
import { RecentCheckins } from "@/components/dashboard/recent-checkins"
import { DashboardSkeleton } from "@/components/dashboard/dashboard-skeleton"

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const dashboard = await api.getDashboard()
        setData(dashboard)
      } finally {
        setIsLoading(false)
      }
    }
    load()
  }, [])

  if (isLoading || !data) {
    return <DashboardSkeleton />
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Resumo geral do sistema de eventos
        </p>
      </div>
      <DashboardStats totalEvents={data.totalEvents} totalParticipants={data.totalParticipants} />
      <div className="grid gap-6 lg:grid-cols-2">
        <UpcomingEvents events={data.upcomingEvents} />
        <RecentCheckins checkins={data.recentCheckins} />
      </div>
    </div>
  )
}

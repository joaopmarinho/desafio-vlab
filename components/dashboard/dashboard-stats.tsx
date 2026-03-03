"use client"

import { Calendar, Users, CheckCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface DashboardStatsProps {
  totalEvents: number
  totalParticipants: number
  checkinCount: number
}

const statConfig = [
  {
    key: "events",
    label: "Total de Eventos",
    icon: Calendar,
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    key: "participants",
    label: "Total de Participantes",
    icon: Users,
    color: "text-chart-2",
    bgColor: "bg-chart-2/10",
  },
  {
    key: "checkins",
    label: "Check-ins Feitos",
    icon: CheckCircle,
    color: "text-success",
    bgColor: "bg-success/10",
  },
]

export function DashboardStats({
  totalEvents,
  totalParticipants,
  checkinCount,
}: DashboardStatsProps) {
  const values: Record<string, string> = {
    events: String(totalEvents),
    participants: String(totalParticipants),
    checkins: String(checkinCount),
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {statConfig.map((stat) => (
        <Card key={stat.key}>
          <CardContent className="flex items-center gap-4 p-5">
            <div className={`flex items-center justify-center h-10 w-10 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-foreground">{values[stat.key]}</span>
              <span className="text-xs text-muted-foreground">{stat.label}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

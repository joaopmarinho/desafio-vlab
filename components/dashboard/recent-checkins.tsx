"use client"

import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { CheckCircle, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface RecentCheckinsProps {
  checkins: {
    id: string
    participantName: string
    eventName: string
    time: string
  }[]
}

export function RecentCheckins({ checkins }: RecentCheckinsProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <CheckCircle className="h-4 w-4 text-success" />
          Check-ins Recentes
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {checkins.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">
            Nenhum check-in recente
          </p>
        ) : (
          checkins.map((checkin) => (
            <div
              key={checkin.id}
              className="flex items-center gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-accent/50"
            >
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-success/10 shrink-0">
                <CheckCircle className="h-4 w-4 text-success" />
              </div>
              <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                <span className="text-sm font-medium text-foreground truncate">
                  {checkin.participantName}
                </span>
                <span className="text-xs text-muted-foreground truncate">
                  {checkin.eventName}
                </span>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground shrink-0">
                <Clock className="h-3 w-3" />
                <span>{format(new Date(checkin.time), "dd/MM HH:mm", { locale: ptBR })}</span>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}

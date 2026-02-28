"use client"

import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Calendar, MapPin } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface UpcomingEventsProps {
  events: {
    id: string
    name: string
    date: string
    location: string
  }[]
}

export function UpcomingEvents({ events }: UpcomingEventsProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base font-semibold">
          <Calendar className="h-4 w-4 text-primary" />
          Próximos Eventos
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {events.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">
            Nenhum evento agendado
          </p>
        ) : (
          events.map((event) => (
            <div
              key={event.id}
              className="flex items-start gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-accent/50"
            >
              <div className="flex flex-col items-center justify-center rounded-md bg-primary/10 px-2.5 py-1.5 min-w-[52px]">
                <span className="text-xs font-medium text-primary uppercase">
                  {format(new Date(event.date), "MMM", { locale: ptBR })}
                </span>
                <span className="text-lg font-bold text-primary leading-tight">
                  {format(new Date(event.date), "dd")}
                </span>
              </div>
              <div className="flex flex-col gap-0.5 min-w-0">
                <span className="text-sm font-medium text-foreground truncate">
                  {event.name}
                </span>
                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3 shrink-0" />
                  <span className="truncate">{event.location}</span>
                </span>
                <span className="text-xs text-muted-foreground">
                  {format(new Date(event.date), "HH:mm", { locale: ptBR })}
                </span>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}

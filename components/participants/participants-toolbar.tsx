"use client"

import { Search, Plus } from "lucide-react"
import type { Event } from "@/lib/types"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface ParticipantsToolbarProps {
  search: string
  onSearchChange: (value: string) => void
  eventFilter: string
  onEventFilterChange: (value: string) => void
  checkinFilter: string
  onCheckinFilterChange: (value: string) => void
  events: Event[]
  onNew: () => void
}

export function ParticipantsToolbar({
  search,
  onSearchChange,
  eventFilter,
  onEventFilterChange,
  checkinFilter,
  onCheckinFilterChange,
  events,
  onNew,
}: ParticipantsToolbarProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar participantes..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={eventFilter} onValueChange={onEventFilterChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Evento" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os eventos</SelectItem>
            {events.map((e) => (
              <SelectItem key={e.id} value={e.id}>
                {e.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={checkinFilter} onValueChange={onCheckinFilterChange}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Check-in" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="done">Feito</SelectItem>
            <SelectItem value="pending">Pendente</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button onClick={onNew} className="shrink-0">
        <Plus className="mr-2 h-4 w-4" />
        Novo Participante
      </Button>
    </div>
  )
}

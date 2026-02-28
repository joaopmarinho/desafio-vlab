"use client"

import { useEffect, useState, useCallback } from "react"
import { api } from "@/lib/api"
import type { Event, CheckinRule } from "@/lib/types"
import { CheckinRulesManager } from "@/components/checkin/checkin-rules-manager"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Settings } from "lucide-react"
import { toast } from "sonner"

export default function CheckinPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [selectedEventId, setSelectedEventId] = useState<string>("")
  const [rules, setRules] = useState<CheckinRule[]>([])
  const [isLoadingEvents, setIsLoadingEvents] = useState(true)
  const [isLoadingRules, setIsLoadingRules] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const loadEvents = useCallback(async () => {
    setIsLoadingEvents(true)
    try {
      const data = await api.getEvents()
      setEvents(data)
      if (data.length > 0) {
        setSelectedEventId(data[0].id)
      }
    } finally {
      setIsLoadingEvents(false)
    }
  }, [])

  const loadRules = useCallback(async (eventId: string) => {
    setIsLoadingRules(true)
    try {
      const data = await api.getCheckinRules(eventId)
      setRules(data)
    } finally {
      setIsLoadingRules(false)
    }
  }, [])

  useEffect(() => {
    loadEvents()
  }, [loadEvents])

  useEffect(() => {
    if (selectedEventId) {
      loadRules(selectedEventId)
    }
  }, [selectedEventId, loadRules])

  const handleSaveRules = async (updatedRules: CheckinRule[]) => {
    setIsSaving(true)
    try {
      const saved = await api.updateCheckinRules(selectedEventId, updatedRules)
      setRules(saved)
      toast.success("Regras de check-in salvas com sucesso!")
    } catch {
      toast.error("Erro ao salvar regras")
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoadingEvents) {
    return (
      <div className="flex flex-col gap-6">
        <div>
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96 mt-2" />
        </div>
        <Skeleton className="h-10 w-64" />
        <div className="flex flex-col gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Configuração de Check-in
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Defina as regras de check-in para cada evento
        </p>
      </div>

      <div className="flex flex-col gap-2 max-w-sm">
        <Label htmlFor="event-select">Selecione o evento</Label>
        <Select value={selectedEventId} onValueChange={setSelectedEventId}>
          <SelectTrigger id="event-select">
            <SelectValue placeholder="Selecione um evento" />
          </SelectTrigger>
          <SelectContent>
            {events.map((e) => (
              <SelectItem key={e.id} value={e.id}>
                {e.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {!selectedEventId ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="flex items-center justify-center h-12 w-12 rounded-full bg-muted mb-3">
              <Settings className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-foreground">Selecione um evento</p>
            <p className="text-xs text-muted-foreground mt-1">
              Escolha um evento acima para configurar as regras de check-in
            </p>
          </CardContent>
        </Card>
      ) : isLoadingRules ? (
        <div className="flex flex-col gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-lg" />
          ))}
        </div>
      ) : (
        <CheckinRulesManager
          eventId={selectedEventId}
          rules={rules}
          onSave={handleSaveRules}
          isSaving={isSaving}
        />
      )}
    </div>
  )
}

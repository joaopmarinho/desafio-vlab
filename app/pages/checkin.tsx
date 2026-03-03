"use client"

import { useState } from "react"
import type { CheckinRule } from "@/lib/types"
import { useEvents } from "@/features/events"
import { useCheckinRulesQuery, useSaveCheckinRules } from "@/features/checkin"
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
import { ErrorCard } from "@/components/shared/error-card"

export default function CheckinPage() {
    const [selectedEventId, setSelectedEventId] = useState<string>("")
    const { data: events = [], isLoading: isLoadingEvents, error: eventsError, refetch: refetchEvents } = useEvents()
    const { data: rules = [], isLoading: isLoadingRules } = useCheckinRulesQuery(selectedEventId)
    const saveRules = useSaveCheckinRules()

    // Auto-select first event when events load
    if (events.length > 0 && !selectedEventId) {
        setSelectedEventId(events[0].id)
    }

    const handleSaveRules = async (updatedRules: CheckinRule[]) => {
        await saveRules.mutateAsync({ eventId: selectedEventId, rules: updatedRules })
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

    if (eventsError) {
        return (
            <div className="flex flex-col gap-6">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight text-foreground">
                        Configuração de Check-in
                    </h1>
                </div>
                <ErrorCard
                    title="Erro ao carregar dados"
                    message={eventsError.message}
                    onRetry={() => refetchEvents()}
                />
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
                    isSaving={saveRules.isPending}
                />
            )}
        </div>
    )
}

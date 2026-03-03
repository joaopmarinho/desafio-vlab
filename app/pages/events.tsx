"use client"

import { useState } from "react"
import type { Event } from "@/lib/types"
import { useEvents, useCreateEvent, useUpdateEvent, useDeleteEvent } from "@/features/events"
import { EventsTable } from "@/components/events/events-table"
import { EventFormDialog } from "@/components/events/event-form-dialog"
import { EventsToolbar } from "@/components/events/events-toolbar"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar } from "lucide-react"
import { ErrorCard } from "@/components/shared/error-card"

export default function EventosPage() {
    const { data: events = [], isLoading, error, refetch } = useEvents()
    const createEvent = useCreateEvent()
    const updateEvent = useUpdateEvent()
    const deleteEvent = useDeleteEvent()

    const [search, setSearch] = useState("")
    const [statusFilter, setStatusFilter] = useState<string>("all")
    const [dateFrom, setDateFrom] = useState("")
    const [dateTo, setDateTo] = useState("")
    const [editingEvent, setEditingEvent] = useState<Event | null>(null)
    const [formOpen, setFormOpen] = useState(false)

    const filteredEvents = events.filter((event) => {
        const matchesSearch =
            event.name.toLowerCase().includes(search.toLowerCase()) ||
            event.location.toLowerCase().includes(search.toLowerCase())
        const matchesStatus = statusFilter === "all" || event.status === statusFilter
        const eventDate = event.date.slice(0, 10)
        const matchesDateFrom = !dateFrom || eventDate >= dateFrom
        const matchesDateTo = !dateTo || eventDate <= dateTo
        return matchesSearch && matchesStatus && matchesDateFrom && matchesDateTo
    })

    const handleCreate = async (data: Omit<Event, "id">) => {
        await createEvent.mutateAsync(data)
        setFormOpen(false)
    }

    const handleUpdate = async (data: Omit<Event, "id">) => {
        if (!editingEvent) return
        await updateEvent.mutateAsync({ id: editingEvent.id, data })
        setEditingEvent(null)
        setFormOpen(false)
    }

    const handleDelete = async (id: string) => {
        await deleteEvent.mutateAsync(id)
    }

    const handleEdit = (event: Event) => {
        setEditingEvent(event)
        setFormOpen(true)
    }

    const handleNew = () => {
        setEditingEvent(null)
        setFormOpen(true)
    }

    const handleCloseForm = () => {
        setFormOpen(false)
        setEditingEvent(null)
    }

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground">Eventos</h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Gerencie todos os seus eventos
                </p>
            </div>

            <EventsToolbar
                search={search}
                onSearchChange={setSearch}
                statusFilter={statusFilter}
                onStatusFilterChange={setStatusFilter}
                dateFrom={dateFrom}
                onDateFromChange={setDateFrom}
                dateTo={dateTo}
                onDateToChange={setDateTo}
                onNew={handleNew}
            />

            {isLoading ? (
                <Card>
                    <CardContent className="p-4">
                        <div className="flex flex-col gap-3">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <Skeleton key={i} className="h-14 rounded-lg" />
                            ))}
                        </div>
                    </CardContent>
                </Card>
            ) : error ? (
                <ErrorCard
                    title="Erro ao carregar eventos"
                    message={error.message}
                    onRetry={() => refetch()}
                />
            ) : filteredEvents.length === 0 ? (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-16">
                        <div className="flex items-center justify-center h-12 w-12 rounded-full bg-muted mb-3">
                            <Calendar className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <p className="text-sm font-medium text-foreground">Nenhum evento encontrado</p>
                        <p className="text-xs text-muted-foreground mt-1">
                            {search || statusFilter !== "all" || dateFrom || dateTo
                                ? "Tente ajustar os filtros de busca"
                                : "Crie seu primeiro evento clicando no botão acima"}
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <EventsTable
                    events={filteredEvents}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            )}

            <EventFormDialog
                open={formOpen}
                onClose={handleCloseForm}
                event={editingEvent}
                onSubmit={editingEvent ? handleUpdate : handleCreate}
            />
        </div>
    )
}

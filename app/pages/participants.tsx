"use client"

import { useState } from "react"
import type { Participant } from "@/lib/types"
import {
    useParticipants,
    useCreateParticipant,
    useUpdateParticipant,
    useDeleteParticipant,
    useToggleCheckin,
} from "@/features/participants"
import { useEvents } from "@/features/events"
import { ParticipantsTable } from "@/components/participants/participants-table"
import { ParticipantFormDialog } from "@/components/participants/participant-form-dialog"
import { ParticipantsToolbar } from "@/components/participants/participants-toolbar"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"
import { Users } from "lucide-react"
import { ErrorCard } from "@/components/shared/error-card"

export default function ParticipantesPage() {
    const { data: participants = [], isLoading: isLoadingParticipants, error: participantsError, refetch } = useParticipants()
    const { data: events = [], isLoading: isLoadingEvents } = useEvents()
    const createParticipant = useCreateParticipant()
    const updateParticipant = useUpdateParticipant()
    const deleteParticipant = useDeleteParticipant()
    const toggleCheckin = useToggleCheckin()

    const isLoading = isLoadingParticipants || isLoadingEvents

    const [search, setSearch] = useState("")
    const [eventFilter, setEventFilter] = useState<string>("all")
    const [checkinFilter, setCheckinFilter] = useState<string>("all")
    const [editingParticipant, setEditingParticipant] = useState<Participant | null>(null)
    const [formOpen, setFormOpen] = useState(false)

    const filteredParticipants = participants.filter((p) => {
        const matchesSearch =
            p.name.toLowerCase().includes(search.toLowerCase()) ||
            p.email.toLowerCase().includes(search.toLowerCase())
        const matchesEvent = eventFilter === "all" || p.eventId === eventFilter
        const matchesCheckin =
            checkinFilter === "all" ||
            (checkinFilter === "done" && p.checkedIn) ||
            (checkinFilter === "pending" && !p.checkedIn)
        return matchesSearch && matchesEvent && matchesCheckin
    })

    const handleCreate = async (data: Omit<Participant, "id">) => {
        await createParticipant.mutateAsync(data)
        setFormOpen(false)
    }

    const handleUpdate = async (data: Omit<Participant, "id">) => {
        if (!editingParticipant) return
        await updateParticipant.mutateAsync({ id: editingParticipant.id, data })
        setEditingParticipant(null)
        setFormOpen(false)
    }

    const handleDelete = async (id: string) => {
        await deleteParticipant.mutateAsync(id)
    }

    const handleToggleCheckin = async (participant: Participant) => {
        await toggleCheckin.mutateAsync(participant)
    }

    const handleEdit = (participant: Participant) => {
        setEditingParticipant(participant)
        setFormOpen(true)
    }

    const handleNew = () => {
        setEditingParticipant(null)
        setFormOpen(true)
    }

    const handleCloseForm = () => {
        setFormOpen(false)
        setEditingParticipant(null)
    }

    return (
        <div className="flex flex-col gap-6">
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-foreground">Participantes</h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Gerencie os participantes dos seus eventos
                </p>
            </div>

            <ParticipantsToolbar
                search={search}
                onSearchChange={setSearch}
                eventFilter={eventFilter}
                onEventFilterChange={setEventFilter}
                checkinFilter={checkinFilter}
                onCheckinFilterChange={setCheckinFilter}
                events={events}
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
            ) : participantsError ? (
                <ErrorCard
                    title="Erro ao carregar participantes"
                    message={participantsError.message}
                    onRetry={() => refetch()}
                />
            ) : filteredParticipants.length === 0 ? (
                <Card>
                    <CardContent className="flex flex-col items-center justify-center py-16">
                        <div className="flex items-center justify-center h-12 w-12 rounded-full bg-muted mb-3">
                            <Users className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <p className="text-sm font-medium text-foreground">Nenhum participante encontrado</p>
                        <p className="text-xs text-muted-foreground mt-1">
                            {search || eventFilter !== "all" || checkinFilter !== "all"
                                ? "Tente ajustar os filtros de busca"
                                : "Cadastre seu primeiro participante clicando no botão acima"}
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <ParticipantsTable
                    participants={filteredParticipants}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onToggleCheckin={handleToggleCheckin}
                />
            )}

            <ParticipantFormDialog
                open={formOpen}
                onClose={handleCloseForm}
                participant={editingParticipant}
                events={events}
                onSubmit={editingParticipant ? handleUpdate : handleCreate}
            />
        </div>
    )
}

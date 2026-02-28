"use client"

import { useEffect, useState, useCallback } from "react"
import { api } from "@/lib/api"
import type { Participant, Event } from "@/lib/types"
import { ParticipantsTable } from "@/components/participants/participants-table"
import { ParticipantFormDialog } from "@/components/participants/participant-form-dialog"
import { ParticipantsToolbar } from "@/components/participants/participants-toolbar"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "sonner"
import { Users } from "lucide-react"

export default function ParticipantsPage() {
  const [participants, setParticipants] = useState<Participant[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [eventFilter, setEventFilter] = useState<string>("all")
  const [checkinFilter, setCheckinFilter] = useState<string>("all")
  const [editingParticipant, setEditingParticipant] = useState<Participant | null>(null)
  const [formOpen, setFormOpen] = useState(false)

  const loadData = useCallback(async () => {
    setIsLoading(true)
    try {
      const [p, e] = await Promise.all([api.getParticipants(), api.getEvents()])
      setParticipants(p)
      setEvents(e)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

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
    try {
      await api.createParticipant(data)
      await loadData()
      setFormOpen(false)
      toast.success("Participante cadastrado com sucesso!")
    } catch {
      toast.error("Erro ao cadastrar participante")
    }
  }

  const handleUpdate = async (data: Omit<Participant, "id">) => {
    if (!editingParticipant) return
    try {
      await api.updateParticipant(editingParticipant.id, data)
      await loadData()
      setEditingParticipant(null)
      setFormOpen(false)
      toast.success("Participante atualizado com sucesso!")
    } catch {
      toast.error("Erro ao atualizar participante")
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await api.deleteParticipant(id)
      await loadData()
      toast.success("Participante removido com sucesso!")
    } catch {
      toast.error("Erro ao remover participante")
    }
  }

  const handleToggleCheckin = async (participant: Participant) => {
    try {
      await api.updateParticipant(participant.id, {
        checkedIn: !participant.checkedIn,
      })
      await loadData()
      toast.success(
        participant.checkedIn ? "Check-in desfeito" : "Check-in realizado!"
      )
    } catch {
      toast.error("Erro ao atualizar check-in")
    }
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

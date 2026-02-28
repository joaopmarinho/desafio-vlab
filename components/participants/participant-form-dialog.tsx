"use client"

import { useEffect, useState } from "react"
import type { Participant, Event } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Loader2 } from "lucide-react"

interface ParticipantFormDialogProps {
  open: boolean
  onClose: () => void
  participant: Participant | null
  events: Event[]
  onSubmit: (data: Omit<Participant, "id">) => Promise<void>
}

export function ParticipantFormDialog({
  open,
  onClose,
  participant,
  events,
  onSubmit,
}: ParticipantFormDialogProps) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [eventId, setEventId] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (participant) {
      setName(participant.name)
      setEmail(participant.email)
      setEventId(participant.eventId)
    } else {
      setName("")
      setEmail("")
      setEventId("")
    }
    setErrors({})
  }, [participant, open])

  const validate = () => {
    const newErrors: Record<string, string> = {}
    if (!name.trim()) newErrors.name = "Nome é obrigatório"
    if (!email.trim()) newErrors.email = "E-mail é obrigatório"
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "E-mail inválido"
    if (!eventId) newErrors.eventId = "Selecione um evento"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    const selectedEvent = events.find((ev) => ev.id === eventId)
    if (!selectedEvent) return

    setIsSubmitting(true)
    try {
      await onSubmit({
        name,
        email,
        eventId,
        eventName: selectedEvent.name,
        checkedIn: participant?.checkedIn ?? false,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {participant ? "Editar Participante" : "Novo Participante"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="participant-name">Nome</Label>
            <Input
              id="participant-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nome completo"
            />
            {errors.name && <p className="text-xs text-destructive">{errors.name}</p>}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="participant-email">E-mail</Label>
            <Input
              id="participant-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@exemplo.com"
            />
            {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="participant-event">
              {participant ? "Transferir para evento" : "Evento"}
            </Label>
            <Select value={eventId} onValueChange={setEventId}>
              <SelectTrigger id="participant-event">
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
            {errors.eventId && <p className="text-xs text-destructive">{errors.eventId}</p>}
            {participant && participant.eventId !== eventId && eventId && (
              <p className="text-xs text-warning-foreground bg-warning/10 rounded-md px-2 py-1.5">
                O participante será transferido para o evento selecionado.
              </p>
            )}
          </div>

          <DialogFooter className="gap-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : participant ? (
                "Salvar"
              ) : (
                "Cadastrar"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

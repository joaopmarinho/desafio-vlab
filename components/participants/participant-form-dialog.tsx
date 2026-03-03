"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import type { Participant, Event } from "@/lib/types"
import { participantSchema, type ParticipantFormData } from "@/lib/validations"
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
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ParticipantFormData>({
    resolver: zodResolver(participantSchema),
    defaultValues: {
      name: "",
      email: "",
      eventId: "",
    },
  })

  const eventIdValue = watch("eventId")

  useEffect(() => {
    if (participant) {
      reset({
        name: participant.name,
        email: participant.email,
        eventId: participant.eventId,
      })
    } else {
      reset({
        name: "",
        email: "",
        eventId: "",
      })
    }
  }, [participant, open, reset])

  const onFormSubmit = async (data: ParticipantFormData) => {
    const selectedEvent = events.find((ev) => ev.id === data.eventId)
    if (!selectedEvent) return

    await onSubmit({
      name: data.name,
      email: data.email,
      eventId: data.eventId,
      eventName: selectedEvent.name,
      checkedIn: participant?.checkedIn ?? false,
    })
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {participant ? "Editar Participante" : "Novo Participante"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onFormSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="participant-name">Nome</Label>
            <Input
              id="participant-name"
              {...register("name")}
              placeholder="Nome completo"
            />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="participant-email">E-mail</Label>
            <Input
              id="participant-email"
              type="email"
              {...register("email")}
              placeholder="email@exemplo.com"
            />
            {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="participant-event">
              {participant ? "Transferir para evento" : "Evento"}
            </Label>
            <Select value={eventIdValue} onValueChange={(v) => setValue("eventId", v)}>
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
            {errors.eventId && <p className="text-xs text-destructive">{errors.eventId.message}</p>}
            {participant && participant.eventId !== eventIdValue && eventIdValue && (
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

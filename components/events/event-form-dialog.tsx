"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import type { Event } from "@/lib/types"
import { eventSchema, type EventFormData } from "@/lib/validations"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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

interface EventFormDialogProps {
  open: boolean
  onClose: () => void
  event: Event | null
  onSubmit: (data: Omit<Event, "id">) => Promise<void>
}

export function EventFormDialog({ open, onClose, event, onSubmit }: EventFormDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<EventFormData>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      name: "",
      date: "",
      location: "",
      status: "Ativo",
      description: "",
    },
  })

  const statusValue = watch("status")

  useEffect(() => {
    if (event) {
      reset({
        name: event.name,
        date: event.date.slice(0, 16),
        location: event.location,
        status: event.status,
        description: event.description || "",
      })
    } else {
      reset({
        name: "",
        date: "",
        location: "",
        status: "Ativo",
        description: "",
      })
    }
  }, [event, open, reset])

  const onFormSubmit = async (data: EventFormData) => {
    await onSubmit(data)
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{event ? "Editar Evento" : "Novo Evento"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onFormSubmit)} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="event-name">Nome do evento</Label>
            <Input
              id="event-name"
              {...register("name")}
              placeholder="Nome do evento"
            />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="event-date">Data e hora</Label>
            <Input
              id="event-date"
              type="datetime-local"
              {...register("date")}
            />
            {errors.date && <p className="text-xs text-destructive">{errors.date.message}</p>}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="event-location">Local</Label>
            <Input
              id="event-location"
              {...register("location")}
              placeholder="Local do evento"
            />
            {errors.location && <p className="text-xs text-destructive">{errors.location.message}</p>}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="event-status">Status</Label>
            <Select
              value={statusValue}
              onValueChange={(v) => setValue("status", v as "Ativo" | "Encerrado")}
            >
              <SelectTrigger id="event-status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Ativo">Ativo</SelectItem>
                <SelectItem value="Encerrado">Encerrado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor="event-description">Descrição (opcional)</Label>
            <Textarea
              id="event-description"
              {...register("description")}
              placeholder="Descrição do evento"
              rows={3}
            />
            {errors.description && <p className="text-xs text-destructive">{errors.description.message}</p>}
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
              ) : event ? (
                "Salvar"
              ) : (
                "Criar Evento"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

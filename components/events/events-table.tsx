"use client"

import { useState, useMemo } from "react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { Pencil, Trash2, MoreHorizontal, Eye } from "lucide-react"
import type { Event } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { TablePagination } from "@/components/ui/table-pagination"

const ITEMS_PER_PAGE = 10

interface EventsTableProps {
  events: Event[]
  onEdit: (event: Event) => void
  onDelete: (id: string) => void
}

export function EventsTable({ events, onEdit, onDelete }: EventsTableProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [viewingEvent, setViewingEvent] = useState<Event | null>(null)
  const [currentPage, setCurrentPage] = useState(1)

  const totalPages = Math.ceil(events.length / ITEMS_PER_PAGE)
  const paginatedEvents = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return events.slice(start, start + ITEMS_PER_PAGE)
  }, [events, currentPage])

  // Reset to page 1 when events change (e.g. filter applied)
  const [prevLength, setPrevLength] = useState(events.length)
  if (events.length !== prevLength) {
    setPrevLength(events.length)
    if (currentPage > Math.ceil(events.length / ITEMS_PER_PAGE)) {
      setCurrentPage(1)
    }
  }

  return (
    <>
      {/* Desktop table */}
      <Card className="hidden md:block">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Local</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-12">
                  <span className="sr-only">Ações</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedEvents.map((event) => (
                <TableRow key={event.id}>
                  <TableCell className="font-medium">{event.name}</TableCell>
                  <TableCell>
                    {format(new Date(event.date), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate">{event.location}</TableCell>
                  <TableCell>
                    <Badge
                      variant={event.status === "Ativo" ? "default" : "secondary"}
                      className={
                        event.status === "Ativo"
                          ? "bg-success/10 text-success hover:bg-success/20 border-0"
                          : "bg-muted text-muted-foreground border-0"
                      }
                    >
                      {event.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Ações</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setViewingEvent(event)}>
                          <Eye className="mr-2 h-4 w-4" />
                          Ver detalhes
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => onEdit(event)}>
                          <Pencil className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => setDeleteId(event.id)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Remover
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <TablePagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={events.length}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={setCurrentPage}
          />
        </CardContent>
      </Card>

      {/* Mobile cards */}
      <div className="flex flex-col gap-3 md:hidden">
        {paginatedEvents.map((event) => (
          <Card key={event.id}>
            <CardContent className="flex items-start justify-between p-4">
              <div className="flex flex-col gap-1 min-w-0">
                <span className="text-sm font-medium text-foreground">{event.name}</span>
                <span className="text-xs text-muted-foreground">
                  {format(new Date(event.date), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                </span>
                <span className="text-xs text-muted-foreground truncate">{event.location}</span>
                <Badge
                  variant={event.status === "Ativo" ? "default" : "secondary"}
                  className={`w-fit mt-1 ${event.status === "Ativo"
                    ? "bg-success/10 text-success hover:bg-success/20 border-0"
                    : "bg-muted text-muted-foreground border-0"
                    }`}
                >
                  {event.status}
                </Badge>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 shrink-0">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Ações</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setViewingEvent(event)}>
                    <Eye className="mr-2 h-4 w-4" />
                    Ver detalhes
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => onEdit(event)}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setDeleteId(event.id)}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Remover
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardContent>
          </Card>
        ))}
        <TablePagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={events.length}
          itemsPerPage={ITEMS_PER_PAGE}
          onPageChange={setCurrentPage}
        />
      </div>

      {/* Delete confirmation */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja remover este evento? Esta ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (deleteId) {
                  onDelete(deleteId)
                  setDeleteId(null)
                }
              }}
              className="bg-destructive text-white hover:bg-destructive/90 transition-colors"
            >
              Remover
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Event details dialog */}
      <Dialog open={!!viewingEvent} onOpenChange={() => setViewingEvent(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Detalhes do Evento</DialogTitle>
          </DialogHeader>
          {viewingEvent && (
            <div className="flex flex-col gap-4">
              <div className="flex flex-col gap-1">
                <span className="text-xs text-muted-foreground">Nome</span>
                <span className="text-sm font-medium">{viewingEvent.name}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs text-muted-foreground">Data e hora</span>
                <span className="text-sm">
                  {format(new Date(viewingEvent.date), "dd 'de' MMMM 'de' yyyy 'às' HH:mm", {
                    locale: ptBR,
                  })}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs text-muted-foreground">Local</span>
                <span className="text-sm">{viewingEvent.location}</span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs text-muted-foreground">Status</span>
                <Badge
                  variant={viewingEvent.status === "Ativo" ? "default" : "secondary"}
                  className={`w-fit ${viewingEvent.status === "Ativo"
                    ? "bg-success/10 text-success hover:bg-success/20 border-0"
                    : "bg-muted text-muted-foreground border-0"
                    }`}
                >
                  {viewingEvent.status}
                </Badge>
              </div>
              {viewingEvent.description && (
                <div className="flex flex-col gap-1">
                  <span className="text-xs text-muted-foreground">Descrição</span>
                  <span className="text-sm">{viewingEvent.description}</span>
                </div>
              )}
              <div className="flex gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setViewingEvent(null)
                    onEdit(viewingEvent)
                  }}
                >
                  <Pencil className="mr-2 h-3.5 w-3.5" />
                  Editar
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

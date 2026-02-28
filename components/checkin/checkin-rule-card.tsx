"use client"

import type { CheckinRule } from "@/lib/types"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Trash2, GripVertical, AlertTriangle } from "lucide-react"
import { cn } from "@/lib/utils"

interface CheckinRuleCardProps {
  rule: CheckinRule
  index: number
  onUpdate: (id: string, updates: Partial<CheckinRule>) => void
  onRemove: (id: string) => void
  hasConflict: boolean
}

export function CheckinRuleCard({
  rule,
  index,
  onUpdate,
  onRemove,
  hasConflict,
}: CheckinRuleCardProps) {
  const nameError = !rule.name.trim()

  return (
    <Card
      className={cn(
        "transition-all",
        !rule.enabled && "opacity-60",
        hasConflict && "ring-2 ring-destructive/50"
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between gap-3 pb-3">
        <div className="flex items-center gap-3 min-w-0">
          <GripVertical className="h-4 w-4 text-muted-foreground shrink-0 hidden sm:block" />
          <Badge
            variant="outline"
            className="shrink-0 text-xs font-mono tabular-nums"
          >
            #{index + 1}
          </Badge>
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-sm font-medium text-foreground truncate">
              {rule.name || "Nova regra"}
            </span>
            {hasConflict && (
              <AlertTriangle className="h-4 w-4 text-destructive shrink-0" />
            )}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-2">
            <Label htmlFor={`toggle-${rule.id}`} className="text-xs text-muted-foreground sr-only">
              Ativar regra
            </Label>
            <Switch
              id={`toggle-${rule.id}`}
              checked={rule.enabled}
              onCheckedChange={(checked) => onUpdate(rule.id, { enabled: checked })}
            />
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-destructive"
            onClick={() => onRemove(rule.id)}
            aria-label="Remover regra"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor={`name-${rule.id}`}>Nome da regra</Label>
            <Input
              id={`name-${rule.id}`}
              value={rule.name}
              onChange={(e) => onUpdate(rule.id, { name: e.target.value })}
              placeholder="Ex: QR Code, Documento..."
              className={cn(nameError && "border-destructive")}
            />
            {nameError && (
              <p className="text-xs text-destructive">Nome é obrigatório</p>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor={`required-${rule.id}`}>Obrigatoriedade</Label>
            <Select
              value={rule.required ? "required" : "optional"}
              onValueChange={(v) =>
                onUpdate(rule.id, { required: v === "required" })
              }
            >
              <SelectTrigger id={`required-${rule.id}`}>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="required">Obrigatório</SelectItem>
                <SelectItem value="optional">Opcional</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor={`before-${rule.id}`}>
              Liberar check-in (minutos antes)
            </Label>
            <Input
              id={`before-${rule.id}`}
              type="number"
              min={0}
              value={rule.minutesBefore}
              onChange={(e) =>
                onUpdate(rule.id, { minutesBefore: Number(e.target.value) })
              }
            />
            <p className="text-xs text-muted-foreground">
              O check-in será liberado {rule.minutesBefore} min antes do evento
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <Label htmlFor={`after-${rule.id}`}>
              Encerrar check-in (minutos depois)
            </Label>
            <Input
              id={`after-${rule.id}`}
              type="number"
              min={0}
              value={rule.minutesAfter}
              onChange={(e) =>
                onUpdate(rule.id, { minutesAfter: Number(e.target.value) })
              }
            />
            <p className="text-xs text-muted-foreground">
              O check-in será encerrado {rule.minutesAfter} min após o início
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2 text-xs text-muted-foreground">
          <span className="font-medium">Janela total:</span>
          <span>
            {rule.minutesBefore + rule.minutesAfter} minutos
            ({rule.minutesBefore}min antes, {rule.minutesAfter}min depois)
          </span>
        </div>
      </CardContent>
    </Card>
  )
}

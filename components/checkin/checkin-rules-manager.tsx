"use client"

import { useState, useMemo } from "react"
import type { CheckinRule } from "@/lib/types"
import { CheckinRuleCard } from "@/components/checkin/checkin-rule-card"
import { CheckinAlerts } from "@/components/checkin/checkin-alerts"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Plus, Save, Loader2, Settings } from "lucide-react"

interface CheckinRulesManagerProps {
  eventId: string
  rules: CheckinRule[]
  onSave: (rules: CheckinRule[]) => Promise<void>
  isSaving: boolean
}

export interface RuleConflict {
  ruleAId: string
  ruleBId: string
  ruleAName: string
  ruleBName: string
  message: string
}

export interface RuleValidation {
  hasActiveRule: boolean
  conflicts: RuleConflict[]
  warnings: string[]
}

function validateRules(rules: CheckinRule[]): RuleValidation {
  const activeRules = rules.filter((r) => r.enabled)
  const requiredActiveRules = activeRules.filter((r) => r.required)
  const hasActiveRule = activeRules.length > 0

  const warnings: string[] = []
  const conflicts: RuleConflict[] = []

  // Deve existir ao menos 1 regra ativa
  if (!hasActiveRule) {
    warnings.push("Deve existir ao menos 1 regra ativa para o check-in funcionar.")
  }

  // Verificar se não há regras obrigatórias ativas
  if (hasActiveRule && requiredActiveRules.length === 0) {
    warnings.push(
      "Nenhuma regra obrigatória está ativa. Recomenda-se ter pelo menos uma regra obrigatória."
    )
  }

  // Validação de campos numéricos
  for (const rule of rules) {
    if (rule.enabled) {
      if (rule.minutesBefore < 0) {
        warnings.push(
          `A regra "${rule.name}" possui valor negativo em "Liberar antes". O valor deve ser >= 0.`
        )
      }
      if (rule.minutesAfter < 0) {
        warnings.push(
          `A regra "${rule.name}" possui valor negativo em "Encerrar depois". O valor deve ser >= 0.`
        )
      }
      if (rule.minutesBefore === 0 && rule.minutesAfter === 0) {
        warnings.push(
          `A regra "${rule.name}" possui janela de validação de 0 minutos. O check-in não terá tempo para ser realizado.`
        )
      }
    }
  }

  // Verificar conflitos de janela de validação entre regras obrigatórias
  // Conflito: duas regras obrigatórias onde as janelas não se sobrepõem (incompatíveis)
  // Se ambas são obrigatórias, suas janelas devem ter alguma sobreposição para que
  // o participante consiga cumprir ambas.
  for (let i = 0; i < requiredActiveRules.length; i++) {
    for (let j = i + 1; j < requiredActiveRules.length; j++) {
      const ruleA = requiredActiveRules[i]
      const ruleB = requiredActiveRules[j]

      // Janela de A: [-minutesBefore, +minutesAfter] relativa ao horário do evento
      // Janela de B: [-minutesBefore, +minutesAfter] relativa ao horário do evento
      // Sobreposição existe se: A_start < B_end AND B_start < A_end
      const aStart = -ruleA.minutesBefore
      const aEnd = ruleA.minutesAfter
      const bStart = -ruleB.minutesBefore
      const bEnd = ruleB.minutesAfter

      const hasOverlap = aStart < bEnd && bStart < aEnd

      if (!hasOverlap) {
        conflicts.push({
          ruleAId: ruleA.id,
          ruleBId: ruleB.id,
          ruleAName: ruleA.name,
          ruleBName: ruleB.name,
          message: `As regras obrigatórias "${ruleA.name}" e "${ruleB.name}" possuem janelas de validação incompatíveis. O participante não conseguirá cumprir ambas simultaneamente.`,
        })
      }
    }
  }

  return { hasActiveRule, conflicts, warnings }
}

export function CheckinRulesManager({
  eventId,
  rules: initialRules,
  onSave,
  isSaving,
}: CheckinRulesManagerProps) {
  const [rules, setRules] = useState<CheckinRule[]>(initialRules)
  const [hasChanges, setHasChanges] = useState(false)

  // Sincronizar quando o eventId ou initialRules mudarem
  useState(() => {
    setRules(initialRules)
    setHasChanges(false)
  })

  // Re-sync when props change
  const [prevInitial, setPrevInitial] = useState(initialRules)
  if (prevInitial !== initialRules) {
    setPrevInitial(initialRules)
    setRules(initialRules)
    setHasChanges(false)
  }

  const validation = useMemo(() => validateRules(rules), [rules])

  const updateRule = (id: string, updates: Partial<CheckinRule>) => {
    setRules((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...updates } : r))
    )
    setHasChanges(true)
  }

  const addRule = () => {
    const newRule: CheckinRule = {
      id: String(Date.now()),
      eventId,
      name: "",
      enabled: true,
      required: false,
      minutesBefore: 30,
      minutesAfter: 60,
    }
    setRules((prev) => [...prev, newRule])
    setHasChanges(true)
  }

  const removeRule = (id: string) => {
    setRules((prev) => prev.filter((r) => r.id !== id))
    setHasChanges(true)
  }

  const handleSave = async () => {
    // Validar nomes vazios
    const emptyName = rules.find((r) => !r.name.trim())
    if (emptyName) {
      return
    }
    await onSave(rules)
    setHasChanges(false)
  }

  return (
    <div className="flex flex-col gap-4">
      <CheckinAlerts validation={validation} />

      {rules.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <div className="flex items-center justify-center h-12 w-12 rounded-full bg-muted mb-3">
              <Settings className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-foreground">Nenhuma regra cadastrada</p>
            <p className="text-xs text-muted-foreground mt-1">
              Adicione a primeira regra de check-in para este evento
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-4">
          {rules.map((rule, index) => (
            <CheckinRuleCard
              key={rule.id}
              rule={rule}
              index={index}
              onUpdate={updateRule}
              onRemove={removeRule}
              hasConflict={validation.conflicts.some(
                (c) => c.ruleAId === rule.id || c.ruleBId === rule.id
              )}
            />
          ))}
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Button variant="outline" onClick={addRule} className="w-fit">
          <Plus className="mr-2 h-4 w-4" />
          Adicionar Regra
        </Button>

        {hasChanges && (
          <Button
            onClick={handleSave}
            disabled={isSaving || rules.some((r) => !r.name.trim())}
            className="w-fit"
          >
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Salvar Alterações
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  )
}

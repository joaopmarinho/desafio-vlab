"use client"

import type { CheckinRule } from "@/lib/types"
import { useCheckinRules } from "@/hooks/use-checkin-rules"
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

export function CheckinRulesManager({
  eventId,
  rules: initialRules,
  onSave,
  isSaving,
}: CheckinRulesManagerProps) {
  const {
    rules,
    hasChanges,
    validation,
    canSave,
    updateRule,
    addRule,
    removeRule,
    markSaved,
  } = useCheckinRules({ eventId, initialRules })

  const handleSave = async () => {
    const emptyName = rules.find((r) => !r.name.trim())
    if (emptyName) return
    await onSave(rules)
    markSaved()
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
            disabled={isSaving || !canSave}
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

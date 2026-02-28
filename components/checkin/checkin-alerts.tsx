"use client"

import type { RuleValidation } from "@/components/checkin/checkin-rules-manager"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertTriangle, XCircle, Info } from "lucide-react"

interface CheckinAlertsProps {
  validation: RuleValidation
}

export function CheckinAlerts({ validation }: CheckinAlertsProps) {
  const { conflicts, warnings } = validation

  if (conflicts.length === 0 && warnings.length === 0) {
    return null
  }

  return (
    <div className="flex flex-col gap-3">
      {conflicts.map((conflict, index) => (
        <Alert key={`conflict-${index}`} variant="destructive">
          <XCircle className="h-4 w-4" />
          <AlertTitle>Conflito de regras</AlertTitle>
          <AlertDescription>{conflict.message}</AlertDescription>
        </Alert>
      ))}

      {warnings.map((warning, index) => (
        <Alert
          key={`warning-${index}`}
          className="border-warning/30 bg-warning/5 text-warning-foreground [&>svg]:text-warning-foreground"
        >
          {index === 0 && !validation.hasActiveRule ? (
            <AlertTriangle className="h-4 w-4" />
          ) : (
            <Info className="h-4 w-4" />
          )}
          <AlertTitle>Atenção</AlertTitle>
          <AlertDescription>{warning}</AlertDescription>
        </Alert>
      ))}
    </div>
  )
}

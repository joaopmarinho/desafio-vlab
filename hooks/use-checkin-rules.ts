"use client"

import { useState, useMemo, useCallback, useRef, useEffect } from "react"
import type { CheckinRule } from "@/lib/types"

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

export function validateRules(rules: CheckinRule[]): RuleValidation {
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

    // Verificar nomes duplicados
    const nameCount = new Map<string, number>()
    for (const rule of rules) {
        const name = rule.name.trim().toLowerCase()
        if (name) {
            nameCount.set(name, (nameCount.get(name) || 0) + 1)
        }
    }
    for (const [name, count] of nameCount) {
        if (count > 1) {
            warnings.push(
                `Existem ${count} regras com o nome "${name}". Considere usar nomes únicos para facilitar a identificação.`
            )
        }
    }

    // Verificar conflitos de janela de validação entre regras obrigatórias
    for (let i = 0; i < requiredActiveRules.length; i++) {
        for (let j = i + 1; j < requiredActiveRules.length; j++) {
            const ruleA = requiredActiveRules[i]
            const ruleB = requiredActiveRules[j]

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

interface UseCheckinRulesOptions {
    eventId: string
    initialRules: CheckinRule[]
}

export function useCheckinRules({ eventId, initialRules }: UseCheckinRulesOptions) {
    const [rules, setRules] = useState<CheckinRule[]>(initialRules)
    const [hasChanges, setHasChanges] = useState(false)

    // Re-sync when initialRules reference changes
    const prevRef = useRef(initialRules)
    useEffect(() => {
        if (prevRef.current !== initialRules) {
            prevRef.current = initialRules
            setRules(initialRules)
            setHasChanges(false)
        }
    }, [initialRules])

    const validation = useMemo(() => validateRules(rules), [rules])

    const updateRule = useCallback((id: string, updates: Partial<CheckinRule>) => {
        setRules((prev) =>
            prev.map((r) => (r.id === id ? { ...r, ...updates } : r))
        )
        setHasChanges(true)
    }, [])

    const addRule = useCallback(() => {
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
    }, [eventId])

    const removeRule = useCallback((id: string) => {
        setRules((prev) => prev.filter((r) => r.id !== id))
        setHasChanges(true)
    }, [])

    const canSave = hasChanges && rules.every((r) => r.name.trim())

    const markSaved = useCallback(() => {
        setHasChanges(false)
    }, [])

    return {
        rules,
        hasChanges,
        validation,
        canSave,
        updateRule,
        addRule,
        removeRule,
        markSaved,
    }
}

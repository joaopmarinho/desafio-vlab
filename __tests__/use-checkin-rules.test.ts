import { validateRules } from "@/hooks/use-checkin-rules"
import type { CheckinRule } from "@/lib/types"

function createRule(overrides: Partial<CheckinRule> = {}): CheckinRule {
    return {
        id: String(Date.now() + Math.random()),
        eventId: "event-1",
        name: "Regra de Teste",
        enabled: true,
        required: true,
        minutesBefore: 30,
        minutesAfter: 60,
        ...overrides,
    }
}

describe("validateRules", () => {
    it("should warn when no active rules exist", () => {
        const rules = [createRule({ enabled: false })]
        const result = validateRules(rules)

        expect(result.hasActiveRule).toBe(false)
        expect(result.warnings).toContainEqual(
            expect.stringContaining("ao menos 1 regra ativa")
        )
    })

    it("should not warn when at least one active rule exists", () => {
        const rules = [createRule({ enabled: true })]
        const result = validateRules(rules)

        expect(result.hasActiveRule).toBe(true)
    })

    it("should warn when active rules exist but none are mandatory", () => {
        const rules = [createRule({ enabled: true, required: false })]
        const result = validateRules(rules)

        expect(result.warnings).toContainEqual(
            expect.stringContaining("Nenhuma regra obrigatória está ativa")
        )
    })

    it("should warn about zero-width validation window", () => {
        const rules = [createRule({ minutesBefore: 0, minutesAfter: 0 })]
        const result = validateRules(rules)

        expect(result.warnings).toContainEqual(
            expect.stringContaining("janela de validação de 0 minutos")
        )
    })

    it("should warn about negative minutesBefore", () => {
        const rules = [createRule({ minutesBefore: -5 })]
        const result = validateRules(rules)

        expect(result.warnings).toContainEqual(
            expect.stringContaining("valor negativo")
        )
    })

    it("should warn about negative minutesAfter", () => {
        const rules = [createRule({ minutesAfter: -10 })]
        const result = validateRules(rules)

        expect(result.warnings).toContainEqual(
            expect.stringContaining("valor negativo")
        )
    })

    it("should warn about duplicate rule names", () => {
        const rules = [
            createRule({ id: "r1", name: "QR Code" }),
            createRule({ id: "r2", name: "QR Code" }),
        ]
        const result = validateRules(rules)

        expect(result.warnings).toContainEqual(
            expect.stringContaining("regras com o nome")
        )
    })

    it("should not warn about different rule names", () => {
        const rules = [
            createRule({ id: "r1", name: "QR Code" }),
            createRule({ id: "r2", name: "Documento" }),
        ]
        const result = validateRules(rules)

        const duplicateWarning = result.warnings.find((w) =>
            w.includes("regras com o nome")
        )
        expect(duplicateWarning).toBeUndefined()
    })

    it("should detect window conflicts between mandatory rules", () => {
        const rules = [
            createRule({ id: "r1", name: "Regra A", minutesBefore: 30, minutesAfter: 0 }),
            createRule({ id: "r2", name: "Regra B", minutesBefore: 0, minutesAfter: 30 }),
        ]
        const result = validateRules(rules)

        expect(result.conflicts).toHaveLength(1)
        expect(result.conflicts[0].message).toContain("incompatíveis")
    })

    it("should not detect conflict when windows overlap", () => {
        const rules = [
            createRule({ id: "r1", name: "Regra A", minutesBefore: 30, minutesAfter: 30 }),
            createRule({ id: "r2", name: "Regra B", minutesBefore: 30, minutesAfter: 30 }),
        ]
        const result = validateRules(rules)

        expect(result.conflicts).toHaveLength(0)
    })

    it("should not check conflicts for optional rules", () => {
        const rules = [
            createRule({ id: "r1", name: "Regra A", required: false, minutesBefore: 30, minutesAfter: 0 }),
            createRule({ id: "r2", name: "Regra B", required: false, minutesBefore: 0, minutesAfter: 30 }),
        ]
        const result = validateRules(rules)

        expect(result.conflicts).toHaveLength(0)
    })

    it("should not validate disabled rules for window issues", () => {
        const rules = [createRule({ enabled: false, minutesBefore: -5, minutesAfter: -5 })]
        const result = validateRules(rules)

        const negativeWarning = result.warnings.find((w) => w.includes("valor negativo"))
        expect(negativeWarning).toBeUndefined()
    })

    it("should return no warnings or conflicts for a valid setup", () => {
        const rules = [
            createRule({
                id: "r1",
                name: "QR Code",
                enabled: true,
                required: true,
                minutesBefore: 30,
                minutesAfter: 60,
            }),
        ]
        const result = validateRules(rules)

        expect(result.hasActiveRule).toBe(true)
        expect(result.conflicts).toHaveLength(0)
        expect(result.warnings).toHaveLength(0)
    })
})

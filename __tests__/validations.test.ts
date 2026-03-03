import { eventSchema, participantSchema, loginSchema } from "@/lib/validations"

describe("Zod Schemas", () => {
    describe("eventSchema", () => {
        it("should accept valid event data", () => {
            const result = eventSchema.safeParse({
                name: "Tech Summit 2026",
                date: "2026-06-15T10:00",
                location: "São Paulo",
                status: "Ativo",
                description: "Um grande evento!",
            })
            expect(result.success).toBe(true)
        })

        it("should reject empty name", () => {
            const result = eventSchema.safeParse({
                name: "",
                date: "2026-06-15T10:00",
                location: "São Paulo",
                status: "Ativo",
            })
            expect(result.success).toBe(false)
        })

        it("should reject empty date", () => {
            const result = eventSchema.safeParse({
                name: "Evento",
                date: "",
                location: "São Paulo",
                status: "Ativo",
            })
            expect(result.success).toBe(false)
        })

        it("should reject invalid status", () => {
            const result = eventSchema.safeParse({
                name: "Evento",
                date: "2026-06-15T10:00",
                location: "São Paulo",
                status: "Cancelado",
            })
            expect(result.success).toBe(false)
        })
    })

    describe("participantSchema", () => {
        it("should accept valid participant data", () => {
            const result = participantSchema.safeParse({
                name: "João Silva",
                email: "joao@email.com",
                eventId: "event-1",
            })
            expect(result.success).toBe(true)
        })

        it("should reject invalid email", () => {
            const result = participantSchema.safeParse({
                name: "João Silva",
                email: "email-invalido",
                eventId: "event-1",
            })
            expect(result.success).toBe(false)
        })

        it("should reject empty eventId", () => {
            const result = participantSchema.safeParse({
                name: "João Silva",
                email: "joao@email.com",
                eventId: "",
            })
            expect(result.success).toBe(false)
        })
    })

    describe("loginSchema", () => {
        it("should accept valid credentials", () => {
            const result = loginSchema.safeParse({
                email: "admin@eventos.com",
                password: "123456",
            })
            expect(result.success).toBe(true)
        })

        it("should reject invalid email format", () => {
            const result = loginSchema.safeParse({
                email: "not-an-email",
                password: "123456",
            })
            expect(result.success).toBe(false)
        })

        it("should reject empty password", () => {
            const result = loginSchema.safeParse({
                email: "admin@eventos.com",
                password: "",
            })
            expect(result.success).toBe(false)
        })
    })
})

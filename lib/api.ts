import type { AuthResponse, Event, Participant, CheckinRule, DashboardData } from "./types"
import { mockEvents, mockParticipants, mockCheckinRules, mockDashboard } from "./mock-data"

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

let events = [...mockEvents]
let participants = [...mockParticipants]
let checkinRules = [...mockCheckinRules]

export const api = {
  // Auth
  async login(email: string, password: string): Promise<AuthResponse> {
    await delay(800)
    if (email === "admin@eventos.com" && password === "123456") {
      return {
        token: "mock-jwt-token-" + Date.now(),
        user: { id: "1", name: "Administrador", email },
      }
    }
    throw new Error("Credenciais inválidas")
  },

  // Dashboard
  async getDashboard(): Promise<DashboardData> {
    await delay(500)
    return {
      ...mockDashboard,
      totalEvents: events.length,
      totalParticipants: participants.length,
    }
  },

  // Events
  async getEvents(): Promise<Event[]> {
    await delay(500)
    return [...events]
  },

  async createEvent(data: Omit<Event, "id">): Promise<Event> {
    await delay(500)
    const newEvent: Event = { ...data, id: String(Date.now()) }
    events.push(newEvent)
    return newEvent
  },

  async updateEvent(id: string, data: Partial<Event>): Promise<Event> {
    await delay(500)
    const index = events.findIndex((e) => e.id === id)
    if (index === -1) throw new Error("Evento não encontrado")
    events[index] = { ...events[index], ...data }
    return events[index]
  },

  async deleteEvent(id: string): Promise<void> {
    await delay(500)
    events = events.filter((e) => e.id !== id)
  },

  // Participants
  async getParticipants(): Promise<Participant[]> {
    await delay(500)
    return [...participants]
  },

  async createParticipant(data: Omit<Participant, "id">): Promise<Participant> {
    await delay(500)
    const newParticipant: Participant = { ...data, id: String(Date.now()) }
    participants.push(newParticipant)
    return newParticipant
  },

  async updateParticipant(id: string, data: Partial<Participant>): Promise<Participant> {
    await delay(500)
    const index = participants.findIndex((p) => p.id === id)
    if (index === -1) throw new Error("Participante não encontrado")
    participants[index] = { ...participants[index], ...data }
    return participants[index]
  },

  async deleteParticipant(id: string): Promise<void> {
    await delay(500)
    participants = participants.filter((p) => p.id !== id)
  },

  // Checkin Rules
  async getCheckinRules(eventId: string): Promise<CheckinRule[]> {
    await delay(500)
    return checkinRules.filter((r) => r.eventId === eventId)
  },

  async updateCheckinRules(eventId: string, rules: CheckinRule[]): Promise<CheckinRule[]> {
    await delay(500)
    checkinRules = checkinRules.filter((r) => r.eventId !== eventId)
    checkinRules.push(...rules)
    return rules
  },
}

import type { Event, Participant, CheckinRule, DashboardData } from "./types"

export const mockEvents: Event[] = [
  { id: "1", name: "Tech Summit 2026", date: "2026-03-15T09:00:00", location: "Centro de Convenções SP", status: "Ativo", description: "Conferência anual de tecnologia" },
  { id: "2", name: "Workshop React Avançado", date: "2026-03-20T14:00:00", location: "Hub de Inovação RJ", status: "Ativo", description: "Workshop hands-on de React" },
  { id: "3", name: "Meetup Frontend", date: "2026-02-10T19:00:00", location: "Coworking Digital BH", status: "Encerrado", description: "Encontro mensal de devs frontend" },
  { id: "4", name: "Hackathon AI", date: "2026-04-01T08:00:00", location: "Campus Google SP", status: "Ativo", description: "Hackathon de inteligência artificial" },
  { id: "5", name: "DevOps Conference", date: "2026-01-25T10:00:00", location: "Teatro Municipal POA", status: "Encerrado", description: "Conferência sobre cultura DevOps" },
  { id: "6", name: "UX Design Week", date: "2026-03-28T09:00:00", location: "Museu da Imagem SP", status: "Ativo", description: "Semana dedicada ao design de experiência" },
]

export const mockParticipants: Participant[] = [
  { id: "1", name: "Ana Silva", email: "ana@email.com", eventId: "1", eventName: "Tech Summit 2026", checkedIn: true },
  { id: "2", name: "Carlos Oliveira", email: "carlos@email.com", eventId: "1", eventName: "Tech Summit 2026", checkedIn: false },
  { id: "3", name: "Maria Santos", email: "maria@email.com", eventId: "2", eventName: "Workshop React Avançado", checkedIn: true },
  { id: "4", name: "João Pereira", email: "joao@email.com", eventId: "2", eventName: "Workshop React Avançado", checkedIn: false },
  { id: "5", name: "Fernanda Costa", email: "fernanda@email.com", eventId: "3", eventName: "Meetup Frontend", checkedIn: true },
  { id: "6", name: "Pedro Almeida", email: "pedro@email.com", eventId: "4", eventName: "Hackathon AI", checkedIn: false },
  { id: "7", name: "Juliana Lima", email: "juliana@email.com", eventId: "1", eventName: "Tech Summit 2026", checkedIn: true },
  { id: "8", name: "Rafael Souza", email: "rafael@email.com", eventId: "6", eventName: "UX Design Week", checkedIn: false },
]

export const mockCheckinRules: CheckinRule[] = [
  { id: "1", eventId: "1", name: "QR Code", enabled: true, required: true, minutesBefore: 30, minutesAfter: 60 },
  { id: "2", eventId: "1", name: "Documento", enabled: true, required: false, minutesBefore: 15, minutesAfter: 30 },
  { id: "3", eventId: "1", name: "Lista Impressa", enabled: false, required: false, minutesBefore: 60, minutesAfter: 120 },
]

export const mockDashboard: DashboardData = {
  totalEvents: 6,
  totalParticipants: 8,
  recentCheckins: [
    { id: "1", participantName: "Ana Silva", eventName: "Tech Summit 2026", time: "2026-02-28T10:30:00" },
    { id: "2", participantName: "Maria Santos", eventName: "Workshop React Avançado", time: "2026-02-28T09:15:00" },
    { id: "3", participantName: "Fernanda Costa", eventName: "Meetup Frontend", time: "2026-02-27T19:05:00" },
    { id: "4", participantName: "Juliana Lima", eventName: "Tech Summit 2026", time: "2026-02-27T08:45:00" },
  ],
  upcomingEvents: [
    { id: "1", name: "Tech Summit 2026", date: "2026-03-15T09:00:00", location: "Centro de Convenções SP" },
    { id: "2", name: "Workshop React Avançado", date: "2026-03-20T14:00:00", location: "Hub de Inovação RJ" },
    { id: "6", name: "UX Design Week", date: "2026-03-28T09:00:00", location: "Museu da Imagem SP" },
    { id: "4", name: "Hackathon AI", date: "2026-04-01T08:00:00", location: "Campus Google SP" },
  ],
}

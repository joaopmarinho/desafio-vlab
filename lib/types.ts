export interface User {
  id: string
  name: string
  email: string
}

export interface AuthResponse {
  token: string
  user: User
}

export interface Event {
  id: string
  name: string
  date: string
  location: string
  status: "Ativo" | "Encerrado"
  description?: string
}

export interface Participant {
  id: string
  name: string
  email: string
  eventId: string
  eventName: string
  checkedIn: boolean
}

export interface CheckinRule {
  id: string
  eventId: string
  name: string
  enabled: boolean
  required: boolean
  minutesBefore: number
  minutesAfter: number
}

export interface DashboardData {
  totalEvents: number
  totalParticipants: number
  recentCheckins: {
    id: string
    participantName: string
    eventName: string
    time: string
  }[]
  upcomingEvents: {
    id: string
    name: string
    date: string
    location: string
  }[]
}

import type { Event, Participant, CheckinRule, DashboardData } from "./types"

export const mockEvents: Event[] = [
  { id: "1", name: "Tech Summit 2026", date: "2026-03-15T09:00:00", location: "Centro de Convenções SP", status: "Ativo", description: "Conferência anual de tecnologia" },
  { id: "2", name: "Workshop React Avançado", date: "2026-03-20T14:00:00", location: "Hub de Inovação RJ", status: "Ativo", description: "Workshop hands-on de React" },
  { id: "3", name: "Meetup Frontend", date: "2026-02-10T19:00:00", location: "Coworking Digital BH", status: "Encerrado", description: "Encontro mensal de devs frontend" },
  { id: "4", name: "Hackathon AI", date: "2026-04-01T08:00:00", location: "Campus Google SP", status: "Ativo", description: "Hackathon de inteligência artificial" },
  { id: "5", name: "DevOps Conference", date: "2026-01-25T10:00:00", location: "Teatro Municipal POA", status: "Encerrado", description: "Conferência sobre cultura DevOps" },
  { id: "6", name: "UX Design Week", date: "2026-03-28T09:00:00", location: "Museu da Imagem SP", status: "Ativo", description: "Semana dedicada ao design de experiência" },
  { id: "7", name: "Cloud Computing Forum", date: "2026-04-10T10:00:00", location: "Centro Empresarial Faria Lima SP", status: "Ativo", description: "Fórum sobre arquiteturas cloud-native" },
  { id: "8", name: "Cybersecurity Summit", date: "2026-04-15T09:00:00", location: "Hotel Intercity POA", status: "Ativo", description: "Conferência sobre segurança da informação" },
  { id: "9", name: "Data Engineering Meetup", date: "2026-02-05T18:30:00", location: "WeWork Paulista SP", status: "Encerrado", description: "Encontro sobre pipelines de dados" },
  { id: "10", name: "Mobile Dev Day", date: "2026-04-22T09:00:00", location: "FIAP Avenida Paulista SP", status: "Ativo", description: "Dia dedicado ao desenvolvimento mobile" },
  { id: "11", name: "Startup Weekend", date: "2026-05-02T18:00:00", location: "Cubo Itaú SP", status: "Ativo", description: "54 horas para criar uma startup" },
  { id: "12", name: "Python Brasil Regional", date: "2026-01-18T09:00:00", location: "UFMG BH", status: "Encerrado", description: "Conferência regional da comunidade Python" },
  { id: "13", name: "GraphQL Conference", date: "2026-05-10T10:00:00", location: "Google for Startups SP", status: "Ativo", description: "Tudo sobre APIs GraphQL" },
  { id: "14", name: "Agile Brazil", date: "2026-05-20T08:00:00", location: "Centro de Eventos FIERGS POA", status: "Ativo", description: "Maior conferência ágil do Brasil" },
  { id: "15", name: "Testing & QA Day", date: "2026-02-20T09:00:00", location: "TechPark Floripa SC", status: "Encerrado", description: "Dia dedicado a testes e qualidade" },
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
  { id: "9", name: "Beatriz Mendes", email: "beatriz@email.com", eventId: "7", eventName: "Cloud Computing Forum", checkedIn: true },
  { id: "10", name: "Lucas Ferreira", email: "lucas@email.com", eventId: "7", eventName: "Cloud Computing Forum", checkedIn: false },
  { id: "11", name: "Camila Rodrigues", email: "camila@email.com", eventId: "8", eventName: "Cybersecurity Summit", checkedIn: true },
  { id: "12", name: "Thiago Barbosa", email: "thiago@email.com", eventId: "4", eventName: "Hackathon AI", checkedIn: true },
  { id: "13", name: "Larissa Moura", email: "larissa@email.com", eventId: "10", eventName: "Mobile Dev Day", checkedIn: false },
  { id: "14", name: "Gabriel Nascimento", email: "gabriel@email.com", eventId: "11", eventName: "Startup Weekend", checkedIn: false },
  { id: "15", name: "Isabela Cardoso", email: "isabela@email.com", eventId: "2", eventName: "Workshop React Avançado", checkedIn: true },
  { id: "16", name: "Diego Martins", email: "diego@email.com", eventId: "8", eventName: "Cybersecurity Summit", checkedIn: false },
  { id: "17", name: "Amanda Teixeira", email: "amanda@email.com", eventId: "13", eventName: "GraphQL Conference", checkedIn: false },
  { id: "18", name: "Bruno Carvalho", email: "bruno@email.com", eventId: "1", eventName: "Tech Summit 2026", checkedIn: false },
  { id: "19", name: "Priscila Gomes", email: "priscila@email.com", eventId: "14", eventName: "Agile Brazil", checkedIn: false },
  { id: "20", name: "Renato Vieira", email: "renato@email.com", eventId: "6", eventName: "UX Design Week", checkedIn: true },
  { id: "21", name: "Natália Rocha", email: "natalia@email.com", eventId: "10", eventName: "Mobile Dev Day", checkedIn: false },
  { id: "22", name: "Felipe Araújo", email: "felipe@email.com", eventId: "11", eventName: "Startup Weekend", checkedIn: false },
]

export const mockCheckinRules: CheckinRule[] = [
  { id: "1", eventId: "1", name: "QR Code", enabled: true, required: true, minutesBefore: 30, minutesAfter: 60 },
  { id: "2", eventId: "1", name: "Documento", enabled: true, required: false, minutesBefore: 15, minutesAfter: 30 },
  { id: "3", eventId: "1", name: "Lista Impressa", enabled: false, required: false, minutesBefore: 60, minutesAfter: 120 },
]

export const mockDashboard: DashboardData = {
  totalEvents: 15,
  totalParticipants: 22,
  checkinCount: 8,
  recentCheckins: [
    { id: "1", participantName: "Ana Silva", eventName: "Tech Summit 2026", time: "2026-02-28T10:30:00" },
    { id: "2", participantName: "Maria Santos", eventName: "Workshop React Avançado", time: "2026-02-28T09:15:00" },
    { id: "3", participantName: "Fernanda Costa", eventName: "Meetup Frontend", time: "2026-02-27T19:05:00" },
    { id: "4", participantName: "Juliana Lima", eventName: "Tech Summit 2026", time: "2026-02-27T08:45:00" },
    { id: "5", participantName: "Beatriz Mendes", eventName: "Cloud Computing Forum", time: "2026-02-26T14:20:00" },
    { id: "6", participantName: "Camila Rodrigues", eventName: "Cybersecurity Summit", time: "2026-02-26T10:10:00" },
  ],
  upcomingEvents: [
    { id: "1", name: "Tech Summit 2026", date: "2026-03-15T09:00:00", location: "Centro de Convenções SP" },
    { id: "2", name: "Workshop React Avançado", date: "2026-03-20T14:00:00", location: "Hub de Inovação RJ" },
    { id: "6", name: "UX Design Week", date: "2026-03-28T09:00:00", location: "Museu da Imagem SP" },
    { id: "4", name: "Hackathon AI", date: "2026-04-01T08:00:00", location: "Campus Google SP" },
    { id: "7", name: "Cloud Computing Forum", date: "2026-04-10T10:00:00", location: "Centro Empresarial Faria Lima SP" },
    { id: "8", name: "Cybersecurity Summit", date: "2026-04-15T09:00:00", location: "Hotel Intercity POA" },
  ],
}

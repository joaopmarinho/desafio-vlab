// Re-exports dos schemas por domínio — backward compatibility
// Novos imports devem usar @/lib/schemas diretamente
export { eventFormSchema as eventSchema, type EventFormData } from "./schemas/event.schema"
export { participantFormSchema as participantSchema, type ParticipantFormData } from "./schemas/participant.schema"
export { loginSchema, type LoginFormData } from "./schemas/auth.schema"

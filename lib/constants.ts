import {
    LayoutDashboard,
    Calendar,
    Users,
    Settings,
} from "lucide-react"

export const navItems = [
    { href: "/", label: "Dashboard", icon: LayoutDashboard },
    { href: "/eventos", label: "Eventos", icon: Calendar },
    { href: "/participantes", label: "Participantes", icon: Users },
    { href: "/checkin", label: "Check-in", icon: Settings },
] as const

"use client"

import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface CheckinChartProps {
    checkinCount: number
    totalParticipants: number
}

export function CheckinChart({ checkinCount, totalParticipants }: CheckinChartProps) {
    const pending = totalParticipants - checkinCount

    const data = [
        { name: "Check-in feito", value: checkinCount },
        { name: "Pendente", value: pending },
    ]

    const colors = ["hsl(var(--chart-1))", "hsl(var(--chart-4))"]

    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-base font-semibold">Status de Check-in</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={data} layout="vertical" margin={{ left: 20, right: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" />
                            <XAxis type="number" tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }} />
                            <YAxis
                                type="category"
                                dataKey="name"
                                width={100}
                                tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: "hsl(var(--popover))",
                                    border: "1px solid hsl(var(--border))",
                                    borderRadius: "8px",
                                    color: "hsl(var(--popover-foreground))",
                                    fontSize: 12,
                                }}
                            />
                            <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={28}>
                                {data.map((_, index) => (
                                    <Cell key={index} fill={colors[index]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
                <p className="text-xs text-muted-foreground text-center mt-2">
                    {checkinCount} de {totalParticipants} participantes fizeram check-in
                </p>
            </CardContent>
        </Card>
    )
}

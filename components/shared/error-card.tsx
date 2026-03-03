"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle, RefreshCw } from "lucide-react"

interface ErrorCardProps {
    title?: string
    message?: string
    onRetry?: () => void
}

export function ErrorCard({
    title = "Erro ao carregar dados",
    message = "Ocorreu um erro inesperado. Tente novamente.",
    onRetry,
}: ErrorCardProps) {
    return (
        <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-destructive/10 mb-3">
                    <AlertTriangle className="h-6 w-6 text-destructive" />
                </div>
                <p className="text-sm font-medium text-foreground">{title}</p>
                <p className="text-xs text-muted-foreground mt-1">{message}</p>
                {onRetry && (
                    <Button variant="outline" size="sm" className="mt-4" onClick={onRetry}>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Tentar novamente
                    </Button>
                )}
            </CardContent>
        </Card>
    )
}

"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface TablePaginationProps {
    currentPage: number
    totalPages: number
    totalItems: number
    itemsPerPage: number
    onPageChange: (page: number) => void
}

export function TablePagination({
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    onPageChange,
}: TablePaginationProps) {
    if (totalPages <= 1) return null

    const startItem = (currentPage - 1) * itemsPerPage + 1
    const endItem = Math.min(currentPage * itemsPerPage, totalItems)

    return (
        <div className="flex items-center justify-between px-2 py-3">
            <p className="text-xs text-muted-foreground">
                Mostrando {startItem}–{endItem} de {totalItems}
            </p>
            <div className="flex items-center gap-1">
                <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    aria-label="Página anterior"
                >
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                        key={page}
                        variant={page === currentPage ? "default" : "outline"}
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => onPageChange(page)}
                    >
                        {page}
                    </Button>
                ))}
                <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    aria-label="Próxima página"
                >
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
    )
}

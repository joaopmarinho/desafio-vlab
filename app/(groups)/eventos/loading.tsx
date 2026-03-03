import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

export default function EventosLoading() {
    return (
        <div className="flex flex-col gap-6">
            <div>
                <Skeleton className="h-8 w-40" />
                <Skeleton className="h-4 w-64 mt-2" />
            </div>
            <Skeleton className="h-10 w-full" />
            <Card>
                <CardContent className="p-4">
                    <div className="flex flex-col gap-3">
                        {Array.from({ length: 4 }).map((_, i) => (
                            <Skeleton key={i} className="h-14 rounded-lg" />
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

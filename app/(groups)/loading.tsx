import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

export default function DashboardLoading() {
    return (
        <div className="flex flex-col gap-6">
            <div>
                <Skeleton className="h-8 w-40" />
                <Skeleton className="h-4 w-64 mt-2" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <Card key={i}>
                        <CardContent className="p-6">
                            <Skeleton className="h-4 w-24 mb-2" />
                            <Skeleton className="h-8 w-16" />
                        </CardContent>
                    </Card>
                ))}
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                    <CardContent className="p-6">
                        <Skeleton className="h-4 w-32 mb-4" />
                        {Array.from({ length: 3 }).map((_, i) => (
                            <Skeleton key={i} className="h-12 rounded-lg mb-2" />
                        ))}
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-6">
                        <Skeleton className="h-4 w-32 mb-4" />
                        {Array.from({ length: 3 }).map((_, i) => (
                            <Skeleton key={i} className="h-12 rounded-lg mb-2" />
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

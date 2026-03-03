import { Skeleton } from "@/components/ui/skeleton"

export default function CheckinLoading() {
    return (
        <div className="flex flex-col gap-6">
            <div>
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-4 w-96 mt-2" />
            </div>
            <Skeleton className="h-10 w-64" />
            <div className="flex flex-col gap-4">
                {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="h-32 rounded-lg" />
                ))}
            </div>
        </div>
    )
}

import { Skeleton } from "@/components/ui/skeleton";


function LoadingSkeleton() {
  return (
    <div className="rounded-lg border p-4 space-y-3">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-3 w-24" />
    </div>
  )
}

export default LoadingSkeleton

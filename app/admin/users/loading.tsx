import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Skeleton className="h-8 w-40 bg-white/5" />
        <Skeleton className="h-10 w-32 bg-white/5" />
      </div>

      <div className="flex flex-col md:flex-row gap-4 md:items-center">
        <Skeleton className="h-10 w-full md:w-64 bg-white/5" />
        <Skeleton className="h-10 w-full md:w-80 bg-white/5" />
      </div>

      <div className="rounded-lg border border-white/10 bg-black/20 p-6">
        <div className="flex items-center mb-6">
          <Skeleton className="h-8 w-8 rounded-md mr-2 bg-white/5" />
          <Skeleton className="h-6 w-40 bg-white/5" />
        </div>

        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-32 bg-white/5" />
          ))}
        </div>

        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center">
                <Skeleton className="h-8 w-8 rounded-full mr-2 bg-white/5" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32 bg-white/5" />
                  <Skeleton className="h-3 w-24 bg-white/5" />
                </div>
              </div>
              <Skeleton className="h-8 w-20 bg-white/5" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

import { Skeleton } from "@/components/ui/skeleton";

export default function HomeLoading() {
  return (
    <main className="flex-1">
      {/* Hero Skeleton */}
      <div className="bg-slate-900 py-20 px-4 flex flex-col items-center justify-center space-y-6">
        <Skeleton className="h-14 w-[80%] max-w-2xl bg-slate-700" />
        <Skeleton className="h-6 w-[60%] max-w-lg bg-slate-800" />
        <div className="flex gap-4 pt-4">
          <Skeleton className="h-12 w-36 bg-slate-700" />
          <Skeleton className="h-12 w-48 bg-slate-800" />
        </div>
      </div>

      {/* Grid Skeleton */}
      <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-6 w-24" />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden">
              <Skeleton className="h-48 w-full rounded-none" />
              <div className="p-4 space-y-3">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-32" />
              </div>
              <div className="p-4 border-t bg-slate-50 flex justify-between items-center">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-9 w-24" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
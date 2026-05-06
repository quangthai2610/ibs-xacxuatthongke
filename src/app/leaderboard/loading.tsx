export default function LeaderboardLoading() {
  return (
    <div className="flex flex-col h-full bg-slate-50 animate-pulse">
      <header className="px-6 pt-12 pb-4 bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <div className="h-8 bg-slate-200 rounded w-48"></div>
        </div>
        {/* Filters Skeleton */}
        <div className="flex gap-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-8 bg-slate-200 rounded-full w-20"></div>
          ))}
        </div>
      </header>

      <main className="flex-1 p-6 overflow-y-auto pb-24">
        {/* Tabs Skeleton */}
        <div className="flex bg-slate-200/50 p-1 rounded-xl mb-6">
          <div className="flex-1 h-10 bg-white rounded-lg shadow-sm"></div>
          <div className="flex-1 h-10 bg-transparent rounded-lg"></div>
        </div>

        {/* List Skeleton */}
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-4">
              <div className="w-10 h-10 bg-slate-200 rounded-full flex-shrink-0"></div>
              <div className="flex-1">
                <div className="h-5 bg-slate-200 rounded w-32 mb-2"></div>
                <div className="h-4 bg-slate-200 rounded w-24"></div>
              </div>
              <div className="text-right">
                <div className="h-6 bg-slate-200 rounded w-20 mb-1"></div>
                <div className="h-4 bg-slate-200 rounded w-16 ml-auto"></div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

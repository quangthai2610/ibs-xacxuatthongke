export default function HistoryLoading() {
  return (
    <div className="flex flex-col h-full bg-slate-50 animate-pulse">
      <header className="px-6 pt-12 pb-4 bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="h-8 bg-slate-200 rounded w-32 mb-4"></div>
        
        {/* Tabs Skeleton */}
        <div className="flex bg-slate-100 p-1 rounded-xl">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex-1 h-9 bg-slate-200 rounded-lg mx-0.5"></div>
          ))}
        </div>
      </header>

      <main className="flex-1 p-6 overflow-y-auto pb-24">
        {/* List Skeleton */}
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="block bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
              <div className="flex justify-between items-center border-b border-slate-50 pb-3 mb-3">
                <div className="h-3 bg-slate-200 rounded w-28"></div>
                <div className="h-5 bg-slate-200 rounded w-16"></div>
              </div>
              
              <div className="flex justify-between items-center">
                <div className="flex-1">
                  <div className="h-5 bg-slate-200 rounded w-32 mb-2"></div>
                  <div className="h-3 bg-slate-200 rounded w-48"></div>
                </div>
                <div className="w-5 h-5 bg-slate-200 rounded-full"></div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

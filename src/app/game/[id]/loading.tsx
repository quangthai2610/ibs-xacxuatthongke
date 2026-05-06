import { ChevronLeft } from "lucide-react";

export default function GameLoading() {
  return (
    <div className="flex flex-col h-full bg-slate-50 animate-pulse">
      {/* Header Skeleton */}
      <header className="px-4 py-4 bg-white border-b border-slate-200 flex items-center justify-between shadow-sm sticky top-0 z-20">
        <div className="flex items-center">
          <div className="p-2 -ml-2 text-slate-300">
            <ChevronLeft className="w-6 h-6" />
          </div>
          <div className="h-6 bg-slate-200 rounded w-24 ml-1"></div>
        </div>
        <div className="h-8 bg-slate-200 rounded-full w-24"></div>
      </header>

      <main className="flex-1 overflow-y-auto pb-[200px]">
        {/* Table Header Skeleton */}
        <div className="sticky top-0 bg-slate-100 border-b border-slate-200 grid grid-cols-5 py-3 shadow-sm z-10">
          <div className="col-span-1 border-r border-slate-200 flex justify-center">
            <div className="h-4 bg-slate-200 rounded w-8"></div>
          </div>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex flex-col items-center justify-center px-1">
              <div className="h-4 bg-slate-200 rounded w-12 mb-1"></div>
              <div className="h-3 bg-slate-200 rounded w-8"></div>
            </div>
          ))}
        </div>

        {/* Rounds List Skeleton */}
        <div className="divide-y divide-slate-100 bg-white">
          {[1, 2, 3, 4, 5].map((round) => (
            <div key={round} className="grid grid-cols-5 py-4 items-center">
              <div className="col-span-1 border-r border-slate-100 flex justify-center">
                <div className="h-4 bg-slate-200 rounded w-4"></div>
              </div>
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex justify-center">
                  <div className="h-5 bg-slate-200 rounded w-8"></div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </main>

      {/* Fixed Bottom Form Skeleton */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 pb-[env(safe-area-inset-bottom)] shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.1)] z-20 w-full max-w-md mx-auto">
        <div className="grid grid-cols-4 gap-2 mb-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="h-3 bg-slate-200 rounded w-12 mb-2"></div>
              <div className="h-10 bg-slate-200 rounded-xl w-full"></div>
            </div>
          ))}
        </div>
        <div className="h-12 bg-sky-200 rounded-xl w-full"></div>
      </div>
    </div>
  );
}

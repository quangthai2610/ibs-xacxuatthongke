import { Loader2 } from "lucide-react";
import Image from "next/image";

export default function Loading() {
  return (
    <div className="flex flex-col h-full bg-slate-50 animate-pulse">
      {/* Header Skeleton */}
      <header className="px-6 pt-12 pb-6 bg-white border-b border-slate-200 shadow-sm z-10 sticky top-0 flex flex-col items-center text-center">
        <div className="w-16 h-16 bg-slate-200 rounded-2xl mb-3 shadow-sm flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-slate-400 animate-spin" />
        </div>
        <div className="h-8 bg-slate-200 rounded w-48 mb-2"></div>
        <div className="h-4 bg-slate-200 rounded w-40"></div>
      </header>

      {/* Main Content Skeleton */}
      <main className="flex-1 p-6 overflow-y-auto pb-24 flex flex-col">
        <div className="space-y-10 mt-4">
          <div className="flex items-center justify-between mb-2">
            <div className="h-5 bg-slate-200 rounded w-24"></div>
          </div>

          <div className="grid grid-cols-1 gap-12">
            {[1, 2, 3].map((i) => (
              <div key={i} className="block relative w-full max-w-[260px] h-40 mx-auto">
                <div className="absolute inset-4 bg-slate-200 rounded-[3rem] shadow-sm"></div>
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-slate-300 border-[3px] border-white shadow-sm"></div>
                <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-slate-300 border-[3px] border-white shadow-sm"></div>
                <div className="absolute top-1/2 -left-6 -translate-y-1/2 w-9 h-9 rounded-full bg-slate-300 border-[3px] border-white shadow-sm"></div>
                <div className="absolute top-1/2 -right-6 -translate-y-1/2 w-9 h-9 rounded-full bg-slate-300 border-[3px] border-white shadow-sm"></div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

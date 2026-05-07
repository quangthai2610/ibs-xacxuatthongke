import { getFinishedGames } from "@/app/actions/game";
import Link from "next/link";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Calendar, ChevronRight, CheckCircle2 } from "lucide-react";
import clsx from "clsx";


export default async function HistoryPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const filter = (resolvedSearchParams.filter as "all" | "week" | "month") || "all";
  const games = await getFinishedGames(filter);

  const filters = [
    { id: "all", label: "Tất cả" },
    { id: "week", label: "Tuần này" },
    { id: "month", label: "Tháng này" },
  ];

  return (
    <div className="flex flex-col h-dvh bg-slate-50">
      <header className="px-6 pt-12 pb-4 bg-white border-b border-slate-200 z-10 shrink-0">
        <h1 className="text-2xl font-bold text-slate-900 mb-4">Lịch sử</h1>
        
        {/* Tabs */}
        <div className="flex bg-slate-100 p-1 rounded-xl">
          {filters.map((f) => {
            const isActive = filter === f.id;
            return (
              <Link
                key={f.id}
                href={`/history?filter=${f.id}`}
                className={clsx(
                  "flex-1 text-center py-2 text-sm font-medium rounded-lg transition-all",
                  isActive ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                )}
              >
                {f.label}
              </Link>
            );
          })}
        </div>
      </header>

      <main className="flex-1 p-6 overflow-y-auto pb-24 min-h-0">
        {games.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 text-slate-400">
            <Calendar className="w-10 h-10 mb-2 opacity-30" />
            <p>Chưa có trận nào</p>
          </div>
        ) : (
          <div className="space-y-4">
            {games.map((game) => {
              const dateObj = new Date(game.created_at);
              const winner = game.players?.find((p: any) => p.final_rank === 1);
              
              return (
                <Link
                  key={game.id}
                  href={`/game/${game.id}/result`}
                  className="block bg-white border border-slate-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
                >
                  <div className="flex justify-between items-center border-b border-slate-50 pb-3 mb-3">
                    <span className="text-xs font-semibold text-slate-400">
                      {format(new Date(dateObj.getTime() + 7 * 60 * 60 * 1000), "dd/MM/yyyy • HH:mm", { locale: vi })}
                    </span>
                    <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded-md text-[10px] font-bold">
                      Bill: {Number(game.total_bill_amount || 0).toLocaleString("vi-VN")}đ
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex-1">
                      <div className="flex items-center gap-1.5 mb-1">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        <span className="font-bold text-slate-800 text-sm">
                          {winner?.name || "Chưa rõ"} thắng
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 truncate pr-4">
                        Cùng chơi: {game.players?.filter((p: any) => p.id !== winner?.id).map((p: any) => p.name).join(", ")}
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-slate-300" />
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

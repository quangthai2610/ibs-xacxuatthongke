import Link from "next/link";
import { Plus, Clock, Users } from "lucide-react";
import { getActiveGames } from "./actions/game";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";
import Image from "next/image";
import RealtimeSubscription from "@/components/RealtimeSubscription";


export default async function Home() {
  const activeGames = await getActiveGames();

  return (
    <div className="flex flex-col h-dvh bg-slate-50">
      <RealtimeSubscription table="games" />
      <header className="px-6 pt-12 pb-6 bg-white border-b border-slate-200 shadow-sm z-10 shrink-0 flex flex-col items-center text-center">
        <Image src="/icon-192.png" alt="Xác Xuất Thống Kê Logo" width={64} height={64} className="mb-3 rounded-2xl shadow-md" />
        <h1 className="text-3xl font-extrabold bg-gradient-to-r from-sky-500 to-indigo-500 bg-clip-text text-transparent">
          Xác Xuất Thống Kê
        </h1>
        <p className="text-slate-500 mt-1">Ghi điểm dễ dàng, không lo tính nhầm</p>
      </header>

      <main className="flex-1 p-6 overflow-y-auto pb-24 flex flex-col min-h-0">
        <div className="space-y-10 mt-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
              Sảnh ({(activeGames?.length || 0) + 1} bàn)
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-12">
            {/* Bàn Bingo cố định */}
            <Link
              href="/bingo"
              className="block relative w-full max-w-[260px] h-40 mx-auto transition-transform hover:scale-105 active:scale-95 group"
            >
              {/* Bàn Bingo */}
              <div className="absolute inset-4 bg-gradient-to-br from-amber-500 to-orange-600 rounded-[3rem] border-4 border-amber-700 shadow-lg flex flex-col items-center justify-center group-hover:from-amber-400 group-hover:to-orange-500 transition-all">
                <div className="w-10 h-10 bg-amber-700/40 rounded-full flex items-center justify-center mb-1">
                  <span className="text-xl">🎱</span>
                </div>
                <span className="text-amber-100 font-bold text-xs uppercase tracking-wider">Sảnh Bingo</span>
                <div className="text-[10px] text-amber-200/80 mt-1 flex items-center bg-amber-900/30 px-2 py-0.5 rounded-full">
                  Luôn mở
                </div>
              </div>

              {/* 4 góc trang trí bóng Bingo */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex flex-col items-center z-10 drop-shadow-md">
                <div className="w-9 h-9 rounded-full bg-red-500 text-white flex items-center justify-center text-sm font-bold border-[3px] border-white shadow-sm">B</div>
              </div>
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 flex flex-col items-center z-10 drop-shadow-md">
                <div className="w-9 h-9 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold border-[3px] border-white shadow-sm">I</div>
              </div>
              <div className="absolute top-1/2 -left-3 -translate-y-1/2 flex flex-col items-center z-10 drop-shadow-md">
                <div className="w-9 h-9 rounded-full bg-emerald-500 text-white flex items-center justify-center text-sm font-bold border-[3px] border-white shadow-sm">N</div>
              </div>
              <div className="absolute top-1/2 -right-3 -translate-y-1/2 flex flex-col items-center z-10 drop-shadow-md">
                <div className="w-9 h-9 rounded-full bg-purple-500 text-white flex items-center justify-center text-sm font-bold border-[3px] border-white shadow-sm">G</div>
              </div>
            </Link>

            {/* Các bàn game */}
            {activeGames && activeGames.map((game, index) => {
              const p = game.players || [];
              const playerTop = p[0]?.name || "Trống";
              const playerBottom = p[1]?.name || "Trống";
              const playerLeft = p[2]?.name || "Trống";
              const playerRight = p[3]?.name || "Trống";

              return (
                <Link
                  key={game.id}
                  href={`/game/${game.id}`}
                  className="block relative w-full max-w-[260px] h-40 mx-auto transition-transform hover:scale-105 active:scale-95 group"
                >
                  {/* Bàn cờ */}
                  <div className="absolute inset-4 bg-emerald-600 rounded-[3rem] border-4 border-emerald-800 shadow-lg flex flex-col items-center justify-center group-hover:bg-emerald-500 transition-colors">
                    <div className="w-10 h-10 bg-emerald-700/50 rounded-full flex items-center justify-center mb-1">
                      <span className="text-xl">🃏</span>
                    </div>
                    <span className="text-emerald-100 font-bold text-xs uppercase tracking-wider">Bàn {index + 1}</span>
                    <div className="text-[10px] text-emerald-200/80 mt-1 flex items-center bg-emerald-900/30 px-2 py-0.5 rounded-full">
                      <Clock className="w-3 h-3 mr-1" />
                      {formatDistanceToNow(new Date(game.created_at), { addSuffix: true, locale: vi })}
                    </div>
                  </div>

                  {/* Vị trí trên */}
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex flex-col items-center z-10 drop-shadow-md">
                    <div className="w-9 h-9 rounded-full bg-slate-800 text-white flex items-center justify-center text-sm font-bold border-[3px] border-white shadow-sm">
                      {playerTop.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-[10px] font-bold text-slate-700 mt-0.5 truncate max-w-[70px] text-center bg-white/90 backdrop-blur-sm rounded-md px-1.5 py-0.5 border border-slate-200">
                      {playerTop}
                    </span>
                  </div>

                  {/* Vị trí dưới */}
                  <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 flex flex-col items-center z-10 drop-shadow-md">
                    <div className="w-9 h-9 rounded-full bg-slate-800 text-white flex items-center justify-center text-sm font-bold border-[3px] border-white shadow-sm">
                      {playerBottom.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-[10px] font-bold text-slate-700 mt-0.5 truncate max-w-[70px] text-center bg-white/90 backdrop-blur-sm rounded-md px-1.5 py-0.5 border border-slate-200">
                      {playerBottom}
                    </span>
                  </div>

                  {/* Vị trí trái */}
                  <div className="absolute top-1/2 -left-6 -translate-y-1/2 flex flex-col items-center z-10 drop-shadow-md">
                    <div className="w-9 h-9 rounded-full bg-slate-800 text-white flex items-center justify-center text-sm font-bold border-[3px] border-white shadow-sm">
                      {playerLeft.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-[10px] font-bold text-slate-700 mt-0.5 truncate max-w-[70px] text-center bg-white/90 backdrop-blur-sm rounded-md px-1.5 py-0.5 border border-slate-200">
                      {playerLeft}
                    </span>
                  </div>

                  {/* Vị trí phải */}
                  <div className="absolute top-1/2 -right-6 -translate-y-1/2 flex flex-col items-center z-10 drop-shadow-md">
                    <div className="w-9 h-9 rounded-full bg-slate-800 text-white flex items-center justify-center text-sm font-bold border-[3px] border-white shadow-sm">
                      {playerRight.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-[10px] font-bold text-slate-700 mt-0.5 truncate max-w-[70px] text-center bg-white/90 backdrop-blur-sm rounded-md px-1.5 py-0.5 border border-slate-200">
                      {playerRight}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 max-w-sm mx-auto w-full">
          <Link
            href="/game/new"
            className="w-full bg-sky-500 hover:bg-sky-600 active:bg-sky-700 text-white font-semibold py-4 px-6 rounded-2xl shadow-lg shadow-sky-500/30 flex items-center justify-center gap-2 transition-all transform active:scale-95"
          >
            <Plus className="w-6 h-6" />
            <span>Tạo bàn mới</span>
          </Link>
        </div>
      </main>
    </div>
  );
}

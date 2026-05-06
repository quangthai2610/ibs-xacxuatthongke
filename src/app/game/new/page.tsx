"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createGame } from "@/app/actions/game";
import { ChevronLeft, Users, Loader2 } from "lucide-react";
import Link from "next/link";

export default function NewGamePage() {
  const router = useRouter();
  const [players, setPlayers] = useState(["", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (players.some((p) => p.trim() === "")) {
      setError("Vui lòng nhập đầy đủ tên 4 người chơi");
      return;
    }

    setIsLoading(true);
    try {
      const gameId = await createGame(players);
      router.push(`/game/${gameId}`);
    } catch (err: any) {
      setError(err.message || "Đã xảy ra lỗi");
      setIsLoading(false);
    }
  };

  const updatePlayer = (index: number, value: string) => {
    const newPlayers = [...players];
    newPlayers[index] = value;
    setPlayers(newPlayers);
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <header className="px-4 pt-12 pb-4 bg-white border-b border-slate-200 flex items-center shadow-sm">
        <Link href="/" className="p-2 -ml-2 text-slate-500 hover:text-slate-900 active:scale-95 transition-transform">
          <ChevronLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-xl font-bold text-slate-900 ml-2">Tạo bàn mới</h1>
      </header>

      <main className="flex-1 p-6 overflow-y-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 bg-sky-100 text-sky-600 rounded-full flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-semibold text-slate-800">Người chơi</h2>
              <p className="text-xs text-slate-500">Nhập tên 4 người tham gia</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {players.map((player, index) => (
              <div key={index}>
                <label className="block text-xs font-medium text-slate-500 mb-1 ml-1">
                  Người chơi {index + 1}
                </label>
                <input
                  type="text"
                  value={player}
                  onChange={(e) => updatePlayer(index, e.target.value)}
                  placeholder={`Nhập tên người ${index + 1}`}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 transition-all"
                  required
                />
              </div>
            ))}

            {error && <p className="text-red-500 text-sm mt-2 px-1">{error}</p>}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-8 bg-sky-500 hover:bg-sky-600 active:bg-sky-700 disabled:bg-slate-300 text-white font-semibold py-4 px-6 rounded-xl shadow-md shadow-sky-500/20 flex items-center justify-center gap-2 transition-all"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>Bắt đầu chơi</span>}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

"use client";

import { useState } from "react";
import { addRound } from "@/app/actions/game";
import { Plus, Loader2, X } from "lucide-react";
import ScoreKeypad from "./ScoreKeypad";

interface Player {
  id: string;
  name: string;
}

export default function ScoreForm({
  gameId,
  players,
  nextRoundNumber,
}: {
  gameId: string;
  players: Player[];
  nextRoundNumber: number;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [scores, setScores] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const openModal = () => {
    const defaultScores: Record<string, string> = {};
    players.forEach((p) => {
      defaultScores[p.id] = "";
    });
    setScores(defaultScores);
    setError("");
    setIsOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const parsedScores: Record<string, number> = {};

    for (const p of players) {
      const scoreStr = scores[p.id];
      const val = (scoreStr === undefined || scoreStr === "" || scoreStr === "-") ? 0 : parseInt(scoreStr, 10);
      
      if (isNaN(val)) {
        setError("Điểm phải là số");
        return;
      }
      parsedScores[p.id] = val;
    }

    // Đóng form ngay lập tức để tạo cảm giác mượt mà
    setIsOpen(false);
    setScores({});

    // Chạy ngầm server action
    setIsLoading(true);
    addRound(gameId, nextRoundNumber, parsedScores)
      .catch((err: any) => {
        alert(err.message || "Lỗi lưu điểm");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <>
      <button
        onClick={openModal}
        className="w-full bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white font-semibold py-4 px-6 rounded-2xl shadow-lg flex items-center justify-center gap-2 transition-all transform active:scale-95"
      >
        <Plus className="w-6 h-6" />
        <span>Thêm ván {nextRoundNumber}</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-md rounded-t-3xl p-5 pb-[calc(1rem+env(safe-area-inset-bottom))] shadow-2xl animate-in slide-in-from-bottom-full duration-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-slate-800">
                Nhập điểm ván {nextRoundNumber}
              </h2>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-slate-600 bg-slate-100 rounded-full p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <ScoreKeypad
                players={players}
                scores={scores}
                onScoresChange={setScores}
              />

              {error && <p className="text-red-500 text-sm mt-3 font-medium px-1">{error}</p>}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-4 bg-sky-500 hover:bg-sky-600 active:bg-sky-700 disabled:bg-slate-300 text-white font-bold py-3.5 px-6 rounded-xl shadow-md shadow-sky-500/20 flex items-center justify-center gap-2 transition-all"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
                <span>Lưu điểm</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

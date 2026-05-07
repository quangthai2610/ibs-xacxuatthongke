"use client";

import { useState, useRef, useEffect } from "react";
import { addRound } from "@/app/actions/game";
import { Plus, Loader2 } from "lucide-react";

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
    // Khởi tạo mặc định điểm là 0 cho tất cả
    const defaultScores: Record<string, string> = {};
    players.forEach((p) => {
      defaultScores[p.id] = "0";
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
      if (scores[p.id] === undefined || scores[p.id] === "") {
        setError("Vui lòng nhập điểm cho tất cả người chơi (mặc định là 0)");
        return;
      }
      const val = parseInt(scores[p.id], 10);
      if (isNaN(val)) {
        setError("Điểm phải là số");
        return;
      }
      parsedScores[p.id] = val;
    }

    // Đóng form ngay lập tức để tạo cảm giác mượt mà
    setIsOpen(false);
    setScores({}); // Xóa dữ liệu cũ

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

  const handleChange = (pid: string, val: string) => {
    // Cho phép: số, dấu trừ ở đầu, và xóa ký tự
    // Regex: optional dấu trừ + một hoặc nhiều chữ số
    const sanitized = val.replace(/[^\d-]/g, "");
    
    // Đảm bảo dấu trừ chỉ ở đầu
    if (sanitized.includes("-")) {
      const withoutMinus = sanitized.replace(/-/g, "");
      setScores((prev) => ({ ...prev, [pid]: "-" + withoutMinus }));
    } else {
      setScores((prev) => ({ ...prev, [pid]: sanitized }));
    }
  };

  return (
    <>
      <button
        onClick={openModal}
        className="w-full bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white font-semibold py-4 px-6 rounded-2xl shadow-lg flex items-center justify-center gap-2 transition-all transform"
      >
        <Plus className="w-6 h-6" />
        <span>Thêm ván {nextRoundNumber}</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-sm sm:p-4">
          <div className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl animate-in slide-in-from-bottom-full sm:zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-slate-800">
                Nhập điểm ván {nextRoundNumber}
              </h2>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-slate-600 bg-slate-100 rounded-full p-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4 mb-6">
                {players.map((p) => (
                  <div key={p.id} className="flex flex-col bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <label className="text-xs font-bold text-slate-600 truncate mb-2">
                      {p.name}
                    </label>
                    <input
                      type="text"
                      inputMode="decimal"
                      enterKeyHint="done"
                      value={scores[p.id] || ""}
                      onChange={(e) => handleChange(p.id, e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleSubmit(e as any);
                        }
                      }}
                      className="w-full text-center bg-white border border-slate-200 rounded-lg py-2.5 text-lg font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/50 transition-all"
                      placeholder="0"
                      autoComplete="off"
                      spellCheck="false"
                    />
                  </div>
                ))}
              </div>

              {error && <p className="text-red-500 text-sm mb-4 font-medium px-1">{error}</p>}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-sky-500 hover:bg-sky-600 active:bg-sky-700 disabled:bg-slate-300 text-white font-bold py-4 px-6 rounded-xl shadow-md shadow-sky-500/20 flex items-center justify-center gap-2 transition-all"
              >
                {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Plus className="w-6 h-6" />}
                <span>Lưu điểm</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

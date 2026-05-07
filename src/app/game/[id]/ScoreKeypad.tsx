"use client";

import { useState } from "react";
import { Delete, Plus, Minus } from "lucide-react";

interface Player {
  id: string;
  name: string;
}

export default function ScoreKeypad({
  players,
  scores,
  onScoresChange,
}: {
  players: Player[];
  scores: Record<string, string>;
  onScoresChange: (scores: Record<string, string>) => void;
}) {
  const [activePlayerId, setActivePlayerId] = useState<string>(players[0]?.id || "");

  const getDisplayValue = (pid: string) => {
    const val = scores[pid];
    if (val === undefined || val === "") return "0";
    return val;
  };

  const handleKeyPress = (key: string) => {
    if (!activePlayerId) return;

    const current = scores[activePlayerId] || "";

    if (key === "backspace") {
      // Xóa ký tự cuối
      if (current.length <= 1) {
        onScoresChange({ ...scores, [activePlayerId]: "" });
      } else {
        onScoresChange({ ...scores, [activePlayerId]: current.slice(0, -1) });
      }
      return;
    }

    if (key === "plus_minus") {
      // Đổi dấu
      if (current.startsWith("-")) {
        onScoresChange({ ...scores, [activePlayerId]: current.slice(1) });
      } else if (current !== "" && current !== "0") {
        onScoresChange({ ...scores, [activePlayerId]: "-" + current });
      } else {
        onScoresChange({ ...scores, [activePlayerId]: "-" });
      }
      return;
    }

    // Số 0-9
    if (current === "0") {
      // Thay thế số 0 đứng đầu
      onScoresChange({ ...scores, [activePlayerId]: key });
    } else if (current === "-0") {
      onScoresChange({ ...scores, [activePlayerId]: "-" + key });
    } else {
      // Giới hạn tối đa 5 ký tự (bao gồm dấu trừ)
      if (current.length >= 5) return;
      onScoresChange({ ...scores, [activePlayerId]: current + key });
    }
  };

  const keys = [
    ["1", "2", "3"],
    ["4", "5", "6"],
    ["7", "8", "9"],
    ["plus_minus", "0", "backspace"],
  ];

  return (
    <div>
      {/* Player score tabs */}
      <div className="grid grid-cols-4 gap-2 mb-4">
        {players.map((p) => {
          const isActive = activePlayerId === p.id;
          const displayVal = getDisplayValue(p.id);
          const numVal = parseInt(displayVal, 10) || 0;
          
          return (
            <button
              key={p.id}
              type="button"
              onClick={() => setActivePlayerId(p.id)}
              className={`flex flex-col items-center p-2.5 rounded-xl border-2 transition-all ${
                isActive
                  ? "border-sky-500 bg-sky-50 shadow-sm shadow-sky-500/10"
                  : "border-slate-100 bg-slate-50"
              }`}
            >
              <span className={`text-[10px] font-bold truncate w-full text-center ${isActive ? "text-sky-700" : "text-slate-500"}`}>
                {p.name}
              </span>
              <span className={`text-lg font-extrabold mt-0.5 ${
                numVal > 0 ? "text-emerald-600" : numVal < 0 ? "text-red-500" : isActive ? "text-sky-700" : "text-slate-400"
              }`}>
                {displayVal === "" || displayVal === "-" ? (displayVal || "0") : (numVal > 0 ? `+${displayVal}` : displayVal)}
              </span>
            </button>
          );
        })}
      </div>

      {/* Custom Keypad */}
      <div className="grid grid-cols-3 gap-2">
        {keys.map((row, ri) =>
          row.map((key) => {
            if (key === "plus_minus") {
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleKeyPress(key)}
                  className="h-12 rounded-xl bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 font-bold text-lg flex items-center justify-center gap-1 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>/</span>
                  <Minus className="w-3.5 h-3.5" />
                </button>
              );
            }
            if (key === "backspace") {
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => handleKeyPress(key)}
                  onMouseDown={(e) => e.preventDefault()}
                  className="h-12 rounded-xl bg-slate-100 hover:bg-red-50 active:bg-red-100 text-slate-600 hover:text-red-500 font-bold flex items-center justify-center transition-colors"
                >
                  <Delete className="w-5 h-5" />
                </button>
              );
            }
            return (
              <button
                key={key}
                type="button"
                onClick={() => handleKeyPress(key)}
                className="h-12 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 active:bg-slate-100 text-slate-900 font-bold text-xl flex items-center justify-center transition-colors shadow-sm active:shadow-none"
              >
                {key}
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}

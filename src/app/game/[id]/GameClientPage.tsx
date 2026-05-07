"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { ChevronLeft, Settings, X, Check, Loader2, TrendingUp, BarChart3 } from "lucide-react";
import ScoreForm from "./ScoreForm";
import EndGameButton from "./EndGameButton";
import RoundList from "./RoundList";
import GameAuthGate from "./GameAuthGate";
import GameProgressionChart from "./GameProgressionChart";
import { updatePlayerName } from "@/app/actions/game";

interface Player {
  id: string;
  name: string;
}

interface Round {
  id: string;
  round_number: number;
  scores: Record<string, number>;
}

const AVATARS = ["👨‍🚀", "🧙‍♂️", "🧙‍♀️", "🕵️‍♂️", "🕵️‍♀️", "🧛‍♂️", "🧛‍♀️", "🧟‍♂️", "🧟‍♀️", "🧞‍♂️"];

export default function GameClientPage({
  gameId,
  players,
  rounds,
  totalScores,
  isFinished,
  hasPassword,
  nextRoundNumber,
}: {
  gameId: string;
  players: Player[];
  rounds: Round[];
  totalScores: Record<string, number>;
  isFinished: boolean;
  hasPassword: boolean;
  nextRoundNumber: number;
}) {
  const [showSettings, setShowSettings] = useState(false);
  const [showChart, setShowChart] = useState(false);
  const [editNames, setEditNames] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [settingsError, setSettingsError] = useState("");

  // Tính toán chuỗi thắng (Streaks)
  const streaks = useMemo(() => {
    const currentStreaks: Record<string, number> = {};
    players.forEach(p => currentStreaks[p.id] = 0);

    // Sắp xếp ván theo thứ tự thời gian (từ ván 1 trở đi) để tính chuỗi
    const sortedRounds = [...rounds].sort((a, b) => a.round_number - b.round_number);

    sortedRounds.forEach(round => {
      // Tìm người cao điểm nhất trong ván này
      let maxScore = -Infinity;
      let winnerId = "";
      
      players.forEach(p => {
        const score = round.scores[p.id] || 0;
        if (score > maxScore) {
          maxScore = score;
          winnerId = p.id;
        }
      });

      // Nếu có người thắng (maxScore > 0 hoặc ít nhất là người cao nhất)
      players.forEach(p => {
        if (p.id === winnerId && maxScore > 0) {
          currentStreaks[p.id]++;
        } else {
          currentStreaks[p.id] = 0;
        }
      });
    });

    return currentStreaks;
  }, [rounds, players]);

  const openSettings = () => {
    const names: Record<string, string> = {};
    players.forEach((p) => { names[p.id] = p.name; });
    setEditNames(names);
    setSettingsError("");
    setShowSettings(true);
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsError("");

    const changes = players.filter((p) => editNames[p.id]?.trim() && editNames[p.id].trim() !== p.name);
    
    if (changes.length === 0) {
      setShowSettings(false);
      return;
    }

    for (const p of changes) {
      if (!editNames[p.id]?.trim()) {
        setSettingsError("Tên không được để trống");
        return;
      }
    }

    setIsSaving(true);
    try {
      for (const p of changes) {
        await updatePlayerName(gameId, p.id, editNames[p.id].trim());
      }
      setShowSettings(false);
    } catch (err: any) {
      setSettingsError(err.message || "Lỗi cập nhật tên");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <GameAuthGate gameId={gameId} hasPassword={hasPassword}>
      {(isHost) => (
        <div className="flex flex-col h-dvh bg-slate-50">
          {/* Header cố định */}
          <header className="px-4 py-4 bg-white border-b border-slate-200 flex items-center justify-between shadow-sm shrink-0 z-20">
            <div className="flex items-center">
              <Link href={isFinished ? `/game/${gameId}/result` : "/"} className="p-2 -ml-2 text-slate-500 hover:text-slate-900">
                <ChevronLeft className="w-6 h-6" />
              </Link>
              <h1 className="text-lg font-bold text-slate-900 ml-1">Bảng Điểm</h1>
              {!isHost && (
                <span className="ml-2 text-[10px] font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded-full">
                  Khách
                </span>
              )}
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowChart(!showChart)}
                className={`p-2 rounded-full transition-colors ${showChart ? "bg-sky-50 text-sky-600" : "text-slate-400 hover:text-slate-700 hover:bg-slate-100"}`}
              >
                <TrendingUp className="w-5 h-5" />
              </button>
              {isHost && !isFinished && (
                <button
                  onClick={openSettings}
                  className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
                >
                  <Settings className="w-5 h-5" />
                </button>
              )}
              {isFinished ? (
                <Link href={`/game/${gameId}/result`} className="text-xs font-bold text-sky-600 bg-sky-50 px-3 py-1.5 rounded-full hover:bg-sky-100 transition-colors">
                  Xem kết quả
                </Link>
              ) : (
                isHost && <EndGameButton gameId={gameId} />
              )}
            </div>
          </header>

          {/* Table Header ghim */}
          <div className="bg-white border-b border-slate-200 shadow-sm z-10 shrink-0">
            {/* Biểu đồ Live (nếu bật) */}
            {showChart && rounds.length > 0 && (
              <div className="p-4 border-b border-slate-100 animate-in slide-in-from-top duration-300">
                <div className="flex items-center gap-2 mb-2">
                  <BarChart3 className="w-4 h-4 text-sky-500" />
                  <span className="text-xs font-bold text-slate-700">Đồ thị diễn biến</span>
                </div>
                <GameProgressionChart players={players} rounds={rounds} />
              </div>
            )}

            <div className="grid grid-cols-5 py-3">
              <div className="text-center font-semibold text-[10px] text-slate-500 uppercase col-span-1 border-r border-slate-200 flex flex-col items-center justify-center">
                Ván
              </div>
              {players.map((p, i) => (
                <div key={p.id} className="text-center px-1 border-r border-slate-50 last:border-0">
                  <div className="flex flex-col items-center">
                    <div className="relative">
                      <span className="text-base mb-0.5">{AVATARS[i % AVATARS.length]}</span>
                      {streaks[p.id] >= 2 && (
                        <span className="absolute -top-1 -right-2 text-[10px] animate-bounce">
                          🔥<span className="font-bold text-orange-600">{streaks[p.id]}</span>
                        </span>
                      )}
                    </div>
                    <span className="font-bold text-[11px] text-slate-800 line-clamp-1 w-full">
                      {p.name}
                    </span>
                    <div className={`text-[10px] font-extrabold mt-0.5 ${totalScores[p.id] > 0 ? "text-emerald-600" : totalScores[p.id] < 0 ? "text-red-600" : "text-slate-400"}`}>
                      {totalScores[p.id] > 0 ? "+" : ""}{totalScores[p.id]}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Scrollable content area */}
          <main className="flex-1 overflow-y-auto min-h-0" style={{ paddingBottom: !isFinished && isHost ? '120px' : '24px' }}>
            <RoundList 
              gameId={gameId} 
              rounds={rounds} 
              players={players} 
              isFinished={isFinished || !isHost} 
            />
          </main>

          {/* Fixed Bottom Form (chỉ hiện khi game chưa kết thúc VÀ là nhà cái) */}
          {!isFinished && isHost && (
            <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 pb-[calc(max(1.5rem,env(safe-area-inset-bottom)))] shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.1)] z-20 w-full max-w-md mx-auto">
              <ScoreForm
                gameId={gameId}
                players={players}
                nextRoundNumber={nextRoundNumber}
              />
            </div>
          )}

          {/* Settings Modal */}
          {showSettings && (
            <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-sm sm:p-4">
              <div className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl animate-in slide-in-from-bottom-full sm:zoom-in-95 duration-200">
                <div className="flex justify-between items-center mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-100 text-slate-600 rounded-xl flex items-center justify-center">
                      <Settings className="w-5 h-5" />
                    </div>
                    <h2 className="text-lg font-bold text-slate-800">Cài đặt</h2>
                  </div>
                  <button 
                    onClick={() => setShowSettings(false)}
                    className="text-slate-400 hover:text-slate-600 bg-slate-100 rounded-full p-1"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSaveSettings}>
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Tên người chơi</p>
                  <div className="space-y-3 mb-6">
                    {players.map((p, i) => (
                      <div key={p.id} className="flex items-center gap-3">
                        <span className="text-xs font-bold text-slate-400 w-5 shrink-0 text-center">{i + 1}</span>
                        <input
                          type="text"
                          value={editNames[p.id] || ""}
                          onChange={(e) => setEditNames((prev) => ({ ...prev, [p.id]: e.target.value }))}
                          className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 transition-all"
                          placeholder={`Người chơi ${i + 1}`}
                        />
                      </div>
                    ))}
                  </div>

                  {settingsError && <p className="text-red-500 text-sm mb-4 font-medium px-1">{settingsError}</p>}

                  <button
                    type="submit"
                    disabled={isSaving}
                    className="w-full bg-slate-900 hover:bg-slate-800 active:bg-slate-950 disabled:bg-slate-300 text-white font-bold py-4 px-6 rounded-xl shadow-md flex items-center justify-center gap-2 transition-all"
                  >
                    {isSaving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
                    <span>Lưu thay đổi</span>
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </GameAuthGate>
  );
}

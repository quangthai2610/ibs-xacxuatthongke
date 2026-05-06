"use client";

import { useState } from "react";
import { Info, Trash2, Edit2, Loader2, X, Check } from "lucide-react";
import { deleteRound, updateRound } from "@/app/actions/game";

interface Player {
  id: string;
  name: string;
}

interface Round {
  id: string;
  round_number: number;
  scores: Record<string, number>;
}

export default function RoundList({
  gameId,
  rounds,
  players,
  isFinished,
}: {
  gameId: string;
  rounds: Round[];
  players: Player[];
  isFinished: boolean;
}) {
  const [editingRound, setEditingRound] = useState<Round | null>(null);
  const [editScores, setEditScores] = useState<Record<string, string>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (roundId: string) => {
    if (isFinished) return;
    if (confirm("Bạn có chắc chắn muốn xóa ván này không?")) {
      setDeletingId(roundId);
      try {
        await deleteRound(gameId, roundId);
      } catch (err: any) {
        alert(err.message || "Lỗi xóa ván");
      } finally {
        setDeletingId(null);
      }
    }
  };

  const openEditModal = (round: Round) => {
    if (isFinished) return;
    setEditingRound(round);
    const initialScores: Record<string, string> = {};
    players.forEach((p) => {
      initialScores[p.id] = (round.scores[p.id] || 0).toString();
    });
    setEditScores(initialScores);
    setError("");
  };

  const handleEditChange = (pid: string, val: string) => {
    setEditScores((prev) => ({ ...prev, [pid]: val }));
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRound) return;
    setError("");

    const parsedScores: Record<string, number> = {};
    for (const p of players) {
      if (editScores[p.id] === undefined || editScores[p.id] === "") {
        setError("Vui lòng nhập điểm cho tất cả người chơi (mặc định là 0)");
        return;
      }
      const val = parseInt(editScores[p.id], 10);
      if (isNaN(val)) {
        setError("Điểm phải là số");
        return;
      }
      parsedScores[p.id] = val;
    }

    setIsSaving(true);
    try {
      await updateRound(gameId, editingRound.id, parsedScores);
      setEditingRound(null);
    } catch (err: any) {
      setError(err.message || "Lỗi lưu điểm");
    } finally {
      setIsSaving(false);
    }
  };

  if (rounds.length === 0) {
    return (
      <div className="py-12 flex flex-col items-center justify-center text-slate-400">
        <Info className="w-8 h-8 mb-2 opacity-50" />
        <p className="text-sm">Chưa có ván nào được ghi</p>
      </div>
    );
  }

  return (
    <>
      <div className="divide-y divide-slate-100 bg-white">
        {rounds.map((round) => (
          <div key={round.id} className="relative overflow-hidden group">
            {/* Vùng Swipe to Delete (chỉ bật khi chưa kết thúc) */}
            <div className={`flex w-full overflow-x-auto snap-x snap-mandatory hide-scrollbar ${isFinished ? '' : 'touch-pan-x'}`}>
              
              {/* Nội dung chính của Round (Vuốt sang trái để lộ nút xoá) */}
              <div 
                className="w-full shrink-0 snap-center grid grid-cols-5 py-3 items-center hover:bg-slate-50 transition-colors cursor-pointer"
                onClick={() => openEditModal(round)}
              >
                <div className="text-center font-medium text-xs text-slate-500 col-span-1 border-r border-slate-100 flex items-center justify-center">
                  <span className="mr-1">{round.round_number}</span>
                  {!isFinished && <Edit2 className="w-3 h-3 opacity-30" />}
                </div>
                {players.map((p) => {
                  const score = round.scores[p.id] || 0;
                  return (
                    <div
                      key={p.id}
                      className={`text-center font-semibold text-sm ${
                        score > 0 ? "text-emerald-600" : score < 0 ? "text-red-600" : "text-slate-400"
                      }`}
                    >
                      {score > 0 ? `+${score}` : score}
                    </div>
                  );
                })}
              </div>

              {/* Nút Xóa hiện ra khi vuốt sang trái */}
              {!isFinished && (
                <div 
                  className="w-20 shrink-0 snap-center bg-red-500 text-white flex items-center justify-center cursor-pointer active:bg-red-600"
                  onClick={() => handleDelete(round.id)}
                >
                  {deletingId === round.id ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Trash2 className="w-5 h-5" />
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Popup Edit Round */}
      {editingRound && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-900/60 backdrop-blur-sm sm:p-4">
          <div className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl animate-in slide-in-from-bottom-full sm:zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold text-slate-800">
                Sửa điểm ván {editingRound.round_number}
              </h2>
              <button 
                onClick={() => setEditingRound(null)}
                className="text-slate-400 hover:text-slate-600 bg-slate-100 rounded-full p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit}>
              <div className="grid grid-cols-2 gap-4 mb-6">
                {players.map((p) => (
                  <div key={p.id} className="flex flex-col bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <label className="text-xs font-bold text-slate-600 truncate mb-2">
                      {p.name}
                    </label>
                    <input
                      type="number"
                      inputMode="numeric"
                      enterKeyHint="done"
                      value={editScores[p.id] || ""}
                      onChange={(e) => handleEditChange(p.id, e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleSaveEdit(e as any);
                        }
                      }}
                      className="w-full text-center bg-white border border-slate-200 rounded-lg py-2.5 text-lg font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/50 transition-all shadow-sm"
                      placeholder="0"
                    />
                  </div>
                ))}
              </div>

              {error && <p className="text-red-500 text-sm mb-4 font-medium px-1">{error}</p>}

              <button
                type="submit"
                disabled={isSaving}
                className="w-full bg-emerald-500 hover:bg-emerald-600 active:bg-emerald-700 disabled:bg-slate-300 text-white font-bold py-4 px-6 rounded-xl shadow-md flex items-center justify-center gap-2 transition-all"
              >
                {isSaving ? <Loader2 className="w-6 h-6 animate-spin" /> : <Check className="w-6 h-6" />}
                <span>Cập nhật</span>
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

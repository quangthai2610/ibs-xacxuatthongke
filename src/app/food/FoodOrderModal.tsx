"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import { X, Loader2, Utensils } from "lucide-react";

interface FoodOrderModalProps {
  onClose: () => void;
  onSubmit: (userName: string, foodName: string) => Promise<void>;
  players: string[];
  initialUserName?: string;
  initialFoodName?: string;
  isEditing?: boolean;
}

export default function FoodOrderModal({
  onClose,
  onSubmit,
  players,
  initialUserName = "",
  initialFoodName = "",
  isEditing = false,
}: FoodOrderModalProps) {
  const [userName, setUserName] = useState(initialUserName);
  const [foodName, setFoodName] = useState(initialFoodName);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!userName.trim() || !foodName.trim()) {
      setError("Vui lòng nhập đầy đủ Tên và Món ăn.");
      return;
    }

    try {
      setLoading(true);
      await onSubmit(userName, foodName);
      onClose();
    } catch (err: any) {
      setError(err.message || "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  // Only render on client side to avoid hydration mismatch with createPortal
  if (typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="bg-gradient-to-r from-sky-500 to-indigo-600 p-5 text-white flex justify-between items-start">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Utensils className="w-6 h-6" /> {isEditing ? "Sửa Order" : "Order Cơm"}
            </h2>
            <p className="text-sky-100 text-sm mt-1">
              {isEditing ? "Cập nhật lại món ăn của bạn" : "Nhập tên bạn và món ăn hôm nay"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 -mr-2 -mt-2 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm border border-red-100">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">
              Tên người order
            </label>
            <input
              type="text"
              list="player-names"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Chọn hoặc nhập tên mới..."
              className="w-full text-slate-900 border-2 border-slate-200 rounded-xl px-4 py-3 bg-slate-50 focus:bg-white focus:border-sky-500 focus:outline-none transition-colors"
              required
            />
            <datalist id="player-names">
              {players.map((p) => (
                <option key={p} value={p} />
              ))}
            </datalist>
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-1">
              Món ăn
            </label>
            <input
              type="text"
              value={foodName}
              onChange={(e) => setFoodName(e.target.value)}
              placeholder="Ví dụ: Cơm gà xối mỡ..."
              className="w-full text-slate-900 border-2 border-slate-200 rounded-xl px-4 py-3 bg-slate-50 focus:bg-white focus:border-sky-500 focus:outline-none transition-colors"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-sky-500 hover:bg-sky-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors mt-2 active:scale-[0.98] disabled:opacity-50"
          >
            {loading && <Loader2 className="w-5 h-5 animate-spin" />}
            {isEditing ? "Cập nhật" : "Xác nhận Order"}
          </button>
        </form>
      </div>
    </div>,
    document.body
  );
}

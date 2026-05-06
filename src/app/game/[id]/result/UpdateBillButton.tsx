"use client";

import { useState } from "react";
import { updateBill } from "@/app/actions/game";
import { Receipt, X, Check, Loader2 } from "lucide-react";

export default function UpdateBillButton({ gameId }: { gameId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [billAmount, setBillAmount] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleUpdateBill = async () => {
    setError("");
    const amount = parseInt(billAmount.replace(/[^0-9]/g, ""), 10);
    if (isNaN(amount) || amount <= 0) {
      setError("Vui lòng nhập số tiền hợp lệ");
      return;
    }

    setIsLoading(true);
    try {
      await updateBill(gameId, amount);
      setIsOpen(false);
      setBillAmount("");
    } catch (err: any) {
      setError(err.message || "Lỗi khi cập nhật bill");
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (val: string) => {
    const numericVal = val.replace(/[^0-9]/g, "");
    if (!numericVal) return "";
    return parseInt(numericVal, 10).toLocaleString("vi-VN");
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="w-full bg-amber-50 hover:bg-amber-100 active:bg-amber-200 text-amber-700 font-bold py-4 px-6 rounded-xl border border-amber-200 flex items-center justify-center gap-2 transition-all"
      >
        <Receipt className="w-5 h-5" />
        <span>Bổ sung hóa đơn</span>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <h2 className="text-xl font-bold text-slate-800 mb-2">Bổ sung hóa đơn</h2>
            <p className="text-sm text-slate-500 mb-6">
              Nhập tổng số tiền hóa đơn. Hạng 3 và hạng 4 sẽ chia đôi thanh toán.
            </p>

            <div className="mb-6">
              <label className="block text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wider">
                Tổng tiền hóa đơn (VNĐ)
              </label>
              <div className="relative">
                <input
                  type="text"
                  inputMode="numeric"
                  value={formatCurrency(billAmount)}
                  onChange={(e) => setBillAmount(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleUpdateBill();
                  }}
                  placeholder="Ví dụ: 100,000"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-lg font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500"
                  autoFocus
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">
                  đ
                </span>
              </div>
              {error && <p className="text-red-500 text-xs mt-2 font-medium">{error}</p>}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => { setIsOpen(false); setError(""); setBillAmount(""); }}
                className="flex-1 py-3 px-4 rounded-xl font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center justify-center gap-2"
              >
                <X className="w-5 h-5" />
                <span>Hủy</span>
              </button>
              <button
                onClick={handleUpdateBill}
                disabled={isLoading}
                className="flex-1 py-3 px-4 rounded-xl font-semibold text-white bg-amber-500 hover:bg-amber-600 disabled:bg-slate-300 transition-colors flex items-center justify-center gap-2 shadow-md shadow-amber-500/20"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
                <span>Xác nhận</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

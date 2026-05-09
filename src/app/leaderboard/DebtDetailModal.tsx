"use client";

import { useState, useEffect, useCallback } from "react";
import { X, Pencil, Trash2, Check, Loader2 } from "lucide-react";
import { getIOUsBetween, updateIOU, deleteIOU, type IOURecord } from "@/app/actions/iou";

interface DebtDetailModalProps {
  debtorName: string;
  creditorName: string;
  onClose: () => void;
  onUpdated: () => void;
}

export default function DebtDetailModal({ debtorName, creditorName, onClose, onUpdated }: DebtDetailModalProps) {
  const [records, setRecords] = useState<IOURecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editAmount, setEditAmount] = useState("");
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const fetchRecords = useCallback(async () => {
    setLoading(true);
    const data = await getIOUsBetween(debtorName, creditorName);
    setRecords(data);
    setLoading(false);
  }, [debtorName, creditorName]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  const formatCurrency = (val: string) => {
    const numericVal = val.replace(/[^0-9]/g, "");
    if (!numericVal) return "";
    return parseInt(numericVal, 10).toLocaleString("vi-VN");
  };

  const handleStartEdit = (record: IOURecord) => {
    setEditingId(record.id);
    setEditAmount(record.amount.toString());
    setConfirmDeleteId(null);
  };

  const handleSaveEdit = async (id: string) => {
    const amount = parseInt(editAmount.replace(/[^0-9]/g, ""), 10);
    if (isNaN(amount) || amount <= 0) return;

    setActionLoading(id);
    try {
      await updateIOU(id, amount);
      setEditingId(null);
      await fetchRecords();
      onUpdated();
    } catch (err) {
      console.error("Lỗi sửa nợ:", err);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id: string) => {
    setActionLoading(id);
    try {
      await deleteIOU(id);
      await fetchRecords();
      onUpdated();
      // Đóng modal nếu hết record
      if (records.length <= 1) {
        onClose();
      }
    } catch (err) {
      console.error("Lỗi xoá nợ:", err);
    } finally {
      setActionLoading(null);
      setConfirmDeleteId(null);
    }
  };

  const totalAmount = records.reduce((sum, r) => sum + r.amount, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm sm:p-4">
      <div className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-3xl shadow-2xl animate-in slide-in-from-bottom-full sm:zoom-in-95 duration-200 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 shrink-0">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-lg font-bold text-slate-800">Chi tiết nợ</h2>
              <p className="text-sm text-slate-500 mt-1">
                <span className="font-semibold text-red-500">{debtorName}</span>
                {" "}nợ{" "}
                <span className="font-semibold text-emerald-600">{creditorName}</span>
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 -mr-2 -mt-1 text-slate-400 hover:text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="mt-3 bg-red-50 rounded-xl px-4 py-2.5 flex justify-between items-center">
            <span className="text-sm font-medium text-red-600">Tổng nợ</span>
            <span className="text-xl font-black text-red-600">
              {totalAmount.toLocaleString("vi-VN")} đ
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
            </div>
          ) : records.length === 0 ? (
            <p className="text-center text-slate-400 py-8">Không có khoản nợ nào</p>
          ) : (
            <div className="space-y-3">
              {records.map((record) => (
                <div
                  key={record.id}
                  className="bg-slate-50 rounded-xl p-4 border border-slate-100"
                >
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs text-slate-400">
                      {new Date(record.created_at).toLocaleDateString("vi-VN", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                    {record.note && (
                      <span className="text-xs text-slate-500 bg-slate-200 px-2 py-0.5 rounded-full">
                        {record.note}
                      </span>
                    )}
                  </div>

                  {editingId === record.id ? (
                    /* Chế độ chỉnh sửa */
                    <div className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <input
                          type="text"
                          inputMode="numeric"
                          value={formatCurrency(editAmount)}
                          onChange={(e) => setEditAmount(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handleSaveEdit(record.id);
                            if (e.key === "Escape") setEditingId(null);
                          }}
                          className="w-full bg-white border border-sky-300 rounded-lg px-3 py-2 text-lg font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/50"
                          autoFocus
                        />
                        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">đ</span>
                      </div>
                      <button
                        onClick={() => handleSaveEdit(record.id)}
                        disabled={actionLoading === record.id}
                        className="p-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-colors"
                      >
                        {actionLoading === record.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Check className="w-4 h-4" />
                        )}
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="p-2 bg-slate-200 hover:bg-slate-300 text-slate-600 rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : confirmDeleteId === record.id ? (
                    /* Xác nhận xoá */
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-red-600">Xoá khoản nợ này?</span>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleDelete(record.id)}
                          disabled={actionLoading === record.id}
                          className="px-3 py-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-1"
                        >
                          {actionLoading === record.id ? (
                            <Loader2 className="w-3 h-3 animate-spin" />
                          ) : (
                            "Xoá"
                          )}
                        </button>
                        <button
                          onClick={() => setConfirmDeleteId(null)}
                          className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-600 text-xs font-bold rounded-lg transition-colors"
                        >
                          Huỷ
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Hiển thị bình thường */
                    <div className="flex items-center justify-between">
                      <span className="text-xl font-black text-slate-800">
                        {record.amount.toLocaleString("vi-VN")} <span className="text-sm text-slate-400">đ</span>
                      </span>
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleStartEdit(record)}
                          className="p-2 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
                          title="Sửa"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => { setConfirmDeleteId(record.id); setEditingId(null); }}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Xoá"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

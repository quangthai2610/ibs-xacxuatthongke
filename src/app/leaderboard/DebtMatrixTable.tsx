"use client";

import { useState, useEffect, useCallback } from "react";
import { Loader2, HandCoins } from "lucide-react";
import { getIOUMatrix } from "@/app/actions/iou";
import DebtDetailModal from "./DebtDetailModal";

interface MatrixData {
  names: string[];
  matrix: Record<string, Record<string, number>>;
}

export default function DebtMatrixTable() {
  const [data, setData] = useState<MatrixData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedCell, setSelectedCell] = useState<{ debtor: string; creditor: string } | null>(null);

  const fetchMatrix = useCallback(async () => {
    setLoading(true);
    const result = await getIOUMatrix();
    setData(result);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchMatrix();
  }, [fetchMatrix]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
      </div>
    );
  }

  if (!data || data.names.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-40 text-slate-400">
        <HandCoins className="w-10 h-10 mb-2 opacity-30" />
        <p>Chưa có khoản nợ nào</p>
      </div>
    );
  }

  const { names, matrix } = data;

  // Tính tổng nợ phải trả cho mỗi con nợ (theo hàng)
  const debtorTotals: Record<string, number> = {};
  names.forEach((debtor) => {
    debtorTotals[debtor] = names.reduce((sum, creditor) => {
      return sum + (matrix[debtor]?.[creditor] || 0);
    }, 0);
  });

  // Tính tổng nợ được nợ cho mỗi chủ nợ (theo cột)
  const creditorTotals: Record<string, number> = {};
  names.forEach((creditor) => {
    creditorTotals[creditor] = names.reduce((sum, debtor) => {
      return sum + (matrix[debtor]?.[creditor] || 0);
    }, 0);
  });

  // Chỉ hiện những người có liên quan (có nợ hoặc được nợ)
  const activeDebtors = names.filter((n) => debtorTotals[n] > 0);
  const activeCreditors = names.filter((n) => creditorTotals[n] > 0);

  if (activeDebtors.length === 0 || activeCreditors.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-40 text-slate-400">
        <HandCoins className="w-10 h-10 mb-2 opacity-30" />
        <p>Chưa có khoản nợ nào</p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-bottom-2">
        {/* Legend */}
        <div className="px-4 py-3 bg-slate-50 border-b border-slate-100 flex items-center gap-4 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
          <div className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 rounded-sm bg-red-400" />
            <span>Con nợ (hàng)</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2.5 h-2.5 rounded-sm bg-emerald-400" />
            <span>Chủ nợ (cột)</span>
          </div>
        </div>

        {/* Scrollable table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-max">
            <thead>
              <tr className="bg-slate-50">
                {/* Ô góc */}
                <th className="sticky left-0 z-10 bg-slate-100 px-3 py-2.5 text-[9px] font-bold text-slate-400 uppercase tracking-wider text-left border-r border-b border-slate-200 min-w-[80px]">
                  <span className="text-red-400">Con nợ</span> ↓
                  <br />
                  <span className="text-emerald-500">Chủ nợ</span> →
                </th>
                {activeCreditors.map((creditor) => (
                  <th
                    key={creditor}
                    className="px-2 py-2.5 text-center border-b border-slate-200 min-w-[70px]"
                  >
                    <span className="text-[11px] font-bold text-emerald-600 truncate block max-w-[60px]">
                      {creditor}
                    </span>
                  </th>
                ))}
                {/* Cột tổng */}
                <th className="px-2 py-2.5 text-center border-b border-l border-slate-200 bg-red-50 min-w-[70px]">
                  <span className="text-[9px] font-bold text-red-500 uppercase tracking-wider">Tổng nợ</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {activeDebtors.map((debtor, rowIdx) => (
                <tr
                  key={debtor}
                  className={rowIdx % 2 === 0 ? "bg-white" : "bg-slate-50/50"}
                >
                  {/* Tên con nợ */}
                  <td className="sticky left-0 z-10 px-3 py-2.5 border-r border-slate-200 bg-inherit">
                    <span className="text-[11px] font-bold text-red-500 truncate block max-w-[70px]">
                      {debtor}
                    </span>
                  </td>
                  {/* Các ô ma trận */}
                  {activeCreditors.map((creditor) => {
                    const amount = matrix[debtor]?.[creditor] || 0;
                    const isSelf = debtor === creditor;

                    return (
                      <td
                        key={creditor}
                        onClick={() => {
                          if (amount > 0 && !isSelf) {
                            setSelectedCell({ debtor, creditor });
                          }
                        }}
                        className={`px-2 py-2.5 text-center text-[11px] font-bold transition-colors ${
                          isSelf
                            ? "bg-slate-100 text-slate-300"
                            : amount > 0
                            ? "text-red-600 cursor-pointer hover:bg-red-50 active:bg-red-100"
                            : "text-slate-300"
                        }`}
                      >
                        {isSelf ? "—" : amount > 0 ? `${(amount / 1000).toFixed(0)}k` : "-"}
                      </td>
                    );
                  })}
                  {/* Tổng nợ hàng */}
                  <td className="px-2 py-2.5 text-center border-l border-slate-200 bg-red-50/50">
                    <span className="text-[11px] font-black text-red-600">
                      {debtorTotals[debtor] > 0
                        ? `${(debtorTotals[debtor] / 1000).toFixed(0)}k`
                        : "-"}
                    </span>
                  </td>
                </tr>
              ))}
              {/* Hàng tổng */}
              <tr className="bg-emerald-50/50 border-t border-slate-200">
                <td className="sticky left-0 z-10 px-3 py-2.5 border-r border-slate-200 bg-emerald-50">
                  <span className="text-[9px] font-bold text-emerald-600 uppercase tracking-wider">Tổng cho vay</span>
                </td>
                {activeCreditors.map((creditor) => (
                  <td key={creditor} className="px-2 py-2.5 text-center">
                    <span className="text-[11px] font-black text-emerald-600">
                      {creditorTotals[creditor] > 0
                        ? `${(creditorTotals[creditor] / 1000).toFixed(0)}k`
                        : "-"}
                    </span>
                  </td>
                ))}
                <td className="px-2 py-2.5 text-center border-l border-slate-200" />
              </tr>
            </tbody>
          </table>
        </div>

        {/* Hint */}
        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 text-center">
          <p className="text-[10px] text-slate-400">Nhấn vào số tiền để xem chi tiết & chỉnh sửa</p>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedCell && (
        <DebtDetailModal
          debtorName={selectedCell.debtor}
          creditorName={selectedCell.creditor}
          onClose={() => setSelectedCell(null)}
          onUpdated={fetchMatrix}
        />
      )}
    </>
  );
}

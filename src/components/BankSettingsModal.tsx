"use client";

import { useState } from "react";
import { X, Plus, Trash2, Edit2, Check, Landmark } from "lucide-react";
import { useBankAccounts, type SavedBankAccount } from "@/hooks/useBankAccounts";
import { POPULAR_BANKS } from "@/lib/vietqr";

export default function BankSettingsModal({ onClose }: { onClose?: () => void }) {
  const { accounts, addAccount, updateAccount, deleteAccount } = useBankAccounts();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Form state
  const [bin, setBin] = useState(POPULAR_BANKS[0].bin);
  const [accountNo, setAccountNo] = useState("");
  const [accountName, setAccountName] = useState("");
  const [label, setLabel] = useState("");

  const resetForm = () => {
    setBin(POPULAR_BANKS[0].bin);
    setAccountNo("");
    setAccountName("");
    setLabel("");
    setIsAdding(false);
    setEditingId(null);
  };

  const startEdit = (acc: SavedBankAccount) => {
    setEditingId(acc.id);
    setBin(acc.bin);
    setAccountNo(acc.accountNo);
    setAccountName(acc.accountName);
    setLabel(acc.label || "");
    setIsAdding(false);
  };

  const handleSave = async () => {
    if (!accountNo.trim() || !accountName.trim() || isSaving) return;
    const selectedBank = POPULAR_BANKS.find(b => b.bin === bin);
    if (!selectedBank) return;

    setIsSaving(true);
    try {
      const data = {
        bin,
        shortName: selectedBank.shortName,
        accountNo: accountNo.trim(),
        accountName: accountName.trim().toUpperCase(),
        label: label.trim() || accountName.trim().toUpperCase()
      };

      if (editingId) {
        await updateAccount(editingId, data);
      } else {
        await addAccount(data);
      }
      resetForm();
    } catch (err) {
      console.error("Lỗi khi lưu tài khoản:", err);
      alert("Đã xảy ra lỗi khi lưu. Vui lòng thử lại!");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-5 border-b border-slate-100 shrink-0">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Landmark className="w-6 h-6 text-sky-500" /> Cài đặt Nhận tiền
          </h2>
          {onClose && (
            <button onClick={onClose} className="p-2 -mr-2 text-slate-400 hover:text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-full transition-colors">
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {(!isAdding && !editingId) ? (
            <div className="space-y-4">
              {accounts.length === 0 ? (
                <div className="text-center py-8 text-slate-500">
                  Chưa có tài khoản nào được lưu.
                </div>
              ) : (
                <div className="space-y-3">
                  {accounts.map(acc => {
                    const bank = POPULAR_BANKS.find(b => b.bin === acc.bin);
                    return (
                      <div key={acc.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex items-center gap-3">
                        {bank && <img src={bank.logo} alt={bank.shortName} className="w-10 h-10 object-contain bg-white rounded-lg p-1 border border-slate-100" />}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-slate-800 truncate">{acc.label}</h4>
                          <p className="text-sm text-slate-500 truncate">{acc.accountNo} - {bank?.shortName}</p>
                        </div>
                        <div className="flex gap-1 shrink-0">
                          <button onClick={() => startEdit(acc)} disabled={isSaving} className="p-2 text-sky-600 hover:bg-sky-100 rounded-xl transition-colors disabled:opacity-50">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => deleteAccount(acc.id)} disabled={isSaving} className="p-2 text-red-600 hover:bg-red-100 rounded-xl transition-colors disabled:opacity-50">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              
              <button 
                onClick={() => setIsAdding(true)}
                className="w-full py-4 rounded-2xl border-2 border-dashed border-sky-200 text-sky-600 font-bold flex items-center justify-center gap-2 hover:bg-sky-50 transition-colors"
              >
                <Plus className="w-5 h-5" /> Thêm tài khoản mới
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Ngân hàng</label>
                <select 
                  value={bin} 
                  onChange={(e) => setBin(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 font-medium focus:ring-2 focus:ring-sky-500 focus:outline-none"
                >
                  {POPULAR_BANKS.map(b => (
                    <option key={b.bin} value={b.bin}>{b.shortName} ({b.name})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Số tài khoản</label>
                <input 
                  type="text" 
                  inputMode="numeric"
                  value={accountNo}
                  onChange={(e) => setAccountNo(e.target.value.replace(/\D/g, ''))}
                  placeholder="Ví dụ: 1903..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 font-bold focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Tên chủ tài khoản (Viết hoa không dấu)</label>
                <input 
                  type="text" 
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value.toUpperCase())}
                  placeholder="NGUYEN VAN A"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 font-bold focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1">Tên gợi nhớ (Không bắt buộc)</label>
                <input 
                  type="text" 
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                  placeholder="Ví dụ: Quỹ ăn chơi"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 font-medium focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer for Form */}
        {(isAdding || editingId) && (
          <div className="p-5 border-t border-slate-100 flex gap-3 shrink-0">
            <button 
              onClick={resetForm}
              className="flex-1 py-3 rounded-xl font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 transition-colors"
            >
              Hủy
            </button>
            <button 
              onClick={handleSave}
              disabled={!accountNo.trim() || !accountName.trim() || isSaving}
              className="flex-1 py-3 rounded-xl font-bold text-white bg-sky-500 hover:bg-sky-600 disabled:bg-sky-300 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
            >
              {isSaving ? <span className="animate-spin border-2 border-white/30 border-t-white rounded-full w-5 h-5" /> : <Check className="w-5 h-5" />} 
              {isSaving ? 'Đang lưu...' : 'Lưu'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

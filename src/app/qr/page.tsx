"use client";

import { useState, useMemo } from "react";
import {
  QrCode,
  Wallet,
  PlusCircle,
  ChevronDown,
  ZoomIn,
  X,
  Copy,
  Check,
  Download,
  Save,
  Sparkles,
} from "lucide-react";
import { useBankAccounts, type SavedBankAccount } from "@/hooks/useBankAccounts";
import { POPULAR_BANKS } from "@/lib/vietqr";

type AccountMode = "existing" | "new";

export default function QRPage() {
  const { accounts, isLoaded, addAccount } = useBankAccounts();

  // Mode selection
  const [mode, setMode] = useState<AccountMode | null>(null);

  // Existing account state
  const [selectedAccountId, setSelectedAccountId] = useState<string>("");
  const [amount, setAmount] = useState<string>("");

  // New account state
  const [newBin, setNewBin] = useState(POPULAR_BANKS[0].bin);
  const [newAccountNo, setNewAccountNo] = useState("");
  const [newAccountName, setNewAccountName] = useState("");
  const [newLabel, setNewLabel] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // QR state
  const [showQR, setShowQR] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [copied, setCopied] = useState(false);

  // Auto-select first account
  const selectedAccount = useMemo(() => {
    if (mode === "existing") {
      return accounts.find((a) => a.id === selectedAccountId) || null;
    }
    if (mode === "new" && newAccountNo && newAccountName && newBin) {
      const bank = POPULAR_BANKS.find((b) => b.bin === newBin);
      return {
        id: "temp",
        bin: newBin,
        shortName: bank?.shortName || "",
        accountNo: newAccountNo,
        accountName: newAccountName.toUpperCase(),
        label: newLabel || newAccountName.toUpperCase(),
      } as SavedBankAccount;
    }
    return null;
  }, [mode, selectedAccountId, accounts, newBin, newAccountNo, newAccountName, newLabel]);

  const parsedAmount = parseInt(amount.replace(/\D/g, ""), 10) || 0;

  const qrUrl = useMemo(() => {
    if (!selectedAccount || parsedAmount <= 0) return "";
    return `https://img.vietqr.io/image/${selectedAccount.bin}-${selectedAccount.accountNo}-compact2.png?amount=${parsedAmount}&accountName=${encodeURIComponent(selectedAccount.accountName)}`;
  }, [selectedAccount, parsedAmount]);

  const canGenerate =
    selectedAccount && parsedAmount > 0 && selectedAccount.accountNo.trim().length > 0;

  const handleGenerate = () => {
    if (!canGenerate) return;
    setShowQR(true);
  };

  const handleCopy = () => {
    if (selectedAccount) {
      navigator.clipboard.writeText(selectedAccount.accountNo);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSaveImage = async () => {
    if (!qrUrl) return;
    try {
      const response = await fetch(qrUrl);
      const blob = await response.blob();
      const file = new File([blob], `QR_${parsedAmount}.png`, { type: "image/png" });

      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: `QR thanh toán`,
          text: `Chuyển khoản ${parsedAmount.toLocaleString("vi-VN")}đ`,
          files: [file],
        });
      } else {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `QR_${parsedAmount}.png`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (err) {
      if ((err as Error)?.name !== "AbortError") {
        console.error("Error saving QR", err);
      }
    }
  };

  const handleSaveAccount = async () => {
    if (!newAccountNo.trim() || !newAccountName.trim() || isSaving) return;
    const bank = POPULAR_BANKS.find((b) => b.bin === newBin);
    if (!bank) return;

    setIsSaving(true);
    try {
      await addAccount({
        bin: newBin,
        shortName: bank.shortName,
        accountNo: newAccountNo.trim(),
        accountName: newAccountName.trim().toUpperCase(),
        label: newLabel.trim() || newAccountName.trim().toUpperCase(),
      });
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error("Lỗi khi lưu tài khoản:", err);
      alert("Đã xảy ra lỗi khi lưu. Vui lòng thử lại!");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAmountChange = (val: string) => {
    const digits = val.replace(/\D/g, "");
    if (digits === "") {
      setAmount("");
      return;
    }
    const num = parseInt(digits, 10);
    setAmount(num.toLocaleString("vi-VN"));
  };

  // Reset QR when inputs change
  const resetQR = () => {
    setShowQR(false);
    setIsZoomed(false);
  };

  return (
    <div className="flex-1 flex flex-col bg-gradient-to-b from-slate-50 to-white pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-sky-500 via-indigo-500 to-purple-600 px-5 pt-12 pb-8 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        <div className="relative">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2.5 bg-white/15 backdrop-blur-sm rounded-xl">
              <QrCode className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-tight">Tạo mã QR</h1>
          </div>
          <p className="text-sky-100 text-sm font-medium ml-[52px]">
            Tạo QR thanh toán nhanh chóng
          </p>
        </div>
      </div>

      <div className="px-4 -mt-4 relative z-10 flex flex-col gap-4">
        {/* Mode Selector */}
        {mode === null && (
          <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/60 border border-slate-100 p-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <h2 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              Chọn tài khoản nhận tiền
            </h2>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => {
                  setMode("existing");
                  if (accounts.length > 0 && !selectedAccountId) {
                    setSelectedAccountId(accounts[0].id);
                  }
                  resetQR();
                }}
                disabled={!isLoaded || accounts.length === 0}
                className="flex flex-col items-center gap-3 p-5 rounded-2xl border-2 border-sky-100 bg-gradient-to-b from-sky-50 to-white hover:border-sky-300 hover:shadow-md transition-all active:scale-[0.97] disabled:opacity-40 disabled:pointer-events-none group"
              >
                <div className="p-3 bg-sky-100 rounded-xl group-hover:bg-sky-200 transition-colors">
                  <Wallet className="w-6 h-6 text-sky-600" />
                </div>
                <div className="text-center">
                  <p className="font-bold text-slate-800 text-sm">Tài khoản sẵn có</p>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {isLoaded ? `${accounts.length} tài khoản` : "Đang tải..."}
                  </p>
                </div>
              </button>

              <button
                onClick={() => {
                  setMode("new");
                  resetQR();
                }}
                className="flex flex-col items-center gap-3 p-5 rounded-2xl border-2 border-emerald-100 bg-gradient-to-b from-emerald-50 to-white hover:border-emerald-300 hover:shadow-md transition-all active:scale-[0.97] group"
              >
                <div className="p-3 bg-emerald-100 rounded-xl group-hover:bg-emerald-200 transition-colors">
                  <PlusCircle className="w-6 h-6 text-emerald-600" />
                </div>
                <div className="text-center">
                  <p className="font-bold text-slate-800 text-sm">Tài khoản mới</p>
                  <p className="text-xs text-slate-400 mt-0.5">Nhập thông tin mới</p>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Existing Account Selection */}
        {mode === "existing" && (
          <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/60 border border-slate-100 p-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <Wallet className="w-4 h-4 text-sky-500" />
                Tài khoản sẵn có
              </h2>
              <button
                onClick={() => {
                  setMode(null);
                  resetQR();
                }}
                className="text-xs font-semibold text-sky-500 hover:text-sky-700 transition-colors"
              >
                Đổi
              </button>
            </div>

            {/* Account dropdown */}
            <div className="relative mb-4">
              <select
                value={selectedAccountId}
                onChange={(e) => {
                  setSelectedAccountId(e.target.value);
                  resetQR();
                }}
                className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 pr-10 text-slate-800 font-semibold focus:ring-2 focus:ring-sky-400 focus:border-sky-400 focus:outline-none transition-all"
              >
                {accounts.map((acc) => {
                  const bank = POPULAR_BANKS.find((b) => b.bin === acc.bin);
                  return (
                    <option key={acc.id} value={acc.id}>
                      {acc.label || acc.accountName} — {bank?.shortName} ({acc.accountNo})
                    </option>
                  );
                })}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
            </div>

            {/* Selected account card */}
            {selectedAccount && (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-sky-50 border border-sky-100 mb-4">
                {(() => {
                  const bank = POPULAR_BANKS.find((b) => b.bin === selectedAccount.bin);
                  return bank ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={bank.logo}
                      alt={bank.shortName}
                      className="w-10 h-10 object-contain bg-white rounded-lg p-1 border border-slate-100 shrink-0"
                    />
                  ) : null;
                })()}
                <div className="min-w-0">
                  <p className="font-bold text-slate-800 truncate text-sm">
                    {selectedAccount.accountName}
                  </p>
                  <p className="text-xs text-slate-500 truncate">{selectedAccount.accountNo}</p>
                </div>
              </div>
            )}

            {/* Amount input */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Số tiền (VNĐ)
              </label>
              <div className="relative">
                <input
                  type="text"
                  inputMode="numeric"
                  value={amount}
                  onChange={(e) => {
                    handleAmountChange(e.target.value);
                    resetQR();
                  }}
                  placeholder="Nhập số tiền..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 pr-12 text-slate-900 text-lg font-black focus:ring-2 focus:ring-sky-400 focus:border-sky-400 focus:outline-none transition-all placeholder:text-slate-300 placeholder:font-normal placeholder:text-base"
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
                  đ
                </span>
              </div>
            </div>

            {/* Generate button */}
            <button
              onClick={handleGenerate}
              disabled={!canGenerate}
              className="w-full mt-4 py-3.5 rounded-xl font-bold text-white bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600 disabled:from-slate-300 disabled:to-slate-300 disabled:cursor-not-allowed transition-all active:scale-[0.97] flex items-center justify-center gap-2 shadow-lg shadow-sky-500/25 disabled:shadow-none"
            >
              <QrCode className="w-5 h-5" />
              Tạo mã QR
            </button>
          </div>
        )}

        {/* New Account Form */}
        {mode === "new" && (
          <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/60 border border-slate-100 p-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
                <PlusCircle className="w-4 h-4 text-emerald-500" />
                Tài khoản mới
              </h2>
              <button
                onClick={() => {
                  setMode(null);
                  resetQR();
                }}
                className="text-xs font-semibold text-sky-500 hover:text-sky-700 transition-colors"
              >
                Đổi
              </button>
            </div>

            <div className="space-y-3">
              {/* Bank select */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Ngân hàng</label>
                <div className="relative">
                  <select
                    value={newBin}
                    onChange={(e) => {
                      setNewBin(e.target.value);
                      resetQR();
                    }}
                    className="w-full appearance-none bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 pr-10 text-slate-800 font-medium focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 focus:outline-none transition-all"
                  >
                    {POPULAR_BANKS.map((b) => (
                      <option key={b.bin} value={b.bin}>
                        {b.shortName} ({b.name})
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* Account number */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Số tài khoản
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={newAccountNo}
                  onChange={(e) => {
                    setNewAccountNo(e.target.value.replace(/\D/g, ""));
                    resetQR();
                  }}
                  placeholder="Ví dụ: 1903..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 font-bold focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 focus:outline-none transition-all"
                />
              </div>

              {/* Account holder name */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Tên chủ tài khoản (Viết hoa không dấu)
                </label>
                <input
                  type="text"
                  value={newAccountName}
                  onChange={(e) => {
                    setNewAccountName(e.target.value.toUpperCase());
                    resetQR();
                  }}
                  placeholder="NGUYEN VAN A"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 font-bold focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 focus:outline-none transition-all"
                />
              </div>

              {/* Label */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Tên gợi nhớ (Không bắt buộc)
                </label>
                <input
                  type="text"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  placeholder="Ví dụ: Tài khoản cá nhân"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 font-medium focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 focus:outline-none transition-all"
                />
              </div>

              {/* Amount */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Số tiền (VNĐ)
                </label>
                <div className="relative">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={amount}
                    onChange={(e) => {
                      handleAmountChange(e.target.value);
                      resetQR();
                    }}
                    placeholder="Nhập số tiền..."
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 pr-12 text-slate-900 text-lg font-black focus:ring-2 focus:ring-emerald-400 focus:border-emerald-400 focus:outline-none transition-all placeholder:text-slate-300 placeholder:font-normal placeholder:text-base"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm">
                    đ
                  </span>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 mt-5">
              <button
                onClick={handleSaveAccount}
                disabled={!newAccountNo.trim() || !newAccountName.trim() || isSaving || savedSuccess}
                className={`flex-1 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all active:scale-[0.97] text-sm ${
                  savedSuccess
                    ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                    : "bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 disabled:opacity-40 disabled:pointer-events-none"
                }`}
              >
                {isSaving ? (
                  <span className="animate-spin border-2 border-emerald-300 border-t-emerald-600 rounded-full w-4 h-4" />
                ) : savedSuccess ? (
                  <>
                    <Check className="w-4 h-4" /> Đã lưu
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" /> Lưu tài khoản
                  </>
                )}
              </button>

              <button
                onClick={handleGenerate}
                disabled={!canGenerate}
                className="flex-1 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-600 hover:to-indigo-600 disabled:from-slate-300 disabled:to-slate-300 disabled:cursor-not-allowed transition-all active:scale-[0.97] flex items-center justify-center gap-2 shadow-lg shadow-sky-500/25 disabled:shadow-none text-sm"
              >
                <QrCode className="w-4 h-4" />
                Tạo QR
              </button>
            </div>
          </div>
        )}

        {/* QR Result */}
        {showQR && qrUrl && selectedAccount && (
          <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/60 border border-slate-100 p-5 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="flex flex-col items-center">
              {/* QR Image */}
              <button
                onClick={() => setIsZoomed(true)}
                className="bg-slate-50 p-2 rounded-2xl border border-slate-200 shadow-inner w-52 h-52 mb-4 relative flex items-center justify-center group cursor-zoom-in active:scale-95 transition-transform"
                aria-label="Phóng to mã QR"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={qrUrl} alt="VietQR" className="w-full h-full object-contain rounded-xl" />
                <div className="absolute inset-0 rounded-2xl bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <ZoomIn className="w-8 h-8 text-white drop-shadow-lg" />
                </div>
              </button>
              <p className="text-xs text-slate-400 mb-3 -mt-2">Nhấn vào QR để phóng to</p>

              {/* Amount & account info */}
              <div className="text-center mb-4">
                <div className="text-3xl font-black text-slate-900 mb-1 tracking-tight">
                  {parsedAmount.toLocaleString("vi-VN")}{" "}
                  <span className="text-xl text-slate-500">đ</span>
                </div>
                <div className="text-sm font-medium text-slate-500 uppercase tracking-wider bg-slate-100 py-1 px-3 rounded-full inline-block">
                  {selectedAccount.accountName}
                </div>
                <div className="text-xs text-slate-400 mt-1">
                  {selectedAccount.accountNo} •{" "}
                  {POPULAR_BANKS.find((b) => b.bin === selectedAccount.bin)?.shortName}
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-2 w-full">
                <button
                  onClick={handleCopy}
                  className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors active:scale-[0.97] text-sm"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-500" /> Đã chép
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-slate-400" /> Chép STK
                    </>
                  )}
                </button>
                <button
                  onClick={handleSaveImage}
                  className="flex-1 py-3 bg-sky-50 hover:bg-sky-100 text-sky-600 border border-sky-200 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors active:scale-[0.97] text-sm"
                >
                  <Download className="w-4 h-4" /> Lưu ảnh
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Zoom Overlay */}
      {isZoomed && qrUrl && selectedAccount && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md cursor-zoom-out"
          onClick={() => setIsZoomed(false)}
          role="dialog"
          aria-label="Mã QR phóng to"
        >
          <button
            onClick={() => setIsZoomed(false)}
            className="absolute top-4 right-4 p-3 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-10"
            aria-label="Đóng"
          >
            <X className="w-6 h-6" />
          </button>

          <div
            className="animate-in zoom-in-75 fade-in duration-200 w-[85vw] max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-white rounded-3xl p-4 shadow-2xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={qrUrl}
                alt="VietQR phóng to"
                className="w-full h-auto object-contain rounded-xl"
              />
              <div className="text-center mt-3">
                <div className="text-2xl font-black text-slate-900 tracking-tight">
                  {parsedAmount.toLocaleString("vi-VN")}{" "}
                  <span className="text-lg text-slate-500">đ</span>
                </div>
                <div className="text-sm font-medium text-slate-500 mt-1">
                  {selectedAccount.accountName}
                </div>
              </div>
            </div>
            <p className="text-center text-white/60 text-sm mt-4">Nhấn bất kỳ để đóng</p>
          </div>
        </div>
      )}
    </div>
  );
}

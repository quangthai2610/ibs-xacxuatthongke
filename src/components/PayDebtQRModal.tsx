"use client";

import { useState } from "react";
import { X, QrCode, Copy, Check, Download } from "lucide-react";
import type { SavedBankAccount } from "@/hooks/useBankAccounts";

interface PayDebtQRModalProps {
  amount: number;
  receiverName: string;
  senderName: string;
  account: SavedBankAccount;
  onClose: () => void;
}

export default function PayDebtQRModal({ amount, receiverName, senderName, account, onClose }: PayDebtQRModalProps) {
  const [copied, setCopied] = useState(false);

  // Generate VietQR URL
  const qrUrl = account 
    ? `https://img.vietqr.io/image/${account.bin}-${account.accountNo}-compact2.png?amount=${amount}&accountName=${encodeURIComponent(account.accountName)}&addInfo=${encodeURIComponent(`${senderName} chuyen khoan`)}`
    : "";

  const handleCopy = () => {
    if (account) {
      navigator.clipboard.writeText(account.accountNo);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = async () => {
    if (!qrUrl) return;
    try {
      const response = await fetch(qrUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `QR_${senderName}_${amount}.png`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error("Error downloading QR", err);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-sky-500 to-indigo-600 p-5 text-white flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold flex items-center gap-2">
                <QrCode className="w-6 h-6" /> Nhận thanh toán
              </h2>
              <p className="text-sky-100 text-sm mt-1">Từ: <span className="font-bold text-white">{senderName}</span></p>
            </div>
            <button onClick={onClose} className="p-2 -mr-2 -mt-2 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-5">
            {/* QR Code Display */}
            {account && (
              <div className="flex flex-col items-center">
                <div className="bg-slate-50 p-2 rounded-2xl border border-slate-200 shadow-inner w-48 h-48 mb-4 relative flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={qrUrl} alt="VietQR" className="w-full h-full object-contain rounded-xl" />
                </div>
                
                <div className="text-center mb-6">
                  <div className="text-3xl font-black text-slate-900 mb-1 tracking-tight">
                    {amount.toLocaleString("vi-VN")} <span className="text-xl text-slate-500">đ</span>
                  </div>
                  <div className="text-sm font-medium text-slate-500 uppercase tracking-wider bg-slate-100 py-1 px-3 rounded-full inline-block">
                    {account.accountName}
                  </div>
                </div>

                <div className="flex gap-2 w-full">
                  <button 
                    onClick={handleCopy}
                    className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors"
                  >
                    {copied ? <><Check className="w-5 h-5 text-emerald-500" /> Đã chép</> : <><Copy className="w-5 h-5 text-slate-400" /> Chép STK</>}
                  </button>
                  <button 
                    onClick={handleDownload}
                    className="flex-1 py-3 bg-sky-50 hover:bg-sky-100 text-sky-600 border border-sky-200 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors"
                  >
                    <Download className="w-5 h-5" /> Tải ảnh
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

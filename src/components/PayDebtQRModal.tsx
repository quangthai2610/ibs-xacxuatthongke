"use client";

import { useState, useRef } from "react";
import { X, QrCode, Copy, Check, Download, ExternalLink, ZoomIn } from "lucide-react";
import type { SavedBankAccount } from "@/hooks/useBankAccounts";

interface PayDebtQRModalProps {
  amount: number;
  receiverName: string;
  senderName: string;
  account: SavedBankAccount;
  onClose: () => void;
}

// Map BIN → VietQR app code (lowercase) for deeplink
const BIN_TO_APP: Record<string, string> = {
  "970436": "vcb",   // Vietcombank
  "970415": "icb",   // VietinBank
  "970418": "bidv",  // BIDV
  "970405": "vba",   // Agribank
  "970422": "mb",    // MBBank
  "970407": "tcb",   // Techcombank
  "970416": "acb",   // ACB
  "970432": "vpb",   // VPBank
  "970423": "tpb",   // TPBank
  "970403": "stb",   // Sacombank
  "970437": "hdb",   // HDBank
  "970441": "vib",   // VIB
  "970443": "shb",   // SHB
  "970431": "eib",   // Eximbank
  "970448": "ocb",   // OCB
};

export default function PayDebtQRModal({ amount, receiverName, senderName, account, onClose }: PayDebtQRModalProps) {
  const [copied, setCopied] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Generate VietQR URL
  const addInfo = `${senderName} chuyen khoan`;
  const qrUrl = account 
    ? `https://img.vietqr.io/image/${account.bin}-${account.accountNo}-compact2.png?amount=${amount}&accountName=${encodeURIComponent(account.accountName)}&addInfo=${encodeURIComponent(addInfo)}`
    : "";

  // Resolve app code from BIN
  const appCode = account ? (BIN_TO_APP[account.bin] || account.shortName?.toLowerCase() || "") : "";

  // VietQR deeplink URL — opens the VietQR gateway which redirects to the user's banking app
  const vietqrDeeplink = account && appCode
    ? `https://dl.vietqr.io/pay?app=${appCode}&ba=${account.bin}-${account.accountNo}&am=${amount}&tn=${encodeURIComponent(addInfo)}`
    : "";

  const handleCopy = () => {
    if (account) {
      navigator.clipboard.writeText(account.accountNo);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Convert the QR image to a blob for sharing/downloading
  const fetchQRBlob = async (): Promise<Blob> => {
    const response = await fetch(qrUrl);
    return await response.blob();
  };

  const handleSave = async () => {
    if (!qrUrl) return;
    try {
      const blob = await fetchQRBlob();
      const file = new File([blob], `QR_${senderName}_${amount}.png`, { type: "image/png" });

      // Use Web Share API if available (iOS / Android) — lets user "Save Image" natively
      if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: `QR thanh toán - ${senderName}`,
          text: `Chuyển khoản ${amount.toLocaleString("vi-VN")}đ`,
          files: [file],
        });
      } else {
        // Fallback for desktop: standard download
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `QR_${senderName}_${amount}.png`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (err) {
      // User cancelled the share dialog — not an error
      if ((err as Error)?.name !== "AbortError") {
        console.error("Error saving QR", err);
      }
    }
  };

  const handleTransfer = () => {
    if (vietqrDeeplink) {
      window.open(vietqrDeeplink, "_blank");
    }
  };

  return (
    <>
      {/* Main Modal */}
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
                {/* Clickable QR — tap to zoom */}
                <button
                  onClick={() => setIsZoomed(true)}
                  className="bg-slate-50 p-2 rounded-2xl border border-slate-200 shadow-inner w-48 h-48 mb-4 relative flex items-center justify-center group cursor-zoom-in active:scale-95 transition-transform"
                  aria-label="Phóng to mã QR"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={qrUrl} alt="VietQR" className="w-full h-full object-contain rounded-xl" />
                  {/* Zoom hint overlay */}
                  <div className="absolute inset-0 rounded-2xl bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <ZoomIn className="w-8 h-8 text-white drop-shadow-lg" />
                  </div>
                </button>
                <p className="text-xs text-slate-400 mb-3 -mt-2">Nhấn vào QR để phóng to</p>
                
                <div className="text-center mb-5">
                  <div className="text-3xl font-black text-slate-900 mb-1 tracking-tight">
                    {amount.toLocaleString("vi-VN")} <span className="text-xl text-slate-500">đ</span>
                  </div>
                  <div className="text-sm font-medium text-slate-500 uppercase tracking-wider bg-slate-100 py-1 px-3 rounded-full inline-block">
                    {account.accountName}
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex flex-col gap-2 w-full">
                  {/* Transfer button — primary CTA */}
                  <button 
                    onClick={handleTransfer}
                    className="w-full py-3.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-500/25 active:scale-[0.98]"
                  >
                    <ExternalLink className="w-5 h-5" /> Chuyển tiền qua App
                  </button>

                  <div className="flex gap-2">
                    <button 
                      onClick={handleCopy}
                      className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors active:scale-[0.97]"
                    >
                      {copied ? <><Check className="w-5 h-5 text-emerald-500" /> Đã chép</> : <><Copy className="w-5 h-5 text-slate-400" /> Chép STK</>}
                    </button>
                    <button 
                      onClick={handleSave}
                      className="flex-1 py-3 bg-sky-50 hover:bg-sky-100 text-sky-600 border border-sky-200 rounded-xl font-bold flex items-center justify-center gap-2 transition-colors active:scale-[0.97]"
                    >
                      <Download className="w-5 h-5" /> Lưu ảnh
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Hidden canvas for image processing */}
      <canvas ref={canvasRef} style={{ display: "none" }} />

      {/* Zoom Overlay */}
      {isZoomed && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md cursor-zoom-out"
          onClick={() => setIsZoomed(false)}
          role="dialog"
          aria-label="Mã QR phóng to"
        >
          {/* Close button */}
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
                  {amount.toLocaleString("vi-VN")} <span className="text-lg text-slate-500">đ</span>
                </div>
                <div className="text-sm font-medium text-slate-500 mt-1">
                  {account?.accountName}
                </div>
              </div>
            </div>
            <p className="text-center text-white/60 text-sm mt-4">Nhấn bất kỳ để đóng</p>
          </div>
        </div>
      )}
    </>
  );
}

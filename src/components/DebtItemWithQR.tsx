"use client";

import { useState } from "react";
import { QrCode } from "lucide-react";
import PayDebtQRModal from "./PayDebtQRModal";

import { useBankAccounts } from "@/hooks/useBankAccounts";

interface DebtItemWithQRProps {
  debtId: string;
  playerName: string;
  otherPlayerName: string;
  amount: number;
  gameId: string;
}

export default function DebtItemWithQR({ debtId, playerName, otherPlayerName, amount, gameId }: DebtItemWithQRProps) {
  const [showQR, setShowQR] = useState(false);
  const { accounts, isLoaded } = useBankAccounts();

  // Find mapping account
  const matchedAccount = accounts.find(
    (a) => a.label?.toLowerCase() === playerName.toLowerCase() || a.accountName.toLowerCase() === playerName.toLowerCase()
  );

  return (
    <>
      <div className="flex justify-between items-center bg-white/20 px-4 py-2 rounded-xl backdrop-blur-md">
        <span className="font-semibold text-white">{playerName} trả:</span>
        <div className="flex items-center gap-3">
          <span className="font-bold text-white text-lg">{amount.toLocaleString("vi-VN")} đ</span>
          {isLoaded && matchedAccount && (
            <button 
              onClick={() => setShowQR(true)}
              className="p-1.5 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors flex items-center justify-center shadow-sm"
              title="Mã QR Thanh toán"
            >
              <QrCode className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {showQR && matchedAccount && (
        <PayDebtQRModal 
          amount={amount} 
          receiverName={playerName}
          senderName={otherPlayerName}
          account={matchedAccount}
          onClose={() => setShowQR(false)} 
        />
      )}
    </>
  );
}

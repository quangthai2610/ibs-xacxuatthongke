"use client";

import { useState, useEffect } from "react";
import { verifyGamePassword } from "@/app/actions/game";
import { Shield, Eye, Lock, Loader2, X } from "lucide-react";

type Role = "host" | "guest" | null;

export default function GameAuthGate({
  gameId,
  hasPassword,
  children,
}: {
  gameId: string;
  hasPassword: boolean;
  children: (isHost: boolean) => React.ReactNode;
}) {
  const [role, setRole] = useState<Role>(null);
  const [showPasswordInput, setShowPasswordInput] = useState(false);
  const [password, setPassword] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState("");
  const [isChecking, setIsChecking] = useState(true);

  const storageKey = `game_role_${gameId}`;

  // Kiểm tra role đã lưu trong sessionStorage
  useEffect(() => {
    const savedRole = sessionStorage.getItem(storageKey) as Role;
    if (savedRole === "host" || savedRole === "guest") {
      setRole(savedRole);
    }
    setIsChecking(false);
  }, [storageKey]);

  // Nếu game không có password, tất cả đều là host
  useEffect(() => {
    if (!isChecking && !hasPassword && role === null) {
      setRole("host");
      sessionStorage.setItem(storageKey, "host");
    }
  }, [hasPassword, isChecking, role, storageKey]);

  const handleSelectGuest = () => {
    setRole("guest");
    sessionStorage.setItem(storageKey, "guest");
  };

  const handleSelectHost = () => {
    if (hasPassword) {
      setShowPasswordInput(true);
      setError("");
      setPassword("");
    } else {
      setRole("host");
      sessionStorage.setItem(storageKey, "host");
    }
  };

  const handleVerifyPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsVerifying(true);

    try {
      const isValid = await verifyGamePassword(gameId, password);
      if (isValid) {
        setRole("host");
        sessionStorage.setItem(storageKey, "host");
        setShowPasswordInput(false);
      } else {
        setError("Mật khẩu không đúng");
      }
    } catch {
      setError("Lỗi xác thực");
    } finally {
      setIsVerifying(false);
    }
  };

  // Đang kiểm tra role
  if (isChecking) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-50" style={{ minHeight: '100dvh' }}>
        <Loader2 className="w-8 h-8 animate-spin text-sky-500" />
      </div>
    );
  }

  // Đã xác thực
  if (role !== null) {
    return <>{children(role === "host")}</>;
  }

  // Modal chọn vai trò
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gradient-to-b from-slate-900/80 to-slate-900/95 backdrop-blur-md" style={{ minHeight: '100dvh' }}>
        
        {!showPasswordInput ? (
          /* Chọn vai trò */
          <div className="bg-white w-full max-w-sm rounded-3xl p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-300">
            <div className="flex flex-col items-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-sky-400 to-indigo-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-sky-500/30">
                <span className="text-3xl">🃏</span>
              </div>
              <h2 className="text-xl font-bold text-slate-800">Bạn là ai?</h2>
              <p className="text-sm text-slate-500 mt-1 text-center">
                Chọn vai trò của bạn trong ván đấu này
              </p>
            </div>

            <div className="space-y-3">
              {/* Nhà cái */}
              <button
                onClick={handleSelectHost}
                className="w-full flex items-center gap-4 p-4 rounded-2xl border-2 border-slate-100 hover:border-amber-300 hover:bg-amber-50/50 transition-all group active:scale-[0.98]"
              >
                <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-amber-200 transition-colors">
                  <Shield className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <div className="font-bold text-slate-800">Nhà cái</div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Quản lý, thêm & sửa điểm ván đấu
                  </div>
                </div>
                {hasPassword && <Lock className="w-4 h-4 text-slate-300 ml-auto shrink-0" />}
              </button>

              {/* Khách */}
              <button
                onClick={handleSelectGuest}
                className="w-full flex items-center gap-4 p-4 rounded-2xl border-2 border-slate-100 hover:border-sky-300 hover:bg-sky-50/50 transition-all group active:scale-[0.98]"
              >
                <div className="w-12 h-12 bg-sky-100 text-sky-600 rounded-xl flex items-center justify-center shrink-0 group-hover:bg-sky-200 transition-colors">
                  <Eye className="w-6 h-6" />
                </div>
                <div className="text-left">
                  <div className="font-bold text-slate-800">Khách</div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    Chỉ theo dõi bảng điểm trận đấu
                  </div>
                </div>
              </button>
            </div>
          </div>
        ) : (
          /* Nhập mật khẩu */
          <div className="bg-white w-full max-w-sm rounded-3xl p-8 shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-800">Xác thực</h2>
                  <p className="text-xs text-slate-500">Nhập mật khẩu nhà cái</p>
                </div>
              </div>
              <button
                onClick={() => setShowPasswordInput(false)}
                className="text-slate-400 hover:text-slate-600 bg-slate-100 rounded-full p-1.5"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleVerifyPassword}>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu"
                autoFocus
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-800 text-center text-lg font-semibold tracking-widest focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all mb-4"
              />

              {error && (
                <p className="text-red-500 text-sm mb-4 font-medium text-center animate-in fade-in duration-200">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={isVerifying || !password.trim()}
                className="w-full bg-amber-500 hover:bg-amber-600 active:bg-amber-700 disabled:bg-slate-300 text-white font-bold py-4 px-6 rounded-xl shadow-md shadow-amber-500/20 flex items-center justify-center gap-2 transition-all"
              >
                {isVerifying ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <Shield className="w-5 h-5" />
                )}
                <span>Xác nhận</span>
              </button>
            </form>
          </div>
        )}
    </div>
  );
}

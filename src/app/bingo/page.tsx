"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  Play,
  Pause,
  RotateCcw,
  Settings,
  X,
  Check,
  Zap,
  Banknote,
} from "lucide-react";

export default function BingoPage() {
  const [minRange, setMinRange] = useState(1);
  const [maxRange, setMaxRange] = useState(75);
  const [interval, setIntervalTime] = useState(5);
  const [drawnNumbers, setDrawnNumbers] = useState<number[]>([]);
  const [currentNumber, setCurrentNumber] = useState<number | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [isAutoMode, setIsAutoMode] = useState(false);
  const [displayNumber, setDisplayNumber] = useState<number | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [tempMin, setTempMin] = useState("1");
  const [tempMax, setTempMax] = useState("75");
  const [tempInterval, setTempInterval] = useState("5");
  const [prizeAmount, setPrizeAmount] = useState("");
  const [showPrizeInput, setShowPrizeInput] = useState(false);
  const [tempPrize, setTempPrize] = useState("");
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const rafRef = useRef<number | null>(null);
  const autoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastTickRef = useRef(0);
  const spinStartRef = useRef(0);
  const resultRef = useRef<number | null>(null);
  const drawnRef = useRef<number[]>([]);

  const SPIN_DURATION = 2000;

  useEffect(() => {
    drawnRef.current = drawnNumbers;
  }, [drawnNumbers]);

  const allNumbers = Array.from(
    { length: maxRange - minRange + 1 },
    (_, i) => i + minRange
  );
  const totalNumbers = allNumbers.length;
  const remainingNumbers = allNumbers.filter((n) => !drawnNumbers.includes(n));
  const isAllDrawn = remainingNumbers.length === 0;

  const getRemainingFromRef = () =>
    allNumbers.filter((n) => !drawnRef.current.includes(n));

  useEffect(() => {
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (autoTimerRef.current) clearTimeout(autoTimerRef.current);
    };
  }, []);

  const animationLoop = (timestamp: number) => {
    const elapsed = timestamp - spinStartRef.current;
    const remaining = getRemainingFromRef();
    if (elapsed >= SPIN_DURATION) {
      const result = resultRef.current!;
      setDisplayNumber(result);
      setCurrentNumber(result);
      setDrawnNumbers((prev) => [...prev, result]);
      setIsSpinning(false);
      rafRef.current = null;
      return;
    }
    const progress = elapsed / SPIN_DURATION;
    let tickInterval: number;
    if (progress < 0.5) tickInterval = 40;
    else if (progress < 0.75) tickInterval = 80;
    else if (progress < 0.9) tickInterval = 150;
    else tickInterval = 300;
    if (timestamp - lastTickRef.current >= tickInterval) {
      lastTickRef.current = timestamp;
      if (remaining.length > 0) {
        setDisplayNumber(remaining[Math.floor(Math.random() * remaining.length)]);
      }
    }
    rafRef.current = requestAnimationFrame(animationLoop);
  };

  const spinOnce = () => {
    const remaining = getRemainingFromRef();
    if (remaining.length === 0) { setIsAutoMode(false); return; }
    resultRef.current = remaining[Math.floor(Math.random() * remaining.length)];
    setIsSpinning(true);
    spinStartRef.current = performance.now();
    lastTickRef.current = 0;
    rafRef.current = requestAnimationFrame(animationLoop);
  };

  useEffect(() => {
    if (isAutoMode && !isSpinning && !isTransitioning && !isAllDrawn) {
      setCountdown(interval);
      const countdownTimer = setInterval(() => {
        setCountdown((prev) => {
          if (prev === null || prev <= 1) return null;
          return prev - 1;
        });
      }, 1000);
      autoTimerRef.current = setTimeout(() => {
        setCountdown(null);
        // Chuyển xanh → đỏ trước khi quay
        setIsTransitioning(true);
        setTimeout(() => {
          setIsTransitioning(false);
          spinOnce();
        }, 600);
      }, interval * 1000);
      return () => { clearInterval(countdownTimer); if (autoTimerRef.current) clearTimeout(autoTimerRef.current); };
    } else {
      setCountdown(null);
    }
    return () => { if (autoTimerRef.current) clearTimeout(autoTimerRef.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAutoMode, isSpinning, isTransitioning, isAllDrawn, interval]);

  const handleManualSpin = () => { if (!isSpinning && !isAllDrawn) spinOnce(); };
  const handleAutoToggle = () => {
    if (isAutoMode) { setIsAutoMode(false); if (autoTimerRef.current) clearTimeout(autoTimerRef.current); }
    else { setIsAutoMode(true); if (!isSpinning) spinOnce(); }
  };

  const handleReset = () => {
    setIsAutoMode(false); setIsSpinning(false); setIsTransitioning(false); setDrawnNumbers([]);
    setCurrentNumber(null); setDisplayNumber(null); setCountdown(null);
    drawnRef.current = []; resultRef.current = null;
    if (rafRef.current) { cancelAnimationFrame(rafRef.current); rafRef.current = null; }
    if (autoTimerRef.current) { clearTimeout(autoTimerRef.current); autoTimerRef.current = null; }
  };

  const handleSaveSettings = () => {
    const parsedMin = parseInt(tempMin);
    const parsedMax = parseInt(tempMax);
    const parsedInterval = parseFloat(tempInterval);

    const finalMin = isNaN(parsedMin) ? 1 : parsedMin;
    const finalMax = isNaN(parsedMax) ? 75 : parsedMax;
    const finalInterval = isNaN(parsedInterval) ? 5 : Math.max(0, parsedInterval);

    // Prevent invalid range
    if (finalMin >= finalMax) {
      alert("Phạm vi số không hợp lệ. Số 'Từ' phải nhỏ hơn số 'Đến'.");
      return;
    }

    const rangeChanged = finalMin !== minRange || finalMax !== maxRange;
    
    setMinRange(finalMin); 
    setMaxRange(finalMax); 
    setIntervalTime(finalInterval);
    
    if (rangeChanged) {
      handleReset();
    }
    setShowSettings(false);
  };

  const formatCurrency = (val: string) => {
    const num = val.replace(/[^0-9]/g, "");
    if (!num) return "";
    return parseInt(num, 10).toLocaleString("vi-VN");
  };

  const handleSavePrize = () => {
    setPrizeAmount(tempPrize);
    setShowPrizeInput(false);
  };

  const gridCols = totalNumbers <= 30 ? 5 : totalNumbers <= 50 ? 6 : totalNumbers <= 75 ? 8 : 10;
  const desktopGridCols = totalNumbers <= 30 ? 10 : totalNumbers <= 50 ? 10 : totalNumbers <= 75 ? 15 : 15;

  const getDrawnStyle = (n: number, isCurrent: boolean) => {
    if (isCurrent && !isTransitioning && !isSpinning) {
      return "bg-gradient-to-br from-emerald-400 to-emerald-600 text-white scale-110 shadow-[0_0_20px_rgba(52,211,153,0.6)] ring-2 ring-emerald-300 z-10";
    }
    if (drawnNumbers.includes(n)) {
      return "bg-red-500 text-white";
    }
    return "";
  };

  return (
    <div className="fixed inset-0 z-40 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white flex flex-col">
      {/* Header */}
      <header className="px-4 py-3 lg:py-4 flex items-center justify-between z-20 bg-slate-950/80 backdrop-blur-sm border-b border-white/5 shrink-0">
        <div className="flex items-center">
          <Link href="/" className="p-2 -ml-2 text-slate-400 hover:text-white transition-colors">
            <ChevronLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-lg font-bold ml-1 bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
            🎱 IBS-Bingo
          </h1>
        </div>
        <div className="flex items-center gap-1">
          {/* Prize button */}
          <button
            onClick={() => { setTempPrize(prizeAmount); setShowPrizeInput(true); }}
            className={`p-2 transition-colors flex items-center gap-1 rounded-lg text-xs font-semibold ${prizeAmount ? "text-amber-400 bg-amber-400/10" : "text-slate-400 hover:text-white"
              }`}
          >
            <Banknote className="w-5 h-5" />
            {prizeAmount && (
              <span className="hidden sm:inline">{formatCurrency(prizeAmount)}đ</span>
            )}
          </button>
          <button
            onClick={() => { setTempMin(String(minRange)); setTempMax(String(maxRange)); setTempInterval(String(interval)); setShowSettings(true); }}
            className="p-2 text-slate-400 hover:text-white transition-colors"
          >
            <Settings className="w-5 h-5" />
          </button>
          <button onClick={handleReset} className="p-2 text-slate-400 hover:text-white transition-colors">
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto w-full">
          {/* ── Top Section: Orb centered ── */}
          <div className="flex flex-col items-center pt-6 lg:pt-10 pb-4 px-4">
            {/* Prize display */}
            {prizeAmount && (
              <div className="mb-4 bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20 rounded-full px-5 py-1.5 flex items-center gap-2">
                <Banknote className="w-4 h-4 text-amber-400" />
                <span className="text-amber-300 font-bold text-sm">
                  Giải thưởng: {formatCurrency(prizeAmount)}đ
                </span>
              </div>
            )}

            {/* Orb */}
            <div className="relative mb-5">
              <div
                className={`w-36 h-36 lg:w-48 lg:h-48 rounded-full flex items-center justify-center relative ${isSpinning
                    ? "bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 shadow-[0_0_80px_rgba(251,146,60,0.5)]"
                    : isTransitioning
                      ? "bg-gradient-to-br from-red-500 to-rose-600 shadow-[0_0_50px_rgba(239,68,68,0.4)]"
                      : currentNumber
                        ? "bg-gradient-to-br from-emerald-400 to-teal-500 shadow-[0_0_50px_rgba(52,211,153,0.3)]"
                        : "bg-gradient-to-br from-slate-700 to-slate-800 shadow-[0_0_30px_rgba(100,116,139,0.15)]"
                  } transition-all duration-500`}
              >
                <div className="absolute top-3 left-5 w-10 h-6 lg:w-14 lg:h-8 bg-white/20 rounded-full blur-md" />
                <div className="absolute top-5 left-8 w-3 h-2 lg:w-5 lg:h-3 bg-white/30 rounded-full blur-sm" />
                <span
                  className={`font-black tabular-nums relative z-10 ${isSpinning ? "animate-pulse" : ""} ${(displayNumber ?? currentNumber ?? 0) >= 100 ? "text-4xl lg:text-6xl" : "text-6xl lg:text-8xl"
                    }`}
                  style={{ textShadow: "0 4px 16px rgba(0,0,0,0.4)" }}
                >
                  {isSpinning ? displayNumber ?? "?" : currentNumber ?? "?"}
                </span>
              </div>
              {isSpinning && (
                <>
                  <div className="absolute inset-0 rounded-full border-4 border-amber-400/30 animate-ping" />
                  <div className="absolute inset-[-10px] rounded-full border-2 border-orange-400/15 animate-ping" style={{ animationDelay: "0.3s" }} />
                </>
              )}
            </div>

            {/* Status */}
            <div className="text-center mb-3">
              {isAllDrawn ? (
                <p className="text-emerald-400 font-bold text-lg">🎉 Đã quay hết!</p>
              ) : (
                <p className="text-slate-500 text-sm">
                  <span className="text-white font-bold">{drawnNumbers.length}</span>
                  <span className="text-slate-600 mx-1">/</span>
                  <span>{totalNumbers}</span>
                  {isAutoMode && !isSpinning && countdown !== null && (
                    <span className="text-amber-400 ml-2 font-bold text-base tabular-nums">{countdown}s</span>
                  )}
                </p>
              )}
            </div>

            {/* History ribbon */}
            {drawnNumbers.length > 0 && (
              <div className="flex flex-wrap justify-center gap-1.5 px-2 mb-2 max-w-xs lg:max-w-lg">
                {drawnNumbers.slice(-20).reverse().map((n, i) => (
                  <div
                    key={`h-${n}-${i}`}
                    className={`w-8 h-8 lg:w-9 lg:h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-500 ${
                      i === 0 && !isTransitioning && !isSpinning
                        ? "bg-gradient-to-br from-emerald-400 to-emerald-600 text-white scale-110 shadow-[0_0_16px_rgba(52,211,153,0.5)] ring-2 ring-emerald-300/50"
                        : "bg-red-500 text-white"
                    }`}
                  >
                    {n}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Bottom Section: Number Grid ── */}
          <div className="px-3 lg:px-8 pb-32 lg:pb-8">
            {/* Mobile grid */}
            <div className="lg:hidden">
              <div
                className="grid gap-[2px]"
                style={{ gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))` }}
              >
                {allNumbers.map((n) => {
                  const isDrawn = drawnNumbers.includes(n);
                  const isCurrent = n === currentNumber;
                  const style = isDrawn || isCurrent
                    ? getDrawnStyle(n, isCurrent)
                    : "bg-slate-800/60 text-slate-400 border border-slate-700/40";
                  return (
                    <div
                      key={n}
                      className={`aspect-square rounded-md flex items-center justify-center text-[11px] font-bold transition-all duration-500 ${style}`}
                    >
                      {n}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Desktop grid */}
            <div className="hidden lg:block">
              <div
                className="grid gap-1"
                style={{ gridTemplateColumns: `repeat(${desktopGridCols}, minmax(0, 1fr))` }}
              >
                {allNumbers.map((n) => {
                  const isDrawn = drawnNumbers.includes(n);
                  const isCurrent = n === currentNumber;
                  const style = isDrawn || isCurrent
                    ? getDrawnStyle(n, isCurrent)
                    : "bg-slate-800/50 text-slate-400 border border-slate-700/30 hover:bg-slate-700/50 hover:text-slate-300";
                  return (
                    <div
                      key={n}
                      className={`aspect-square rounded-lg flex items-center justify-center text-sm font-bold transition-all duration-500 cursor-default ${style}`}
                    >
                      {n}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Fixed Bottom Controls (Mobile only) ── */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-slate-950/95 backdrop-blur-md border-t border-white/5 p-3 pb-[calc(max(0.75rem,env(safe-area-inset-bottom)))] z-20">
        <div className="flex gap-2">
          <button
            onClick={handleManualSpin}
            disabled={isSpinning || isAllDrawn}
            className="flex-1 py-3.5 px-4 rounded-xl font-bold text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:from-slate-700 disabled:to-slate-800 disabled:text-slate-500 transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95"
          >
            <Play className="w-5 h-5" />
            <span>Quay số</span>
          </button>
          <button
            onClick={handleAutoToggle}
            disabled={isAllDrawn}
            className={`py-3.5 px-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 active:scale-95 ${isAutoMode
                ? "bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20"
                : "bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
              } disabled:bg-slate-800 disabled:text-slate-600 disabled:border-slate-700`}
          >
            {isAutoMode ? <><Pause className="w-5 h-5" /><span>Dừng</span></> : <><Zap className="w-5 h-5" /><span>Auto</span></>}
          </button>
        </div>
      </div>

      {/* ── Desktop Controls (inline, below header) ── */}
      <div className="hidden lg:flex fixed bottom-6 left-1/2 -translate-x-1/2 z-20 bg-slate-900/90 backdrop-blur-lg border border-white/10 rounded-2xl p-3 gap-3 shadow-2xl">
        <button
          onClick={handleManualSpin}
          disabled={isSpinning || isAllDrawn}
          className="py-3 px-8 rounded-xl font-bold text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:from-slate-700 disabled:to-slate-800 disabled:text-slate-500 transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95"
        >
          <Play className="w-5 h-5" />
          <span>Quay số</span>
        </button>
        <button
          onClick={handleAutoToggle}
          disabled={isAllDrawn}
          className={`py-3 px-6 rounded-xl font-bold transition-all flex items-center justify-center gap-2 active:scale-95 ${isAutoMode
              ? "bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20"
              : "bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
            } disabled:bg-slate-800 disabled:text-slate-600 disabled:border-slate-700`}
        >
          {isAutoMode ? <><Pause className="w-5 h-5" /><span>Dừng</span></> : <><Zap className="w-5 h-5" /><span>Tự động</span></>}
        </button>
      </div>

      {/* ── Settings Modal ── */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-slate-800 rounded-2xl p-6 w-full max-w-sm shadow-2xl border border-slate-700">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Cài đặt Bingo</h2>
              <button onClick={() => setShowSettings(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">Phạm vi số</label>
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <input type="number" inputMode="numeric" value={tempMin} onChange={(e) => setTempMin(e.target.value)}
                      className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-center text-lg font-bold text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50" placeholder="Từ" />
                    <span className="block text-[10px] text-slate-500 text-center mt-1">Từ</span>
                  </div>
                  <span className="text-slate-500 font-bold text-lg">→</span>
                  <div className="flex-1">
                    <input type="number" inputMode="numeric" value={tempMax} onChange={(e) => setTempMax(e.target.value)}
                      className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-center text-lg font-bold text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50" placeholder="Đến" />
                    <span className="block text-[10px] text-slate-500 text-center mt-1">Đến</span>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">Thời gian giữa mỗi lần quay (giây)</label>
                <input type="number" inputMode="decimal" value={tempInterval} onChange={(e) => setTempInterval(e.target.value)} min="0" step="0.5"
                  className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-center text-lg font-bold text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50" />
              </div>
            </div>
            <div className="flex gap-3 mt-8">
              <button onClick={() => setShowSettings(false)} className="flex-1 py-3 px-4 rounded-xl font-semibold text-slate-300 bg-slate-700 hover:bg-slate-600 transition-colors flex items-center justify-center gap-2">
                <X className="w-5 h-5" /><span>Hủy</span>
              </button>
              <button onClick={handleSaveSettings} className="flex-1 py-3 px-4 rounded-xl font-semibold text-white bg-amber-500 hover:bg-amber-600 transition-colors flex items-center justify-center gap-2 shadow-md">
                <Check className="w-5 h-5" /><span>Lưu</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Prize Input Modal ── */}
      {showPrizeInput && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-slate-800 rounded-2xl p-6 w-full max-w-sm shadow-2xl border border-slate-700">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Banknote className="w-6 h-6 text-amber-400" /> Giải thưởng
              </h2>
              <button onClick={() => setShowPrizeInput(false)} className="p-1 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-slate-400 mb-4">Nhập số tiền giải thưởng để hiển thị trên màn hình.</p>
            <div className="relative mb-6">
              <input
                type="text"
                inputMode="numeric"
                value={formatCurrency(tempPrize)}
                onChange={(e) => setTempPrize(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleSavePrize(); }}
                placeholder="Ví dụ: 500,000"
                className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-lg font-bold text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 pr-10"
                autoFocus
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-semibold">đ</span>
            </div>
            <div className="flex gap-3">
              <button onClick={() => { setPrizeAmount(""); setShowPrizeInput(false); }}
                className="flex-1 py-3 px-4 rounded-xl font-semibold text-slate-300 bg-slate-700 hover:bg-slate-600 transition-colors flex items-center justify-center gap-2">
                <X className="w-5 h-5" /><span>Xóa</span>
              </button>
              <button onClick={handleSavePrize}
                className="flex-1 py-3 px-4 rounded-xl font-semibold text-white bg-amber-500 hover:bg-amber-600 transition-colors flex items-center justify-center gap-2 shadow-md">
                <Check className="w-5 h-5" /><span>Lưu</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

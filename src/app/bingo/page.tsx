"use client";

import { useState, useEffect, useRef, useCallback } from "react";
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

  const spinTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const autoTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const spinStartRef = useRef<number>(0);
  const spinDuration = 2000; // 2s animation

  // Tất cả số trong range
  const allNumbers = Array.from(
    { length: maxRange - minRange + 1 },
    (_, i) => i + minRange
  );

  // Số chưa được quay
  const remainingNumbers = allNumbers.filter(
    (n) => !drawnNumbers.includes(n)
  );

  const isAllDrawn = remainingNumbers.length === 0;

  // Clean up timers
  useEffect(() => {
    return () => {
      if (spinTimerRef.current) clearInterval(spinTimerRef.current);
      if (autoTimerRef.current) clearTimeout(autoTimerRef.current);
    };
  }, []);

  // Quay 1 số
  const spinOnce = useCallback(() => {
    if (remainingNumbers.length === 0) {
      setIsAutoMode(false);
      return;
    }

    setIsSpinning(true);
    spinStartRef.current = Date.now();

    // Chọn số kết quả trước
    const randomIndex = Math.floor(Math.random() * remainingNumbers.length);
    const result = remainingNumbers[randomIndex];

    // Hiệu ứng nhảy số
    spinTimerRef.current = setInterval(() => {
      const elapsed = Date.now() - spinStartRef.current;

      if (elapsed < spinDuration) {
        // Nhảy số ngẫu nhiên — tăng tốc dần rồi chậm lại
        const speed = elapsed < spinDuration * 0.6 ? 50 : elapsed < spinDuration * 0.85 ? 120 : 250;
        const randomDisplay =
          remainingNumbers[
            Math.floor(Math.random() * remainingNumbers.length)
          ];
        setDisplayNumber(randomDisplay);

        // Reschedule with varying speed
        if (spinTimerRef.current) clearInterval(spinTimerRef.current);
        spinTimerRef.current = setInterval(() => {
          const now = Date.now() - spinStartRef.current;
          if (now >= spinDuration) {
            if (spinTimerRef.current) clearInterval(spinTimerRef.current);
            spinTimerRef.current = null;
            setDisplayNumber(result);
            setCurrentNumber(result);
            setDrawnNumbers((prev) => [...prev, result]);
            setIsSpinning(false);
          } else {
            const rd =
              remainingNumbers[
                Math.floor(Math.random() * remainingNumbers.length)
              ];
            setDisplayNumber(rd);
          }
        }, speed);
      }
    }, 50);
  }, [remainingNumbers, spinDuration]);

  // Auto mode
  useEffect(() => {
    if (isAutoMode && !isSpinning && !isAllDrawn) {
      autoTimerRef.current = setTimeout(() => {
        spinOnce();
      }, interval * 1000);
    }

    return () => {
      if (autoTimerRef.current) clearTimeout(autoTimerRef.current);
    };
  }, [isAutoMode, isSpinning, isAllDrawn, interval, spinOnce]);

  const handleManualSpin = () => {
    if (!isSpinning && !isAllDrawn) {
      spinOnce();
    }
  };

  const handleAutoToggle = () => {
    if (isAutoMode) {
      setIsAutoMode(false);
      if (autoTimerRef.current) clearTimeout(autoTimerRef.current);
    } else {
      setIsAutoMode(true);
      if (!isSpinning) {
        spinOnce();
      }
    }
  };

  const handleReset = () => {
    setIsAutoMode(false);
    setIsSpinning(false);
    setDrawnNumbers([]);
    setCurrentNumber(null);
    setDisplayNumber(null);
    if (spinTimerRef.current) {
      clearInterval(spinTimerRef.current);
      spinTimerRef.current = null;
    }
    if (autoTimerRef.current) {
      clearTimeout(autoTimerRef.current);
      autoTimerRef.current = null;
    }
  };

  const handleSaveSettings = () => {
    const newMin = parseInt(tempMin) || 1;
    const newMax = parseInt(tempMax) || 75;
    const newInterval = parseFloat(tempInterval) || 5;

    if (newMin >= newMax) return;
    if (newInterval < 1) return;

    setMinRange(newMin);
    setMaxRange(newMax);
    setIntervalTime(newInterval);
    handleReset();
    setShowSettings(false);
  };

  // Tính số cột cho grid dựa trên range
  const totalNumbers = maxRange - minRange + 1;
  const gridCols = totalNumbers <= 30 ? 5 : totalNumbers <= 50 ? 6 : totalNumbers <= 75 ? 8 : 10;

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Header */}
      <header className="px-4 py-4 flex items-center justify-between z-20 bg-slate-900/80 backdrop-blur-sm border-b border-white/10">
        <div className="flex items-center">
          <Link
            href="/"
            className="p-2 -ml-2 text-slate-400 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-lg font-bold ml-1 bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">
            🎱 Bingo
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              setTempMin(String(minRange));
              setTempMax(String(maxRange));
              setTempInterval(String(interval));
              setShowSettings(true);
            }}
            className="p-2 text-slate-400 hover:text-white transition-colors"
          >
            <Settings className="w-5 h-5" />
          </button>
          <button
            onClick={handleReset}
            className="p-2 text-slate-400 hover:text-white transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto pb-[200px]">
        {/* Main Display */}
        <div className="flex flex-col items-center justify-center py-8 px-4">
          {/* Quả cầu số */}
          <div className="relative mb-6">
            <div
              className={`w-40 h-40 rounded-full flex items-center justify-center relative ${
                isSpinning
                  ? "bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 shadow-[0_0_60px_rgba(251,146,60,0.5)]"
                  : currentNumber
                  ? "bg-gradient-to-br from-emerald-400 to-teal-500 shadow-[0_0_40px_rgba(52,211,153,0.3)]"
                  : "bg-gradient-to-br from-slate-600 to-slate-700 shadow-[0_0_30px_rgba(100,116,139,0.2)]"
              } transition-all duration-300`}
            >
              {/* Shine effect */}
              <div className="absolute top-3 left-6 w-12 h-8 bg-white/20 rounded-full blur-md" />
              <div className="absolute top-6 left-10 w-4 h-3 bg-white/30 rounded-full blur-sm" />

              <span
                className={`font-black tabular-nums relative z-10 ${
                  isSpinning ? "animate-pulse" : ""
                } ${
                  (displayNumber ?? currentNumber ?? 0) >= 100
                    ? "text-5xl"
                    : "text-7xl"
                }`}
                style={{
                  textShadow: "0 4px 12px rgba(0,0,0,0.3)",
                }}
              >
                {isSpinning
                  ? displayNumber ?? "?"
                  : currentNumber ?? "?"}
              </span>
            </div>

            {/* Pulse ring khi quay */}
            {isSpinning && (
              <>
                <div className="absolute inset-0 rounded-full border-4 border-amber-400/40 animate-ping" />
                <div
                  className="absolute inset-[-8px] rounded-full border-2 border-orange-400/20 animate-ping"
                  style={{ animationDelay: "0.3s" }}
                />
              </>
            )}
          </div>

          {/* Status */}
          <div className="text-center mb-6">
            {isAllDrawn ? (
              <p className="text-emerald-400 font-bold text-lg">
                🎉 Đã quay hết tất cả số!
              </p>
            ) : (
              <p className="text-slate-400 text-sm">
                Đã quay{" "}
                <span className="text-white font-bold">
                  {drawnNumbers.length}
                </span>{" "}
                / {totalNumbers} số
                {isAutoMode && !isSpinning && (
                  <span className="text-amber-400 ml-2">
                    • Quay tiếp sau {interval}s
                  </span>
                )}
              </p>
            )}
          </div>

          {/* Drawn history - last 5 */}
          {drawnNumbers.length > 0 && (
            <div className="flex items-center gap-2 mb-8 px-4 overflow-x-auto max-w-full">
              <span className="text-[10px] text-slate-500 uppercase tracking-wider shrink-0">
                Gần nhất
              </span>
              {drawnNumbers
                .slice(-8)
                .reverse()
                .map((n, i) => (
                  <div
                    key={`${n}-${i}`}
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0 transition-all ${
                      i === 0
                        ? "bg-emerald-500 text-white scale-110 shadow-lg shadow-emerald-500/30"
                        : "bg-slate-700 text-slate-300"
                    }`}
                  >
                    {n}
                  </div>
                ))}
            </div>
          )}

          {/* Number Grid */}
          <div className="w-full px-3">
            <div
              className="grid gap-[3px]"
              style={{
                gridTemplateColumns: `repeat(${gridCols}, minmax(0, 1fr))`,
              }}
            >
              {allNumbers.map((n) => {
                const isDrawn = drawnNumbers.includes(n);
                const isCurrent = n === currentNumber;
                return (
                  <div
                    key={n}
                    className={`aspect-square rounded-lg flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                      isCurrent
                        ? "bg-emerald-500 text-white scale-110 shadow-lg shadow-emerald-500/40 ring-2 ring-emerald-300"
                        : isDrawn
                        ? "bg-slate-600/80 text-slate-400 line-through"
                        : "bg-slate-700/50 text-slate-300 border border-slate-600/30"
                    }`}
                  >
                    {n}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>

      {/* Fixed Bottom Controls */}
      <div className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-md border-t border-white/10 p-4 pb-[calc(max(1.5rem,env(safe-area-inset-bottom)))] z-20 w-full max-w-md mx-auto">
        <div className="flex gap-3">
          {/* Quay 1 lần */}
          <button
            onClick={handleManualSpin}
            disabled={isSpinning || isAllDrawn}
            className="flex-1 py-4 px-4 rounded-xl font-bold text-white bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:from-slate-600 disabled:to-slate-700 disabled:text-slate-400 transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-95"
          >
            <Play className="w-5 h-5" />
            <span>Quay số</span>
          </button>

          {/* Auto toggle */}
          <button
            onClick={handleAutoToggle}
            disabled={isAllDrawn}
            className={`py-4 px-5 rounded-xl font-bold transition-all flex items-center justify-center gap-2 active:scale-95 ${
              isAutoMode
                ? "bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20"
                : "bg-slate-700 hover:bg-slate-600 text-slate-200 border border-slate-600"
            } disabled:bg-slate-700 disabled:text-slate-500 disabled:border-slate-600`}
          >
            {isAutoMode ? (
              <>
                <Pause className="w-5 h-5" />
                <span>Dừng</span>
              </>
            ) : (
              <>
                <Zap className="w-5 h-5" />
                <span>Tự động</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-slate-800 rounded-2xl p-6 w-full max-w-sm shadow-2xl border border-slate-700">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">Cài đặt Bingo</h2>
              <button
                onClick={() => setShowSettings(false)}
                className="p-1 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-5">
              {/* Range */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">
                  Phạm vi số
                </label>
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <input
                      type="number"
                      inputMode="numeric"
                      value={tempMin}
                      onChange={(e) => setTempMin(e.target.value)}
                      className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-center text-lg font-bold text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500"
                      placeholder="Từ"
                    />
                    <span className="block text-[10px] text-slate-500 text-center mt-1">
                      Từ
                    </span>
                  </div>
                  <span className="text-slate-500 font-bold text-lg">→</span>
                  <div className="flex-1">
                    <input
                      type="number"
                      inputMode="numeric"
                      value={tempMax}
                      onChange={(e) => setTempMax(e.target.value)}
                      className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-center text-lg font-bold text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500"
                      placeholder="Đến"
                    />
                    <span className="block text-[10px] text-slate-500 text-center mt-1">
                      Đến
                    </span>
                  </div>
                </div>
              </div>

              {/* Interval */}
              <div>
                <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">
                  Thời gian giữa mỗi lần quay (giây)
                </label>
                <input
                  type="number"
                  inputMode="decimal"
                  value={tempInterval}
                  onChange={(e) => setTempInterval(e.target.value)}
                  min="1"
                  step="1"
                  className="w-full bg-slate-700 border border-slate-600 rounded-xl px-4 py-3 text-center text-lg font-bold text-white focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setShowSettings(false)}
                className="flex-1 py-3 px-4 rounded-xl font-semibold text-slate-300 bg-slate-700 hover:bg-slate-600 transition-colors flex items-center justify-center gap-2"
              >
                <X className="w-5 h-5" />
                <span>Hủy</span>
              </button>
              <button
                onClick={handleSaveSettings}
                className="flex-1 py-3 px-4 rounded-xl font-semibold text-white bg-amber-500 hover:bg-amber-600 transition-colors flex items-center justify-center gap-2 shadow-md"
              >
                <Check className="w-5 h-5" />
                <span>Lưu</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

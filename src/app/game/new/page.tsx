"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createGame, getAllPlayerNames } from "@/app/actions/game";
import { ChevronLeft, Users, Loader2, ChevronDown, Lock } from "lucide-react";
import Link from "next/link";

function PlayerCombobox({
  index,
  value,
  onChange,
  suggestions,
}: {
  index: number;
  value: string;
  onChange: (value: string) => void;
  suggestions: string[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [filteredNames, setFilteredNames] = useState<string[]>(suggestions);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (value.trim() === "") {
      setFilteredNames(suggestions);
    } else {
      setFilteredNames(
        suggestions.filter((name) =>
          name.toLowerCase().includes(value.toLowerCase())
        )
      );
    }
  }, [value, suggestions]);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={wrapperRef} className="relative">
      <label className="block text-xs font-medium text-slate-500 mb-1 ml-1">
        Người chơi {index + 1}
      </label>
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          placeholder={`Nhập hoặc chọn tên`}
          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 pr-10 text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 transition-all"
          required
        />
        {suggestions.length > 0 && (
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
          </button>
        )}
      </div>

      {/* Dropdown */}
      {isOpen && filteredNames.length > 0 && (
        <div className="absolute z-30 w-full mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-40 overflow-y-auto animate-in fade-in slide-in-from-top-1 duration-150">
          {filteredNames.map((name) => (
            <button
              key={name}
              type="button"
              onClick={() => {
                onChange(name);
                setIsOpen(false);
              }}
              className={`w-full text-left px-4 py-2.5 text-sm hover:bg-sky-50 transition-colors first:rounded-t-xl last:rounded-b-xl ${
                value === name ? "bg-sky-50 text-sky-700 font-semibold" : "text-slate-700"
              }`}
            >
              {name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function NewGamePage() {
  const router = useRouter();
  const [players, setPlayers] = useState(["", "", "", ""]);
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [allNames, setAllNames] = useState<string[]>([]);

  // Lấy danh sách tên có sẵn từ database
  useEffect(() => {
    getAllPlayerNames().then(setAllNames).catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (players.some((p) => p.trim() === "")) {
      setError("Vui lòng nhập đầy đủ tên 4 người chơi");
      return;
    }

    setIsLoading(true);
    try {
      const gameId = await createGame(players, password || undefined);
      // Người tạo game tự động là nhà cái
      sessionStorage.setItem(`game_role_${gameId}`, "host");
      router.push(`/game/${gameId}`);
    } catch (err: any) {
      setError(err.message || "Đã xảy ra lỗi");
      setIsLoading(false);
    }
  };

  const updatePlayer = (index: number, value: string) => {
    const newPlayers = [...players];
    newPlayers[index] = value;
    setPlayers(newPlayers);
  };

  // Lọc tên gợi ý: bỏ những tên đã được chọn bởi slot khác
  const getSuggestionsForSlot = (index: number) => {
    const otherSelected = players.filter((_, i) => i !== index && _.trim() !== "");
    return allNames.filter((name) => !otherSelected.includes(name));
  };

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <header className="px-4 pt-12 pb-4 bg-white border-b border-slate-200 flex items-center shadow-sm">
        <Link href="/" className="p-2 -ml-2 text-slate-500 hover:text-slate-900 active:scale-95 transition-transform">
          <ChevronLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-xl font-bold text-slate-900 ml-2">Tạo bàn mới</h1>
      </header>

      <main className="flex-1 p-6 overflow-y-auto">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
          <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
            <div className="w-10 h-10 bg-sky-100 text-sky-600 rounded-full flex items-center justify-center">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-semibold text-slate-800">Người chơi</h2>
              <p className="text-xs text-slate-500">Chọn hoặc nhập tên 4 người tham gia</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {players.map((player, index) => (
              <PlayerCombobox
                key={index}
                index={index}
                value={player}
                onChange={(val) => updatePlayer(index, val)}
                suggestions={getSuggestionsForSlot(index)}
              />
            ))}

            {/* Password Section */}
            <div className="mt-6 pt-5 border-t border-slate-100">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-slate-800">Mật khẩu phòng</h3>
                  <p className="text-[11px] text-slate-500">Không bắt buộc · Chỉ nhà cái mới cần nhập</p>
                </div>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu (tùy chọn)"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all"
              />
            </div>

            {error && <p className="text-red-500 text-sm mt-2 px-1">{error}</p>}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full mt-8 bg-sky-500 hover:bg-sky-600 active:bg-sky-700 disabled:bg-slate-300 text-white font-semibold py-4 px-6 rounded-xl shadow-md shadow-sky-500/20 flex items-center justify-center gap-2 transition-all"
            >
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>Bắt đầu chơi</span>}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

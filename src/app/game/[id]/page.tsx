import { supabase } from "@/lib/supabase";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Info } from "lucide-react";
import ScoreForm from "./ScoreForm";
import EndGameButton from "./EndGameButton";

export const runtime = "edge";

export default async function GamePage({ 
  params, 
  searchParams 
}: { 
  params: Promise<{ id: string }>;
  searchParams: Promise<{ view_scores?: string }>;
}) {
  const resolvedParams = await params;
  const gameId = resolvedParams.id;
  const resolvedSearchParams = await searchParams;
  const isViewMode = resolvedSearchParams.view_scores === "true";

  const { data: game, error: gameError } = await supabase
    .from("games")
    .select("*, players(*)")
    .eq("id", gameId)
    .single();

  if (gameError || !game) return notFound();

  // Nếu game đã kết thúc và không ở chế độ xem điểm, chuyển hướng sang trang kết quả
  if (game.status === "finished" && !isViewMode) {
    redirect(`/game/${gameId}/result`);
  }

  // Sắp xếp người chơi theo thứ tự tạo
  const players = [...game.players].sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );

  // Sắp xếp rounds theo round_number
  const rounds = [...(game.rounds || [])].sort((a, b) => a.round_number - b.round_number);

  // Tính tổng điểm hiện tại
  const totalScores: Record<string, number> = {};
  players.forEach((p) => (totalScores[p.id] = 0));

  rounds.forEach((round) => {
    Object.keys(round.scores).forEach((pid) => {
      totalScores[pid] += round.scores[pid];
    });
  });

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <header className="px-4 py-4 bg-white border-b border-slate-200 flex items-center justify-between shadow-sm sticky top-0 z-20">
        <div className="flex items-center">
          <Link href={game.status === "finished" ? `/game/${gameId}/result` : "/"} className="p-2 -ml-2 text-slate-500 hover:text-slate-900">
            <ChevronLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-lg font-bold text-slate-900 ml-1">Bảng Điểm</h1>
        </div>
        {game.status === "finished" ? (
          <Link href={`/game/${gameId}/result`} className="text-xs font-bold text-sky-600 bg-sky-50 px-3 py-1.5 rounded-full hover:bg-sky-100 transition-colors">
            Xem kết quả
          </Link>
        ) : (
          <EndGameButton gameId={gameId} />
        )}
      </header>

      <main className="flex-1 overflow-y-auto pb-[200px]">
        {/* Table Header */}
        <div className="sticky top-0 bg-slate-100 border-b border-slate-200 grid grid-cols-5 py-3 shadow-sm z-10">
          <div className="text-center font-semibold text-[10px] text-slate-500 uppercase col-span-1 border-r border-slate-200 flex flex-col items-center justify-center">
            Ván
          </div>
          {players.map((p) => (
            <div key={p.id} className="text-center font-bold text-xs text-slate-800 line-clamp-1 px-1">
              {p.name}
              <div className={`text-[10px] mt-1 ${totalScores[p.id] > 0 ? "text-emerald-600" : totalScores[p.id] < 0 ? "text-red-600" : "text-slate-500"}`}>
                {totalScores[p.id] > 0 ? "+" : ""}{totalScores[p.id]}
              </div>
            </div>
          ))}
        </div>

        {/* Rounds List */}
        <div className="divide-y divide-slate-100 bg-white">
          {rounds.map((round) => (
            <div key={round.id} className="grid grid-cols-5 py-3 items-center hover:bg-slate-50 transition-colors">
              <div className="text-center font-medium text-xs text-slate-500 col-span-1 border-r border-slate-100">
                {round.round_number}
              </div>
              {players.map((p) => {
                const score = round.scores[p.id] || 0;
                return (
                  <div
                    key={p.id}
                    className={`text-center font-semibold text-sm ${
                      score > 0 ? "text-emerald-600" : score < 0 ? "text-red-600" : "text-slate-400"
                    }`}
                  >
                    {score > 0 ? `+${score}` : score}
                  </div>
                );
              })}
            </div>
          ))}

          {rounds.length === 0 && (
            <div className="py-12 flex flex-col items-center justify-center text-slate-400">
              <Info className="w-8 h-8 mb-2 opacity-50" />
              <p className="text-sm">Chưa có ván nào được ghi</p>
            </div>
          )}
        </div>
      </main>

      {/* Fixed Bottom Form (chỉ hiện khi game chưa kết thúc) */}
      {game.status !== "finished" && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 p-4 pb-[env(safe-area-inset-bottom)] shadow-[0_-10px_20px_-10px_rgba(0,0,0,0.1)] z-20 w-full max-w-md mx-auto">
          <ScoreForm
            gameId={gameId}
            players={players}
            nextRoundNumber={rounds.length > 0 ? rounds[rounds.length - 1].round_number + 1 : 1}
          />
        </div>
      )}
    </div>
  );
}

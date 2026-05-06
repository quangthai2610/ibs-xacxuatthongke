import { supabase } from "@/lib/supabase";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Trophy, Receipt, Home } from "lucide-react";
import UpdateBillButton from "./UpdateBillButton";


export default async function ResultPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  const gameId = resolvedParams.id;

  const { data: game, error: gameError } = await supabase
    .from("games")
    .select("*, players(*), debts(*)")
    .eq("id", gameId)
    .single();

  if (gameError || !game) return notFound();

  if (game.status !== "finished") {
    redirect(`/game/${gameId}`);
  }

  // Sắp xếp người chơi theo rank (1 -> 4)
  const rankedPlayers = [...game.players].sort((a, b) => (a.final_rank || 0) - (b.final_rank || 0));

  // Lấy tổng điểm
  const totalScores: Record<string, number> = {};
  game.players.forEach((p: any) => (totalScores[p.id] = 0));
  (game.rounds || []).forEach((round: any) => {
    Object.keys(round.scores).forEach((pid) => {
      totalScores[pid] += round.scores[pid];
    });
  });

  const hasBill = Number(game.total_bill_amount) > 0;

  return (
    <div className="flex flex-col h-full bg-slate-50">
      <header className="px-4 py-4 bg-white border-b border-slate-200 flex items-center shadow-sm z-20">
        <Link href="/" className="p-2 -ml-2 text-slate-500 hover:text-slate-900">
          <ChevronLeft className="w-6 h-6" />
        </Link>
        <h1 className="text-lg font-bold text-slate-900 ml-1">Kết quả chung cuộc</h1>
      </header>

      <main className="flex-1 p-6 overflow-y-auto pb-24">
        {/* Banner Tổng kết */}
        {hasBill ? (
          <div className="bg-gradient-to-br from-sky-500 to-indigo-600 rounded-3xl p-6 text-white shadow-lg mb-8 relative overflow-hidden">
            <div className="absolute -right-6 -top-6 text-white/10">
              <Trophy className="w-32 h-32" />
            </div>
            <div className="relative z-10">
              <h2 className="text-sky-100 font-medium mb-1">Tổng hóa đơn</h2>
              <div className="text-4xl font-black tracking-tight mb-4">
                {Number(game.total_bill_amount).toLocaleString("vi-VN")} đ
              </div>

              <div className="flex flex-col gap-2">
                {game.debts.map((debt: any) => {
                  const player = game.players.find((p: any) => p.id === debt.player_id);
                  return (
                    <div key={debt.id} className="flex justify-between items-center bg-white/20 px-4 py-2 rounded-xl backdrop-blur-md">
                      <span className="font-semibold">{player?.name} trả:</span>
                      <span className="font-bold">{Number(debt.amount).toLocaleString("vi-VN")} đ</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-3xl p-6 shadow-sm border border-amber-200 mb-8">
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center mb-3">
                <Receipt className="w-7 h-7 text-amber-600" />
              </div>
              <h2 className="font-bold text-slate-800 text-lg mb-1">Chưa có hóa đơn</h2>
              <p className="text-sm text-slate-500 mb-4">Bổ sung hóa đơn để tính tiền cho hạng 3 và hạng 4</p>
              <UpdateBillButton gameId={gameId} />
            </div>
          </div>
        )}

        {/* Bảng xếp hạng */}
        <h3 className="font-bold text-slate-800 text-lg mb-4 ml-1">Bảng xếp hạng</h3>
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 divide-y divide-slate-100">
          {rankedPlayers.map((player) => {
            const rank = player.final_rank;
            const score = totalScores[player.id];

            let rankColor = "bg-slate-100 text-slate-500";
            if (rank === 1) rankColor = "bg-amber-100 text-amber-600";
            else if (rank === 2) rankColor = "bg-slate-200 text-slate-600";
            else if (rank === 3) rankColor = "bg-orange-100 text-orange-600";
            else if (rank === 4) rankColor = "bg-red-100 text-red-600";

            return (
              <div key={player.id} className="p-4 flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-black ${rankColor} shrink-0`}>
                  #{rank}
                </div>
                <div className="flex-1 flex items-center gap-2">
                  <h4 className="font-bold text-slate-800 text-lg">{player.name}</h4>
                  {rank === 1 && <Trophy className="w-5 h-5 text-yellow-500 fill-yellow-500" />}
                </div>
                <div className={`font-bold text-lg ${score > 0 ? "text-emerald-500" : score < 0 ? "text-red-500" : "text-slate-400"}`}>
                  {score > 0 ? `+${score}` : score}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 flex flex-col gap-3">
          <Link
            href={`/game/${gameId}?view_scores=true`}
            className="w-full bg-sky-50 hover:bg-sky-100 active:bg-sky-200 text-sky-600 font-bold py-4 px-6 rounded-xl border border-sky-200 flex items-center justify-center gap-2 transition-all"
          >
            <Receipt className="w-5 h-5" />
            <span>Xem lại bảng điểm</span>
          </Link>
          <Link
            href="/"
            className="w-full bg-slate-900 hover:bg-slate-800 active:bg-slate-950 text-white font-semibold py-4 px-6 rounded-xl shadow-md flex items-center justify-center gap-2 transition-all"
          >
            <Home className="w-5 h-5" />
            <span>Về Sảnh</span>
          </Link>
        </div>
      </main>
    </div>
  );
}


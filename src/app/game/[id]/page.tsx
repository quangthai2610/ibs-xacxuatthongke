import { supabase } from "@/lib/supabase";
import { notFound, redirect } from "next/navigation";
import RealtimeSubscription from "@/components/RealtimeSubscription";
import GameClientPage from "./GameClientPage";


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

  // Sắp xếp rounds theo round_number (mới nhất lên trên)
  const rounds = [...(game.rounds || [])].sort((a, b) => b.round_number - a.round_number);

  // Tính tổng điểm hiện tại
  const totalScores: Record<string, number> = {};
  players.forEach((p) => (totalScores[p.id] = 0));

  rounds.forEach((round) => {
    Object.keys(round.scores).forEach((pid) => {
      totalScores[pid] += round.scores[pid];
    });
  });

  const hasPassword = !!game.password;
  const isFinished = game.status === "finished";

  return (
    <>
      <RealtimeSubscription table="games" filter={`id=eq.${gameId}`} />
      <GameClientPage
        gameId={gameId}
        players={players}
        rounds={rounds}
        totalScores={totalScores}
        isFinished={isFinished}
        hasPassword={hasPassword}
        nextRoundNumber={rounds.length > 0 ? rounds[0].round_number + 1 : 1}
      />
    </>
  );
}

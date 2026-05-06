"use server";

export const runtime = "edge";
import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function createGame(playerNames: string[]) {
  if (playerNames.length !== 4) throw new Error("Cần đúng 4 người chơi");

  // Tạo game mới
  const { data: game, error: gameError } = await supabase
    .from("games")
    .insert([{ status: "active" }])
    .select()
    .single();

  if (gameError || !game) throw new Error("Lỗi tạo game");

  // Tạo 4 players
  const playersToInsert = playerNames.map((name) => ({
    game_id: game.id,
    name,
  }));

  const { error: playersError } = await supabase
    .from("players")
    .insert(playersToInsert);

  if (playersError) throw new Error("Lỗi tạo người chơi");

  revalidatePath("/");
  return game.id;
}

export async function getActiveGames() {
  const { data, error } = await supabase
    .from("games")
    .select(`
      id, created_at, status, total_bill_amount,
      players (id, name)
    `)
    .eq("status", "active")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Lỗi lấy danh sách game:", error);
    return [];
  }
  return data;
}

export async function addRound(gameId: string, roundNumber: number, scores: Record<string, number>) {
  // Lấy danh sách rounds hiện tại
  const { data: game, error: fetchError } = await supabase
    .from("games")
    .select("rounds")
    .eq("id", gameId)
    .single();

  if (fetchError || !game) throw new Error("Lỗi tìm game");

  const currentRounds = game.rounds || [];
  const newRounds = [
    ...currentRounds,
    { id: crypto.randomUUID(), round_number: roundNumber, scores },
  ];

  const { error: updateError } = await supabase
    .from("games")
    .update({ rounds: newRounds })
    .eq("id", gameId);

  if (updateError) throw new Error("Lỗi lưu điểm ván");
  revalidatePath(`/game/${gameId}`);
}

export async function endGame(gameId: string, totalBill: number) {
  // 1. Fetch game (chứa mảng rounds) và players
  const { data: players } = await supabase.from("players").select("*").eq("game_id", gameId);
  const { data: game } = await supabase.from("games").select("rounds").eq("id", gameId).single();

  if (!players || !game) throw new Error("Không tìm thấy dữ liệu game");
  
  const rounds = game.rounds || [];

  // 2. Tính tổng điểm
  const totalScores: Record<string, number> = {};
  players.forEach((p) => (totalScores[p.id] = 0));

  rounds.forEach((round: any) => {
    Object.keys(round.scores).forEach((playerId) => {
      totalScores[playerId] += round.scores[playerId];
    });
  });

  // 3. Xếp hạng (điểm cao nhất -> hạng 1)
  const rankedPlayers = players
    .map((p) => ({ ...p, score: totalScores[p.id] }))
    .sort((a, b) => b.score - a.score);

  const rank3Player = rankedPlayers[2];
  const rank4Player = rankedPlayers[3];

  const rank3Debt = Math.round(totalBill / 2);
  const rank4Debt = totalBill - rank3Debt;

  // 4. Cập nhật trạng thái game
  await supabase
    .from("games")
    .update({ status: "finished", total_bill_amount: totalBill })
    .eq("id", gameId);

  // 5. Cập nhật rank cho người chơi
  for (let i = 0; i < rankedPlayers.length; i++) {
    await supabase.from("players").update({ final_rank: i + 1 }).eq("id", rankedPlayers[i].id);
  }

  // 6. Ghi nhận nợ
  await supabase.from("debts").insert([
    { game_id: gameId, player_id: rank3Player.id, amount: rank3Debt },
    { game_id: gameId, player_id: rank4Player.id, amount: rank4Debt },
  ]);

  revalidatePath(`/game/${gameId}`);
  revalidatePath(`/history`);
  revalidatePath(`/leaderboard`);
  revalidatePath(`/`);
}

export async function getFinishedGames(timeFilter: "all" | "week" | "month" = "all") {
  let query = supabase
    .from("games")
    .select(`
      id, created_at, status, total_bill_amount,
      players (id, name, final_rank)
    `)
    .eq("status", "finished")
    .order("created_at", { ascending: false });

  if (timeFilter === "week") {
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);
    query = query.gte("created_at", lastWeek.toISOString());
  } else if (timeFilter === "month") {
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    query = query.gte("created_at", lastMonth.toISOString());
  }

  const { data, error } = await query;
  if (error) {
    console.error("Lỗi lấy lịch sử:", error);
    return [];
  }
  return data;
}

export async function getLeaderboard(timePeriod: "all" | "week" | "month" = "all") {
  const { data, error } = await supabase.rpc("get_leaderboard", { time_period: timePeriod });
  if (error) {
    console.error("Lỗi lấy bảng xếp hạng:", error);
    return [];
  }
  return data as { name: string; total_debt: number }[];
}

export async function getRankStats(timePeriod: "all" | "week" | "month" = "all") {
  let query = supabase
    .from("players")
    .select("name, final_rank, games!inner(created_at, status)")
    .eq("games.status", "finished");

  if (timePeriod === "week") {
    const lastWeek = new Date();
    lastWeek.setDate(lastWeek.getDate() - 7);
    query = query.gte("games.created_at", lastWeek.toISOString());
  } else if (timePeriod === "month") {
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    query = query.gte("games.created_at", lastMonth.toISOString());
  }

  const { data, error } = await query;
  if (error) {
    console.error("Lỗi lấy thống kê hạng:", error);
    return [];
  }

  // Gom nhóm thống kê
  const stats: Record<string, { name: string; rank1: number; rank2: number; rank3: number; rank4: number; total: number }> = {};
  
  (data || []).forEach((p: any) => {
    // Chỉ tính những người chơi có final_rank (game đã finished)
    if (!p.final_rank) return;
    
    if (!stats[p.name]) {
      stats[p.name] = { name: p.name, rank1: 0, rank2: 0, rank3: 0, rank4: 0, total: 0 };
    }
    stats[p.name].total += 1;
    if (p.final_rank === 1) stats[p.name].rank1 += 1;
    if (p.final_rank === 2) stats[p.name].rank2 += 1;
    if (p.final_rank === 3) stats[p.name].rank3 += 1;
    if (p.final_rank === 4) stats[p.name].rank4 += 1;
  });

  // Sắp xếp theo số lần nhất -> nhì -> ba -> bét
  return Object.values(stats).sort((a, b) => {
    if (b.rank1 !== a.rank1) return b.rank1 - a.rank1;
    if (b.rank2 !== a.rank2) return b.rank2 - a.rank2;
    if (b.rank3 !== a.rank3) return b.rank3 - a.rank3;
    return b.rank4 - a.rank4;
  });
}

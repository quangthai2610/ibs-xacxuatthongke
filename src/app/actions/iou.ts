"use server";

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export interface IOURecord {
  id: string;
  debtor_name: string;
  creditor_name: string;
  amount: number;
  note: string | null;
  game_id: string | null;
  created_at: string;
}

/**
 * Lưu 1 khoản nợ mới.
 */
export async function addIOU(
  debtorName: string,
  creditorName: string,
  amount: number,
  note?: string,
  gameId?: string
) {
  if (amount <= 0) throw new Error("Số tiền phải lớn hơn 0");
  if (!debtorName.trim() || !creditorName.trim()) throw new Error("Thiếu tên người chơi");

  const { error } = await supabase.from("ious").insert([
    {
      debtor_name: debtorName.trim(),
      creditor_name: creditorName.trim(),
      amount,
      note: note?.trim() || null,
      game_id: gameId || null,
    },
  ]);

  if (error) {
    console.error("Lỗi lưu nợ:", error);
    throw new Error("Lỗi lưu nợ");
  }

  revalidatePath("/leaderboard");
}

/**
 * Lấy ma trận nợ: gom nhóm theo (debtor, creditor) → tổng amount.
 * Trả về danh sách tên + ma trận.
 */
export async function getIOUMatrix(): Promise<{
  names: string[];
  matrix: Record<string, Record<string, number>>;
}> {
  const { data, error } = await supabase
    .from("ious")
    .select("debtor_name, creditor_name, amount");

  if (error) {
    console.error("Lỗi lấy ma trận nợ:", error);
    return { names: [], matrix: {} };
  }

  // Gom nhóm
  const matrix: Record<string, Record<string, number>> = {};
  const namesSet = new Set<string>();

  (data || []).forEach((row) => {
    namesSet.add(row.debtor_name);
    namesSet.add(row.creditor_name);

    if (!matrix[row.debtor_name]) matrix[row.debtor_name] = {};
    matrix[row.debtor_name][row.creditor_name] =
      (matrix[row.debtor_name][row.creditor_name] || 0) + row.amount;
  });

  const names = [...namesSet].sort();
  return { names, matrix };
}

/**
 * Lấy danh sách chi tiết các khoản nợ giữa 2 người.
 */
export async function getIOUsBetween(
  debtorName: string,
  creditorName: string
): Promise<IOURecord[]> {
  const { data, error } = await supabase
    .from("ious")
    .select("*")
    .eq("debtor_name", debtorName)
    .eq("creditor_name", creditorName)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Lỗi lấy chi tiết nợ:", error);
    return [];
  }

  return data || [];
}

/**
 * Sửa số tiền 1 khoản nợ.
 */
export async function updateIOU(id: string, newAmount: number) {
  if (newAmount <= 0) throw new Error("Số tiền phải lớn hơn 0");

  const { error } = await supabase
    .from("ious")
    .update({ amount: newAmount })
    .eq("id", id);

  if (error) {
    console.error("Lỗi sửa nợ:", error);
    throw new Error("Lỗi sửa nợ");
  }

  revalidatePath("/leaderboard");
}

/**
 * Xoá 1 khoản nợ.
 */
export async function deleteIOU(id: string) {
  const { error } = await supabase.from("ious").delete().eq("id", id);

  if (error) {
    console.error("Lỗi xoá nợ:", error);
    throw new Error("Lỗi xoá nợ");
  }

  revalidatePath("/leaderboard");
}

/**
 * Kiểm tra xem đã lưu nợ cho game + debtor + creditor chưa.
 */
export async function checkIOUExists(
  gameId: string,
  debtorName: string,
  creditorName: string
): Promise<boolean> {
  const { data, error } = await supabase
    .from("ious")
    .select("id")
    .eq("game_id", gameId)
    .eq("debtor_name", debtorName)
    .eq("creditor_name", creditorName)
    .limit(1);

  if (error) return false;
  return (data || []).length > 0;
}

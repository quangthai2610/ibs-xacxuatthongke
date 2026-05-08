"use server";

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import type { SavedBankAccount } from "@/hooks/useBankAccounts";

export async function getBankAccounts(): Promise<SavedBankAccount[]> {
  const { data, error } = await supabase
    .from("bank_accounts")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Lỗi lấy danh sách tài khoản:", error);
    return [];
  }

  return data.map((row) => ({
    id: row.id,
    bin: row.bin,
    shortName: row.short_name,
    accountNo: row.account_no,
    accountName: row.account_name,
    label: row.label,
  }));
}

export async function addBankAccount(account: Omit<SavedBankAccount, "id">) {
  const { error } = await supabase.from("bank_accounts").insert([
    {
      bin: account.bin,
      short_name: account.shortName,
      account_no: account.accountNo,
      account_name: account.accountName,
      label: account.label,
    },
  ]);

  if (error) {
    console.error("Lỗi thêm tài khoản:", error);
    throw new Error("Lỗi thêm tài khoản");
  }

  // Revalidate các path có sử dụng thông tin bank
  revalidatePath("/");
  revalidatePath("/game/[id]/result", "page");
}

export async function updateBankAccount(id: string, account: Partial<SavedBankAccount>) {
  const updates: any = {};
  if (account.bin !== undefined) updates.bin = account.bin;
  if (account.shortName !== undefined) updates.short_name = account.shortName;
  if (account.accountNo !== undefined) updates.account_no = account.accountNo;
  if (account.accountName !== undefined) updates.account_name = account.accountName;
  if (account.label !== undefined) updates.label = account.label;

  const { error } = await supabase
    .from("bank_accounts")
    .update(updates)
    .eq("id", id);

  if (error) {
    console.error("Lỗi cập nhật tài khoản:", error);
    throw new Error("Lỗi cập nhật tài khoản");
  }

  revalidatePath("/");
  revalidatePath("/game/[id]/result", "page");
}

export async function deleteBankAccount(id: string) {
  const { error } = await supabase
    .from("bank_accounts")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Lỗi xóa tài khoản:", error);
    throw new Error("Lỗi xóa tài khoản");
  }

  revalidatePath("/");
  revalidatePath("/game/[id]/result", "page");
}

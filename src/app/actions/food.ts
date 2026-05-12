"use server";

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export interface FoodOrder {
  id: string;
  user_name: string;
  food_name: string;
  created_at: string;
}

export async function addFoodOrder(userName: string, foodName: string) {
  if (!userName.trim() || !foodName.trim()) {
    throw new Error("Vui lòng nhập đầy đủ tên và món ăn");
  }

  const { error } = await supabase.from("food_orders").insert([
    {
      user_name: userName.trim(),
      food_name: foodName.trim(),
    },
  ]);

  if (error) {
    console.error("Lỗi lưu order:", error);
    throw new Error("Không thể lưu order");
  }

  revalidatePath("/food");
}

export async function getFoodOrders(): Promise<FoodOrder[]> {
  const { data, error } = await supabase
    .from("food_orders")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Lỗi lấy danh sách order:", error);
    return [];
  }

  return data || [];
}

export async function updateFoodOrder(id: string, userName: string, foodName: string) {
  if (!userName.trim() || !foodName.trim()) {
    throw new Error("Vui lòng nhập đầy đủ tên và món ăn");
  }

  const { error } = await supabase
    .from("food_orders")
    .update({ user_name: userName.trim(), food_name: foodName.trim() })
    .eq("id", id);

  if (error) {
    console.error("Lỗi sửa order:", error);
    throw new Error("Không thể cập nhật order");
  }

  revalidatePath("/food");
}

export async function deleteFoodOrder(id: string) {
  const { error } = await supabase.from("food_orders").delete().eq("id", id);

  if (error) {
    console.error("Lỗi xoá order:", error);
    throw new Error("Không thể xoá order");
  }

  revalidatePath("/food");
}

import { Suspense } from "react";
import { getFoodOrders } from "@/app/actions/food";
import { getAllPlayerNames } from "@/app/actions/game";
import FoodPageClient from "./FoodPageClient";

// Force dynamic rendering if necessary, but we are using server actions and revalidation
export const dynamic = 'force-dynamic';

export default async function FoodPage() {
  const [orders, players] = await Promise.all([
    getFoodOrders(),
    getAllPlayerNames()
  ]);

  return (
    <div className="flex-1 flex flex-col relative h-[100dvh] overflow-hidden bg-slate-50">
      <div className="bg-sky-500 text-white p-4 pt-10 pb-6 rounded-b-3xl shadow-lg relative z-10 shrink-0">
        <h1 className="text-2xl font-black text-center tracking-tight">Thực Đơn Hôm Nay</h1>
        <p className="text-sky-100 text-center text-sm mt-1">Đừng để bụng đói nhé!</p>
      </div>
      
      <div className="flex-1 overflow-y-auto px-4 py-6 pb-24">
        <Suspense fallback={<div className="text-center text-slate-500 mt-10">Đang tải danh sách...</div>}>
          <FoodPageClient initialOrders={orders} players={players} />
        </Suspense>
      </div>
    </div>
  );
}

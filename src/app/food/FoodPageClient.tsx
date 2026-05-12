"use client";

import { useState } from "react";
import { Plus, Edit2, Trash2 } from "lucide-react";
import { FoodOrder, addFoodOrder, updateFoodOrder, deleteFoodOrder } from "@/app/actions/food";
import FoodOrderModal from "./FoodOrderModal";

interface FoodPageClientProps {
  initialOrders: FoodOrder[];
  players: string[];
}

export default function FoodPageClient({ initialOrders, players }: FoodPageClientProps) {
  const [orders, setOrders] = useState<FoodOrder[]>(initialOrders);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<FoodOrder | null>(null);

  // Nhóm theo ngày (YYYY-MM-DD)
  const groupedOrders = orders.reduce((acc, order) => {
    // Chuyển UTC string thành local date string đơn giản
    const dateObj = new Date(order.created_at);
    const dateStr = dateObj.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
    if (!acc[dateStr]) acc[dateStr] = [];
    acc[dateStr].push(order);
    return acc;
  }, {} as Record<string, FoodOrder[]>);

  // Lấy các ngày có order và sắp xếp mới nhất lên đầu
  // Vì ta đang format DD/MM/YYYY nên sort theo string cần convert lại hoặc ta có thể sort lúc ban đầu rồi map.
  // Thực tế initialOrders đã được sort từ DB rồi. Nên Object.keys(groupedOrders) có thể chưa đúng thứ tự.
  // Ta lấy unique date string dựa theo initialOrders để giữ nguyên order
  const orderedDates = Array.from(
    new Set(
      orders.map(order => 
        new Date(order.created_at).toLocaleDateString("vi-VN", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric"
        })
      )
    )
  );

  const handleAdd = async (userName: string, foodName: string) => {
    await addFoodOrder(userName, foodName);
    // Reload trang bằng cách window.location.reload hoặc dựa vào revalidatePath server side
    // Nhưng vì ta muốn UI mượt, ta có thể tự mutate local, tuy nhiên revalidatePath đã handle việc update dữ liệu khi gọi server action từ form
    // Vì đây là custom onClick, ta có thể tự reload hoặc dùng useRouter().refresh()
    window.location.reload();
  };

  const handleUpdate = async (userName: string, foodName: string) => {
    if (!editingOrder) return;
    await updateFoodOrder(editingOrder.id, userName, foodName);
    window.location.reload();
  };

  const handleDelete = async (id: string) => {
    if (confirm("Bạn có chắc chắn muốn xoá order này?")) {
      await deleteFoodOrder(id);
      window.location.reload();
    }
  };

  const openEditModal = (order: FoodOrder) => {
    setEditingOrder(order);
    setIsModalOpen(true);
  };

  const openAddModal = () => {
    setEditingOrder(null);
    setIsModalOpen(true);
  };

  return (
    <>
      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center mt-12 bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
          <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
            <span className="text-3xl">🍽️</span>
          </div>
          <p className="text-slate-500 mb-2">Chưa có ai gọi món cả</p>
          <button 
            onClick={openAddModal}
            className="px-6 py-3 bg-sky-500 hover:bg-sky-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors mt-2"
          >
            <Plus className="w-5 h-5" /> Mở bát ngay!
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <button 
            onClick={openAddModal}
            className="w-full py-4 bg-sky-500 hover:bg-sky-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 transition-colors active:scale-[0.98] shadow-sm mb-6"
          >
            <Plus className="w-5 h-5" /> Đặt Cơm Ngay
          </button>
          
          {orderedDates.map(dateStr => (
            <div key={dateStr} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="bg-slate-50 px-4 py-3 border-b border-slate-100">
                <h3 className="font-bold text-slate-700">{dateStr}</h3>
              </div>
              <ul className="divide-y divide-slate-50">
                {groupedOrders[dateStr].map(order => (
                  <li key={order.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between group">
                    <div>
                      <div className="font-bold text-slate-900">{order.user_name}</div>
                      <div className="text-sm text-slate-500">{order.food_name}</div>
                    </div>
                    <div className="flex items-center gap-1 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => openEditModal(order)}
                        className="p-2 text-slate-400 hover:text-sky-500 hover:bg-sky-50 rounded-lg transition-colors"
                        aria-label="Sửa"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(order.id)}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        aria-label="Xoá"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}

      {/* Floating Action Button (Optional now since we have big button, but keeping it is fine, or we can remove it) */}
      {/* We'll remove the FAB to avoid duplication since we have a prominent button now */}

      {isModalOpen && (
        <FoodOrderModal
          players={players}
          onClose={() => setIsModalOpen(false)}
          onSubmit={editingOrder ? handleUpdate : handleAdd}
          isEditing={!!editingOrder}
          initialUserName={editingOrder?.user_name}
          initialFoodName={editingOrder?.food_name}
        />
      )}
    </>
  );
}

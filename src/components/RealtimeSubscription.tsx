"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function RealtimeSubscription({ 
  table = "games", 
  filter, 
  onRefresh 
}: { 
  table?: string;
  filter?: string;
  onRefresh?: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    // Kênh realtime
    const channel = supabase
      .channel(`realtime-${table}-${filter || 'all'}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: table,
          filter: filter, // Ví dụ: "id=eq.123"
        },
        () => {
          // Bất cứ khi nào có thay đổi, trigger refresh trang hiện tại
          if (onRefresh) {
            onRefresh();
          } else {
            router.refresh();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [router, table, filter, onRefresh]);

  return null;
}

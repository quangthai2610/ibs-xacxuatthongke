"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, History, Trophy } from "lucide-react";
import { clsx } from "clsx";

export function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { name: "Sảnh", href: "/", icon: Home },
    { name: "Lịch sử", href: "/history", icon: History },
    { name: "Xếp hạng", href: "/leaderboard", icon: Trophy },
  ];

  // Nếu đang ở màn hình ghi điểm (ví dụ: /game/123), có thể ẩn Bottom Nav hoặc giữ nguyên tuỳ thiết kế.
  // Ở đây chúng ta giữ nguyên cho dễ điều hướng, hoặc ẩn nếu đang trong game.
  const isGamePage = pathname?.startsWith("/game/");
  if (isGamePage) return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-200 pb-safe">
      <div className="max-w-md mx-auto flex justify-between px-6 py-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={clsx(
                "flex flex-col items-center justify-center w-16 gap-1 p-2 transition-colors",
                isActive ? "text-sky-500" : "text-slate-500 hover:text-slate-900"
              )}
            >
              <item.icon className={clsx("w-6 h-6", isActive && "fill-sky-50")} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-medium">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

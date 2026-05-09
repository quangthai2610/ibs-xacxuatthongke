import { getLeaderboard, getRankStats } from "@/app/actions/game";
import Link from "next/link";
import { Trophy, TrendingUp, Medal, HandCoins } from "lucide-react";
import clsx from "clsx";
import LeaderboardChart from "./LeaderboardChart";
import DebtMatrixTable from "./DebtMatrixTable";


export default async function LeaderboardPage({
  searchParams,
}: {
  searchParams: Promise<{ filter?: string; type?: string }>;
}) {
  const resolvedSearchParams = await searchParams;
  const filter = (resolvedSearchParams.filter as "all" | "week" | "month") || "all";
  const type = (resolvedSearchParams.type as "debt" | "rank" | "iou") || "debt";

  const leaderboardData = await getLeaderboard(filter);
  const rankStatsData = await getRankStats(filter);

  const filters = [
    { id: "all", label: "Tất cả" },
    { id: "week", label: "Tuần này" },
    { id: "month", label: "Tháng này" },
  ];

  return (
    <div className="flex flex-col h-dvh bg-slate-50">
      <header className="px-6 pt-12 pb-4 bg-white border-b border-slate-200 z-10 shadow-sm shrink-0">
        <div className="flex items-center gap-2 mb-4">
          <h1 className="text-2xl font-bold text-slate-900">Bảng xếp hạng</h1>
          <Trophy className="w-6 h-6 text-yellow-500" />
        </div>

        {/* Type Tabs */}
        <div className="flex bg-slate-100 p-1 rounded-xl mb-3">
          <Link
            href={`/leaderboard?type=debt&filter=${filter}`}
            className={clsx(
              "flex-1 flex justify-center items-center gap-1 py-2 text-xs font-medium rounded-lg transition-all",
              type === "debt" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
            )}
          >
            <TrendingUp className="w-3.5 h-3.5" /> Tốn tiền
          </Link>
          <Link
            href={`/leaderboard?type=rank&filter=${filter}`}
            className={clsx(
              "flex-1 flex justify-center items-center gap-1 py-2 text-xs font-medium rounded-lg transition-all",
              type === "rank" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
            )}
          >
            <Medal className="w-3.5 h-3.5" /> Bàn thắng
          </Link>
          <Link
            href={`/leaderboard?type=iou&filter=${filter}`}
            className={clsx(
              "flex-1 flex justify-center items-center gap-1 py-2 text-xs font-medium rounded-lg transition-all",
              type === "iou" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
            )}
          >
            <HandCoins className="w-3.5 h-3.5" /> Nợ
          </Link>
        </div>

        {/* Filter Tabs — ẩn khi tab Nợ */}
        {type !== "iou" && (
          <div className="flex gap-2">
            {filters.map((f) => {
              const isActive = filter === f.id;
              return (
                <Link
                  key={f.id}
                  href={`/leaderboard?type=${type}&filter=${f.id}`}
                  className={clsx(
                    "px-3 py-1 text-xs font-semibold rounded-full border transition-all",
                    isActive ? "bg-slate-800 text-white border-slate-800" : "bg-white text-slate-500 border-slate-200 hover:bg-slate-50"
                  )}
                >
                  {f.label}
                </Link>
              );
            })}
          </div>
        )}
      </header>

      <main className="flex-1 p-6 overflow-y-auto pb-24 min-h-0">
        {type === "iou" ? (
          /* Tab Nợ — Ma trận nợ */
          <DebtMatrixTable />
        ) : type === "debt" ? (
          leaderboardData.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-slate-400">
              <Trophy className="w-10 h-10 mb-2 opacity-30" />
              <p>Chưa có dữ liệu xếp hạng</p>
            </div>
          ) : (
            <>
              {/* Chart Section */}
              <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 mb-6 animate-in fade-in slide-in-from-bottom-2">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="w-5 h-5 text-red-500" />
                  <h3 className="font-bold text-slate-800">Top bạc thủ tốn tiền</h3>
                </div>
                <LeaderboardChart data={leaderboardData} />
              </div>

              {/* List Section */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 divide-y divide-slate-100 overflow-hidden animate-in fade-in slide-in-from-bottom-4">
                {leaderboardData.map((player, index) => {
                  let badgeClass = "bg-slate-100 text-slate-500";
                  if (index === 0) badgeClass = "bg-red-100 text-red-600";
                  else if (index === 1) badgeClass = "bg-orange-100 text-orange-600";
                  else if (index === 2) badgeClass = "bg-amber-100 text-amber-600";

                  return (
                    <div key={player.name} className="p-4 flex items-center gap-4 hover:bg-slate-50 transition-colors">
                      <div className={clsx("w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0", badgeClass)}>
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-slate-800">{player.name}</h4>
                      </div>
                      <div className="font-bold text-red-600">
                        {Number(player.total_debt).toLocaleString("vi-VN")} đ
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )
        ) : (
          rankStatsData.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-40 text-slate-400">
              <Medal className="w-10 h-10 mb-2 opacity-30" />
              <p>Chưa có dữ liệu bàn thắng</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-bottom-2">
              <div className="grid grid-cols-9 gap-1 bg-slate-100 p-2 text-[9px] font-bold text-slate-500 uppercase tracking-tighter text-center">
                <div className="col-span-2 text-left pl-1">Người chơi</div>
                <div className="text-emerald-600">Nhất</div>
                <div className="text-yellow-600">Nhì</div>
                <div className="text-red-600">Ba</div>
                <div>Bét</div>
                <div className="text-emerald-600">Thắng</div>
                <div className="text-red-600">Thua</div>
                <div className="text-sky-600">Tổng</div>
              </div>
              <div className="divide-y divide-slate-100">
                {rankStatsData.map((stat, index) => {
                  const winCount = stat.rank1 + stat.rank2;
                  const loseCount = stat.rank3 + stat.rank4;
                  return (
                    <div key={stat.name} className="grid grid-cols-9 gap-1 p-2 items-center hover:bg-slate-50 transition-colors text-[11px] sm:text-xs text-center">
                      <div className="col-span-2 text-left pl-1 flex items-center gap-1">
                        {index === 0 && <Trophy className="w-3 h-3 text-yellow-500 fill-yellow-500 shrink-0" />}
                        <span className="font-bold text-slate-800 truncate max-w-[50px] sm:max-w-full">{stat.name}</span>
                      </div>
                      <div className="font-bold text-emerald-500">{stat.rank1}</div>
                      <div className="font-semibold text-yellow-500">{stat.rank2}</div>
                      <div className="font-semibold text-red-500">{stat.rank3}</div>
                      <div className="font-semibold text-slate-400">{stat.rank4}</div>
                      <div className="font-bold text-emerald-600 bg-emerald-50 rounded-sm py-0.5">{winCount}</div>
                      <div className="font-bold text-red-600 bg-red-50 rounded-sm py-0.5">{loseCount}</div>
                      <div className="font-bold text-sky-600 bg-sky-50 rounded-sm py-0.5">{stat.total}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )
        )}
      </main>
    </div>
  );
}

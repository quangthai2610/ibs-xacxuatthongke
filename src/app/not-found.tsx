import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 p-6 text-center">
      <div className="text-6xl mb-4">🃏</div>
      <h2 className="text-2xl font-bold text-slate-800 mb-2">Không tìm thấy</h2>
      <p className="text-slate-500 mb-6">Trang bạn tìm không tồn tại.</p>
      <Link
        href="/"
        className="bg-sky-500 hover:bg-sky-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
      >
        Về Sảnh
      </Link>
    </div>
  );
}

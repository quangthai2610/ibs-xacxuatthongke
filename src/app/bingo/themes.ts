export type ThemeKey = "light" | "dark" | "ocean" | "sunset";

export interface BingoTheme {
  key: ThemeKey;
  label: string;
  icon: string;
  // Layout
  bg: string;
  text: string;
  // Header
  headerBg: string;
  headerBorder: string;
  backBtn: string;
  titleGradient: string;
  iconBtn: string;
  prizeActive: string;
  // Prize badge
  prizeBadgeBg: string;
  prizeBadgeBorder: string;
  prizeBadgeIcon: string;
  prizeBadgeText: string;
  // Orb
  orbIdle: string;
  orbIdleText: string;
  // Status
  statusDone: string;
  statusText: string;
  statusBold: string;
  statusDivider: string;
  statusTotal: string;
  countdownText: string;
  // Grid cell (undrawn)
  cellMobile: string;
  cellDesktop: string;
  // Bottom controls
  bottomBar: string;
  spinBtn: string;
  autoBtn: string;
  autoBtnDisabled: string;
  // Desktop controls
  desktopBar: string;
  desktopSpinBtn: string;
  desktopAutoBtn: string;
  // Modal
  modalOverlay: string;
  modalBg: string;
  modalTitle: string;
  modalClose: string;
  modalLabel: string;
  modalInput: string;
  modalArrow: string;
  modalSubText: string;
  modalCancelBtn: string;
  modalSaveBtn: string;
  modalSuffix: string;
}

export const THEMES: Record<ThemeKey, BingoTheme> = {
  light: {
    key: "light",
    label: "Sáng",
    icon: "☀️",
    bg: "bg-gradient-to-br from-slate-50 via-white to-sky-50 text-slate-900",
    text: "text-slate-900",
    headerBg: "bg-white/80 backdrop-blur-sm border-b border-slate-200 shadow-sm",
    headerBorder: "",
    backBtn: "text-slate-400 hover:text-slate-700",
    titleGradient: "from-amber-600 to-orange-500",
    iconBtn: "text-slate-400 hover:text-slate-700",
    prizeActive: "text-amber-600 bg-amber-50",
    prizeBadgeBg: "bg-gradient-to-r from-amber-50 to-orange-50 shadow-sm",
    prizeBadgeBorder: "border-amber-200",
    prizeBadgeIcon: "text-amber-600",
    prizeBadgeText: "text-amber-700",
    orbIdle: "bg-gradient-to-br from-slate-200 to-slate-300 shadow-[0_0_20px_rgba(100,116,139,0.15)]",
    orbIdleText: "text-slate-500",
    statusDone: "text-emerald-600",
    statusText: "text-slate-500",
    statusBold: "text-slate-800",
    statusDivider: "text-slate-300",
    statusTotal: "text-slate-600",
    countdownText: "text-amber-600",
    cellMobile: "bg-white text-slate-700 border border-slate-200 shadow-sm",
    cellDesktop: "bg-white text-slate-700 border border-slate-200 shadow-sm hover:bg-slate-50 hover:border-slate-300",
    bottomBar: "bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]",
    spinBtn: "from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:from-slate-200 disabled:to-slate-300 disabled:text-slate-400",
    autoBtn: "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200",
    autoBtnDisabled: "disabled:bg-slate-100 disabled:text-slate-400 disabled:border-slate-200",
    desktopBar: "bg-white/90 backdrop-blur-lg border border-slate-200 shadow-xl",
    desktopSpinBtn: "from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:from-slate-200 disabled:to-slate-300 disabled:text-slate-400",
    desktopAutoBtn: "bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200",
    modalOverlay: "bg-black/30 backdrop-blur-sm",
    modalBg: "bg-white border-slate-200",
    modalTitle: "text-slate-800",
    modalClose: "text-slate-400 hover:text-slate-700",
    modalLabel: "text-slate-500",
    modalInput: "bg-slate-50 border-slate-200 text-slate-800 focus:ring-amber-500/50 focus:border-amber-500",
    modalArrow: "text-slate-300",
    modalSubText: "text-slate-400",
    modalCancelBtn: "text-slate-600 bg-slate-100 hover:bg-slate-200",
    modalSaveBtn: "text-white bg-amber-500 hover:bg-amber-600 shadow-md",
    modalSuffix: "text-slate-400",
  },
  dark: {
    key: "dark",
    label: "Tối",
    icon: "🌙",
    bg: "bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white",
    text: "text-white",
    headerBg: "bg-slate-950/80 backdrop-blur-sm border-b border-white/10",
    headerBorder: "",
    backBtn: "text-slate-400 hover:text-white",
    titleGradient: "from-amber-400 to-orange-400",
    iconBtn: "text-slate-400 hover:text-white",
    prizeActive: "text-amber-400 bg-amber-400/10",
    prizeBadgeBg: "bg-gradient-to-r from-amber-500/10 to-orange-500/10",
    prizeBadgeBorder: "border-amber-500/20",
    prizeBadgeIcon: "text-amber-400",
    prizeBadgeText: "text-amber-300",
    orbIdle: "bg-gradient-to-br from-slate-700 to-slate-800 shadow-[0_0_30px_rgba(100,116,139,0.15)]",
    orbIdleText: "text-slate-400",
    statusDone: "text-emerald-400",
    statusText: "text-slate-500",
    statusBold: "text-white",
    statusDivider: "text-slate-600",
    statusTotal: "text-slate-400",
    countdownText: "text-amber-400",
    cellMobile: "bg-slate-800/60 text-slate-300 border border-slate-700/40",
    cellDesktop: "bg-slate-800/50 text-slate-300 border border-slate-700/30 hover:bg-slate-700/50 hover:text-white",
    bottomBar: "bg-slate-950/95 backdrop-blur-md border-t border-white/5",
    spinBtn: "from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:from-slate-700 disabled:to-slate-800 disabled:text-slate-500",
    autoBtn: "bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700",
    autoBtnDisabled: "disabled:bg-slate-800 disabled:text-slate-600 disabled:border-slate-700",
    desktopBar: "bg-slate-900/90 backdrop-blur-lg border border-white/10 shadow-2xl",
    desktopSpinBtn: "from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:from-slate-700 disabled:to-slate-800 disabled:text-slate-500",
    desktopAutoBtn: "bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700",
    modalOverlay: "bg-black/60 backdrop-blur-sm",
    modalBg: "bg-slate-800 border-slate-700",
    modalTitle: "text-white",
    modalClose: "text-slate-400 hover:text-white",
    modalLabel: "text-slate-400",
    modalInput: "bg-slate-700 border-slate-600 text-white focus:ring-amber-500/50",
    modalArrow: "text-slate-500",
    modalSubText: "text-slate-500",
    modalCancelBtn: "text-slate-300 bg-slate-700 hover:bg-slate-600",
    modalSaveBtn: "text-white bg-amber-500 hover:bg-amber-600 shadow-md",
    modalSuffix: "text-slate-400",
  },
  ocean: {
    key: "ocean",
    label: "Đại dương",
    icon: "🌊",
    bg: "bg-gradient-to-b from-cyan-950 via-blue-900 to-indigo-950 text-white",
    text: "text-white",
    headerBg: "bg-blue-950/80 backdrop-blur-sm border-b border-cyan-400/10",
    headerBorder: "",
    backBtn: "text-cyan-300/60 hover:text-cyan-200",
    titleGradient: "from-cyan-300 to-blue-400",
    iconBtn: "text-cyan-300/60 hover:text-cyan-200",
    prizeActive: "text-cyan-300 bg-cyan-400/10",
    prizeBadgeBg: "bg-gradient-to-r from-cyan-500/10 to-blue-500/10",
    prizeBadgeBorder: "border-cyan-400/20",
    prizeBadgeIcon: "text-cyan-400",
    prizeBadgeText: "text-cyan-300",
    orbIdle: "bg-gradient-to-br from-blue-700 to-indigo-800 shadow-[0_0_30px_rgba(56,189,248,0.15)]",
    orbIdleText: "text-blue-300",
    statusDone: "text-cyan-400",
    statusText: "text-blue-300/60",
    statusBold: "text-white",
    statusDivider: "text-blue-700",
    statusTotal: "text-blue-300/80",
    countdownText: "text-cyan-400",
    cellMobile: "bg-blue-800/50 text-blue-200 border border-blue-700/40",
    cellDesktop: "bg-blue-800/40 text-blue-200 border border-blue-700/30 hover:bg-blue-700/50 hover:text-white",
    bottomBar: "bg-blue-950/95 backdrop-blur-md border-t border-cyan-400/10",
    spinBtn: "from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 disabled:from-blue-800 disabled:to-blue-900 disabled:text-blue-500",
    autoBtn: "bg-blue-800 hover:bg-blue-700 text-blue-200 border border-blue-700",
    autoBtnDisabled: "disabled:bg-blue-800 disabled:text-blue-500 disabled:border-blue-700",
    desktopBar: "bg-blue-950/90 backdrop-blur-lg border border-cyan-400/10 shadow-2xl",
    desktopSpinBtn: "from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 disabled:from-blue-800 disabled:to-blue-900 disabled:text-blue-500",
    desktopAutoBtn: "bg-blue-800 hover:bg-blue-700 text-blue-200 border border-blue-700",
    modalOverlay: "bg-black/60 backdrop-blur-sm",
    modalBg: "bg-blue-900 border-blue-700",
    modalTitle: "text-white",
    modalClose: "text-blue-400 hover:text-white",
    modalLabel: "text-blue-400",
    modalInput: "bg-blue-800 border-blue-700 text-white focus:ring-cyan-500/50",
    modalArrow: "text-blue-600",
    modalSubText: "text-blue-500",
    modalCancelBtn: "text-blue-200 bg-blue-800 hover:bg-blue-700",
    modalSaveBtn: "text-white bg-cyan-500 hover:bg-cyan-600 shadow-md",
    modalSuffix: "text-blue-400",
  },
  sunset: {
    key: "sunset",
    label: "Hoàng hôn",
    icon: "🌅",
    bg: "bg-gradient-to-b from-orange-950 via-rose-900 to-purple-950 text-white",
    text: "text-white",
    headerBg: "bg-rose-950/80 backdrop-blur-sm border-b border-orange-400/10",
    headerBorder: "",
    backBtn: "text-orange-300/60 hover:text-orange-200",
    titleGradient: "from-amber-300 to-rose-400",
    iconBtn: "text-orange-300/60 hover:text-orange-200",
    prizeActive: "text-amber-300 bg-amber-400/10",
    prizeBadgeBg: "bg-gradient-to-r from-amber-500/10 to-rose-500/10",
    prizeBadgeBorder: "border-amber-400/20",
    prizeBadgeIcon: "text-amber-400",
    prizeBadgeText: "text-amber-300",
    orbIdle: "bg-gradient-to-br from-rose-700 to-purple-800 shadow-[0_0_30px_rgba(251,113,133,0.15)]",
    orbIdleText: "text-rose-300",
    statusDone: "text-amber-400",
    statusText: "text-rose-300/60",
    statusBold: "text-white",
    statusDivider: "text-rose-700",
    statusTotal: "text-rose-300/80",
    countdownText: "text-amber-400",
    cellMobile: "bg-rose-800/50 text-rose-200 border border-rose-700/40",
    cellDesktop: "bg-rose-800/40 text-rose-200 border border-rose-700/30 hover:bg-rose-700/50 hover:text-white",
    bottomBar: "bg-rose-950/95 backdrop-blur-md border-t border-orange-400/10",
    spinBtn: "from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 disabled:from-rose-800 disabled:to-rose-900 disabled:text-rose-500",
    autoBtn: "bg-rose-800 hover:bg-rose-700 text-rose-200 border border-rose-700",
    autoBtnDisabled: "disabled:bg-rose-800 disabled:text-rose-500 disabled:border-rose-700",
    desktopBar: "bg-rose-950/90 backdrop-blur-lg border border-orange-400/10 shadow-2xl",
    desktopSpinBtn: "from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 disabled:from-rose-800 disabled:to-rose-900 disabled:text-rose-500",
    desktopAutoBtn: "bg-rose-800 hover:bg-rose-700 text-rose-200 border border-rose-700",
    modalOverlay: "bg-black/60 backdrop-blur-sm",
    modalBg: "bg-rose-900 border-rose-700",
    modalTitle: "text-white",
    modalClose: "text-rose-400 hover:text-white",
    modalLabel: "text-rose-400",
    modalInput: "bg-rose-800 border-rose-700 text-white focus:ring-amber-500/50",
    modalArrow: "text-rose-600",
    modalSubText: "text-rose-500",
    modalCancelBtn: "text-rose-200 bg-rose-800 hover:bg-rose-700",
    modalSaveBtn: "text-white bg-amber-500 hover:bg-amber-600 shadow-md",
    modalSuffix: "text-rose-400",
  },
};

export const THEME_KEYS: ThemeKey[] = ["light", "dark", "ocean", "sunset"];

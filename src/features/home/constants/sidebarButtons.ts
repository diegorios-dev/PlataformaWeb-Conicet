// Botón base y variantes para el sidebar
export const btnBase =
  "group relative w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 overflow-hidden focus:outline-none focus:ring-2 focus:ring-offset-2";

export const btnPrimary =
  `${btnBase} bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 focus:ring-blue-500 shadow-sm hover:shadow-md active:scale-[0.98]`;

export const btnWarn =
  `${btnBase} bg-gradient-to-r from-red-500 to-red-900 text-white hover:from-red-600 hover:to-red-700 focus:ring-red-500 shadow-sm hover:shadow-md active:scale-[0.98]`;

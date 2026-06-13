/**
 * Oddiy spinner. Lazy loading va data fetch paytida ishlatiladi.
 */
export default function Loader({ label = 'Yuklanmoqda...' }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16" role="status" aria-live="polite">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-brand" />
      <p className="text-sm text-slate-500">{label}</p>
    </div>
  );
}

// app/loading.tsx — Next.js global loading UI
// Shown automatically during page transitions and data fetching

export default function Loading() {
  return (
    <div className="min-h-screen bg-[#FFFBEB] animate-pulse">

      {/* ── Page header skeleton ── */}
      <div className="bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <div className="h-3 w-28 bg-slate-200 rounded-full mb-4" />
          <div className="h-8 w-64 bg-slate-200 rounded-xl mb-2" />
          <div className="h-4 w-40 bg-slate-100 rounded-full" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">

        {/* ── Stat cards row (dashboard-style) ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-100 p-5 space-y-4">
              <div className="flex items-start justify-between">
                <div className="w-11 h-11 rounded-xl bg-slate-100" />
                <div className="h-6 w-14 rounded-full bg-slate-100" />
              </div>
              <div>
                <div className="h-7 w-24 bg-slate-200 rounded-lg mb-2" />
                <div className="h-3.5 w-32 bg-slate-100 rounded-full" />
              </div>
            </div>
          ))}
        </div>

        {/* ── Product / content grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
              {/* Image placeholder */}
              <div className="w-full h-48 bg-slate-100" />
              {/* Content */}
              <div className="p-4 space-y-3">
                <div className="h-3 w-20 bg-amber-100 rounded-full" />
                <div className="h-5 w-full bg-slate-200 rounded-lg" />
                <div className="h-4 w-4/5 bg-slate-100 rounded-full" />
                <div className="flex items-center gap-2 mt-1">
                  <div className="h-3 w-16 bg-slate-100 rounded-full" />
                  <div className="h-3 w-12 bg-slate-100 rounded-full" />
                </div>
                <div className="flex items-center justify-between pt-1">
                  <div className="h-6 w-16 bg-slate-200 rounded-lg" />
                  <div className="h-8 w-24 bg-amber-100 rounded-xl" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Amber pulsing indicator at top */}
      <div className="fixed top-0 left-0 right-0 h-0.5 z-50">
        <div className="h-full bg-gradient-to-r from-amber-400 via-amber-600 to-amber-400 animate-[shimmer_1.5s_ease-in-out_infinite]"
          style={{ backgroundSize: '200% 100%' }}
        />
      </div>
    </div>
  );
}
import { Skeleton } from '@/components/ui/skeleton'

const bodyLineWidths = ['96%', '88%', '92%', '78%', '90%', '85%', '70%', '95%', '82%']
const secondaryLineWidths = ['80%', '92%', '75%', '88%', '70%']
const tocWidths = ['85%', '70%', '60%', '78%', '55%', '82%', '68%']

export default function PostLoading() {
  return (
    <>
      {/* Hero header — mirrors the real post hero (dark warm + coral mesh) */}
      <div className="relative overflow-hidden bg-[hsl(30,8%,10%)]">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute -top-24 -left-16 h-[420px] w-[420px] rounded-full bg-accent/25 blur-3xl" />
          <div className="absolute -bottom-32 -right-10 h-[480px] w-[480px] rounded-full bg-accent/15 blur-3xl" />
          <div className="absolute top-1/3 left-1/2 h-[260px] w-[260px] -translate-x-1/2 rounded-full bg-accent/10 blur-3xl" />
        </div>
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/30 to-transparent" />
        <header className="relative z-10 mx-auto max-w-[800px] px-6 py-12 md:py-20">
          <div className="mb-4 flex items-center gap-2">
            <span className="h-px w-8 bg-accent" />
            <Skeleton className="h-3 w-16 bg-white/15" />
          </div>
          <Skeleton className="h-9 md:h-11 w-3/4 bg-white/20" />
          <Skeleton className="mt-3 h-9 md:h-11 w-1/2 bg-white/20" />
          <Skeleton className="mt-5 h-5 w-full max-w-md bg-white/15" />
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Skeleton className="h-4 w-20 bg-white/15" />
            <Skeleton className="h-4 w-24 bg-white/15" />
            <Skeleton className="h-4 w-16 bg-white/15" />
          </div>
        </header>
      </div>

      {/* Body grid — matches BlogLayout's symmetric 3-column */}
      <div className="mx-auto grid w-full max-w-[1360px] grid-cols-1 gap-10 px-4 md:px-6 pt-16 xl:grid-cols-[260px_minmax(0,800px)_260px]">
        {/* Left spacer (symmetric with TOC) */}
        <div aria-hidden="true" className="hidden xl:block" />

        {/* Main body */}
        <article className="pb-14">
          <div className="space-y-4">
            {bodyLineWidths.map((w, i) => (
              <Skeleton key={i} className="h-4" style={{ width: w }} />
            ))}
          </div>

          {/* Section heading */}
          <Skeleton className="mt-10 h-7 w-1/3" />
          <div className="mt-4 space-y-4">
            {secondaryLineWidths.map((w, i) => (
              <Skeleton key={i} className="h-4" style={{ width: w }} />
            ))}
          </div>

          {/* Code block placeholder */}
          <Skeleton className="mt-8 h-40 w-full rounded-md" />

          {/* Tags */}
          <div className="mt-12 pt-8 border-t flex flex-wrap gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-6 w-16 rounded-full" />
            ))}
          </div>

          {/* Related posts */}
          <section className="mt-12 pt-8 border-t">
            <Skeleton className="h-6 w-32 mb-6" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-4 w-4/5" />
                    <div className="flex gap-2 pt-1">
                      <Skeleton className="h-3 w-16" />
                      <Skeleton className="h-3 w-12" />
                    </div>
                  </div>
                  <Skeleton className="h-24 w-32 flex-shrink-0 rounded-lg" />
                </div>
              ))}
            </div>
          </section>
        </article>

        {/* TOC sidebar */}
        <aside className="hidden xl:block">
          <div className="sticky top-20 space-y-2.5">
            <Skeleton className="h-4 w-20 mb-3" />
            {tocWidths.map((w, i) => (
              <Skeleton key={i} className="h-3" style={{ width: w }} />
            ))}
          </div>
        </aside>
      </div>
    </>
  )
}

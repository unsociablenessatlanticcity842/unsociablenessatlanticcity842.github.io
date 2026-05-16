import { Skeleton } from '@/components/ui/skeleton'

const bodyLineWidths = ['96%', '88%', '92%', '78%', '90%', '85%', '70%', '95%', '82%']
const secondaryLineWidths = ['80%', '92%', '75%', '88%', '70%']
const tocWidths = ['85%', '70%', '60%', '78%', '55%', '82%', '68%']

export default function PostLoading() {
  return (
    <>
      {/* Hero header — full-bleed dark, mirrors real post hero */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-primary/15 to-secondary/30 dark:from-primary/40 dark:via-primary/20 dark:to-secondary/40" />
        <div className="absolute inset-0 bg-black/50" />
        <header className="relative z-10 mx-auto max-w-[800px] px-6 py-12 md:py-20">
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

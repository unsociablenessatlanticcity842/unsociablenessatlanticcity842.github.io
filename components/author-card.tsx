import Link from 'next/link'
import Image from 'next/image'
import { Github, Linkedin, ArrowUpRight } from 'lucide-react'

export function AuthorCard() {
  return (
    <section className="my-10 md:my-12">
      <div className="relative overflow-hidden rounded-2xl border border-border bg-card">
        {/* Decorative gradient corner */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full bg-primary/15 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-16 -left-10 h-40 w-40 rounded-full bg-accent/15 blur-3xl"
        />

        <div className="relative flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:gap-6 md:p-8">
          {/* Avatar */}
          <div className="relative flex-shrink-0">
            <div className="absolute inset-0 -m-1 rounded-full bg-gradient-to-tr from-primary to-accent opacity-70 blur-md" />
            <Image
              src="/favicon.svg"
              alt="Kaameo"
              width={56}
              height={56}
              className="relative h-14 w-14 rounded-full border border-border bg-background p-1"
            />
          </div>

          {/* Bio */}
          <div className="flex-1">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
              About the author
            </p>
            <h3 className="mt-1.5 text-xl font-bold tracking-tight">
              안녕하세요, <span className="text-primary">Kaameo</span>입니다.
            </h3>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
              실제 문제를 푸는 기술을 좋아하는 개발자. 백엔드·DevOps·풀스택 사이를 오가며
              배운 것을 기록합니다.
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <Link
                href="/about"
                className="inline-flex items-center gap-1 rounded-full bg-primary px-3.5 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                더 알아보기
                <ArrowUpRight className="h-3 w-3" />
              </Link>
              <Link
                href="https://github.com/kaameo"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
              >
                <Github className="h-3.5 w-3.5" />
                GitHub
              </Link>
              <Link
                href="https://linkedin.com/in/jinsu-hong/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
              >
                <Linkedin className="h-3.5 w-3.5" />
                LinkedIn
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

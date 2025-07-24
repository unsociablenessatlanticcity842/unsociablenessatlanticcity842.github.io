import Link from "next/link"
import { Github, Twitter, Linkedin, Mail } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t lg:ml-[250px]">
      <div className="px-4 md:px-6 lg:px-8 max-w-[1400px] mx-auto flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <p className="text-center text-sm leading-loose md:text-left">
            © 2024 Kaameo. Built with{" "}
            <Link
              href="https://nextjs.org"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              Next.js
            </Link>{" "}
            and{" "}
            <Link
              href="https://ui.shadcn.com"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              shadcn/ui
            </Link>
            .
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Link
            href="https://github.com/kaameo"
            target="_blank"
            rel="noreferrer"
            className="text-muted-foreground hover:text-foreground"
          >
            <Github className="h-5 w-5" />
            <span className="sr-only">GitHub</span>
          </Link>
          <Link
            href="https://twitter.com/kaameo"
            target="_blank"
            rel="noreferrer"
            className="text-muted-foreground hover:text-foreground"
          >
            <Twitter className="h-5 w-5" />
            <span className="sr-only">Twitter</span>
          </Link>
          <Link
            href="https://linkedin.com/in/kaameo"
            target="_blank"
            rel="noreferrer"
            className="text-muted-foreground hover:text-foreground"
          >
            <Linkedin className="h-5 w-5" />
            <span className="sr-only">LinkedIn</span>
          </Link>
          <Link
            href="mailto:kaameo@example.com"
            className="text-muted-foreground hover:text-foreground"
          >
            <Mail className="h-5 w-5" />
            <span className="sr-only">Email</span>
          </Link>
        </div>
      </div>
    </footer>
  )
}
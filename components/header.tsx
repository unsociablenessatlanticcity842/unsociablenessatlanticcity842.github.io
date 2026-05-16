'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTheme } from 'next-themes'
import { Moon, Sun, Menu, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'
import { COMMAND_PALETTE_EVENT } from '@/components/command-palette'

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/posts', label: 'Posts' },
  { href: '/about', label: 'About' },
]

export function Header() {
  const { theme, setTheme } = useTheme()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isMac, setIsMac] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    setIsMac(/Mac|iPod|iPhone|iPad/.test(navigator.platform))
  }, [])

  const openPalette = () => window.dispatchEvent(new Event(COMMAND_PALETTE_EVENT))

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-[800px] items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight">
          <Image
            src="/favicon.svg"
            alt=""
            width={32}
            height={32}
            className="h-7 w-7"
            aria-hidden="true"
          />
          Kaameo
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200',
                pathname === item.href
                  ? 'text-foreground'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Desktop: clickable search pill with shortcut hint */}
          <button
            type="button"
            onClick={openPalette}
            aria-label="검색 (Cmd+K)"
            className="hidden sm:flex h-9 items-center gap-2 rounded-md border border-border bg-secondary/40 px-2.5 text-sm text-muted-foreground transition-colors hover:bg-secondary"
          >
            <Search className="h-4 w-4" />
            <span className="pr-1">검색</span>
            <kbd className="hidden md:inline-flex items-center gap-0.5 rounded border border-border bg-background px-1.5 py-0.5 text-[10px] font-mono font-medium text-muted-foreground">
              {isMac ? '⌘' : 'Ctrl'} K
            </kbd>
          </button>

          {/* Mobile: icon only */}
          <Button
            variant="ghost"
            size="icon"
            className="sm:hidden"
            aria-label="검색"
            onClick={openPalette}
          >
            <Search className="h-5 w-5" />
          </Button>

          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle theme"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            <Sun
              className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
              aria-hidden="true"
            />
            <Moon
              className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
              aria-hidden="true"
            />
          </Button>

          {/* Mobile Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[260px]">
              <SheetTitle className="sr-only">Navigation menu</SheetTitle>
              <nav className="flex flex-col gap-2 mt-8">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      'px-4 py-3 text-base font-medium rounded-md transition-colors',
                      pathname === item.href
                        ? 'bg-accent text-foreground'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent/50',
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

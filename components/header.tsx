'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useTheme } from 'next-themes'
import { Moon, Sun, Menu, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { useState } from 'react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/', label: 'Home' },
  { href: '/posts', label: 'Posts' },
  { href: '/about', label: 'About' },
]

export function Header() {
  const { theme, setTheme } = useTheme()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-4 md:px-6">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold tracking-tight">
          Kaameo.dev
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
          <Link href="/posts?search=true">
            <Button variant="ghost" size="icon" aria-label="Search">
              <Search className="h-5 w-5" />
            </Button>
          </Link>

          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle theme"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" aria-hidden="true" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" aria-hidden="true" />
          </Button>

          {/* Mobile Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden" aria-label="Open menu">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[260px]">
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

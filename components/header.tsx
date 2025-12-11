"use client"

import Link from "next/link"
import { useTheme } from "next-themes"
import { Moon, Sun, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet"
import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { tagToSlug } from "@/lib/slug"

interface HeaderProps {
  categories: Array<{ name: string; count: number }>
  tags: Array<{ name: string; count: number }>
}

export function Header({ categories, tags }: HeaderProps) {
  const { theme, setTheme } = useTheme()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="px-4 md:px-6 lg:px-8 flex h-16 items-center max-w-[1400px] mx-auto">
        <Link href="/" className="mr-8 flex items-center space-x-2">
          <span className="text-xl font-bold">Kaameo.dev</span>
        </Link>
        
        <NavigationMenu className="hidden md:flex">
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link href="/" className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
                  Home
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>

            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link href="/posts" className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
                  Posts
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
            
            <NavigationMenuItem>
              <NavigationMenuTrigger>Categories</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                  {categories.map((category) => {
                    const categoryDescriptions: Record<string, string> = {
                      Frontend: "React, Next.js, TypeScript 등 프론트엔드 개발",
                      DevOps: "CI/CD, Docker, 클라우드 인프라 관련"
                      // 다른 카테고리에 대한 설명을 여기에 추가
                    }
                    
                    return (
                      <li key={category.name}>
                        <NavigationMenuLink asChild>
                          <Link
                            href={`/categories/${category.name.toLowerCase().replace(/\s+/g, '-')}`}
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium leading-none">{category.name}</span>
                              <Badge variant="secondary" className="text-xs">
                                {category.count}
                              </Badge>
                            </div>
                            {categoryDescriptions[category.name] && (
                              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                {categoryDescriptions[category.name]}
                              </p>
                            )}
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    )
                  })}
                </ul>
              </NavigationMenuContent>
            </NavigationMenuItem>
            
            <NavigationMenuItem>
              <NavigationMenuLink asChild>
                <Link href="/about" className="group inline-flex h-10 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
                  About Me
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        
        <div className="ml-auto flex items-center space-x-4">
          {/* Mobile Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden"
                aria-label="Open mobile menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px]">
              <nav className="flex flex-col space-y-4 mt-6">
                <Link
                  href="/"
                  className="text-lg font-medium hover:text-accent-foreground"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  홈
                </Link>
                <Link
                  href="/posts"
                  className="text-lg font-medium hover:text-accent-foreground"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  모든 포스트
                </Link>
                <Link
                  href="/about"
                  className="text-lg font-medium hover:text-accent-foreground"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  About
                </Link>
                
                <div className="border-t pt-4">
                  <h3 className="text-sm font-semibold mb-2">카테고리</h3>
                  <div className="space-y-1">
                    {categories.map((category) => (
                      <Link
                        key={category.name}
                        href={`/categories/${category.name.toLowerCase().replace(/\s+/g, '-')}`}
                        className="flex items-center justify-between py-1 text-sm hover:text-accent-foreground"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <span>{category.name}</span>
                        <Badge variant="secondary" className="text-xs">
                          {category.count}
                        </Badge>
                      </Link>
                    ))}
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <h3 className="text-sm font-semibold mb-2">태그</h3>
                  <div className="flex flex-wrap gap-1">
                    {tags.slice(0, 10).map((tag) => (
                      <Link
                        key={tag.name}
                        href={`/tags/${tagToSlug(tag.name)}`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        <Badge
                          variant="outline"
                          className="text-xs cursor-pointer hover:bg-accent hover:text-accent-foreground"
                        >
                          {tag.name} ({tag.count})
                        </Badge>
                      </Link>
                    ))}
                    {tags.length > 10 && (
                      <Link href="/tags" onClick={() => setMobileMenuOpen(false)}>
                        <Badge
                          variant="outline"
                          className="text-xs cursor-pointer hover:bg-accent hover:text-accent-foreground"
                        >
                          +{tags.length - 10} more
                        </Badge>
                      </Link>
                    )}
                  </div>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
          
          <Button
            variant="ghost"
            size="icon"
            aria-label="Toggle theme"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          </Button>
        </div>
      </div>
    </header>
  )
}
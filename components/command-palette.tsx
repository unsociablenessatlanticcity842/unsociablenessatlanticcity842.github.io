'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@/components/ui/command'
import { FileText, Hash, Folder, Home, User, Moon, Sun, Newspaper, ArrowRight } from 'lucide-react'
import { tagToSlug } from '@/lib/slug'

export interface PaletteItem {
  slug: string
  title: string
  description: string
  tags?: string[]
  category?: string
}

interface CommandPaletteProps {
  posts: PaletteItem[]
  tags: string[]
  categories: string[]
}

export const COMMAND_PALETTE_EVENT = 'command-palette:open'

export function CommandPalette({ posts, tags, categories }: CommandPaletteProps) {
  const [open, setOpen] = React.useState(false)
  const router = useRouter()
  const { theme, setTheme } = useTheme()

  React.useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen((prev) => !prev)
      }
    }
    const handleOpenEvent = () => setOpen(true)

    document.addEventListener('keydown', handleKey)
    window.addEventListener(COMMAND_PALETTE_EVENT, handleOpenEvent)
    return () => {
      document.removeEventListener('keydown', handleKey)
      window.removeEventListener(COMMAND_PALETTE_EVENT, handleOpenEvent)
    }
  }, [])

  const run = React.useCallback((fn: () => void) => {
    setOpen(false)
    // Defer to next tick so the dialog close animation doesn't fight navigation
    setTimeout(fn, 0)
  }, [])

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="검색하거나 명령을 입력하세요…" />
      <CommandList>
        <CommandEmpty>일치하는 결과가 없습니다.</CommandEmpty>

        <CommandGroup heading="바로가기">
          <CommandItem value="home 홈" onSelect={() => run(() => router.push('/'))}>
            <Home className="h-4 w-4 text-muted-foreground" />
            <span>홈</span>
            <CommandShortcut>↵</CommandShortcut>
          </CommandItem>
          <CommandItem value="posts 전체 포스트" onSelect={() => run(() => router.push('/posts'))}>
            <Newspaper className="h-4 w-4 text-muted-foreground" />
            <span>전체 포스트</span>
          </CommandItem>
          <CommandItem value="about 소개" onSelect={() => run(() => router.push('/about'))}>
            <User className="h-4 w-4 text-muted-foreground" />
            <span>소개</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="설정">
          <CommandItem
            value="theme toggle dark light 다크모드 라이트모드"
            onSelect={() => run(() => setTheme(theme === 'dark' ? 'light' : 'dark'))}
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4 text-muted-foreground" />
            ) : (
              <Moon className="h-4 w-4 text-muted-foreground" />
            )}
            <span>{theme === 'dark' ? '라이트 모드로 전환' : '다크 모드로 전환'}</span>
          </CommandItem>
        </CommandGroup>

        {posts.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading={`포스트 (${posts.length})`}>
              {posts.map((post) => (
                <CommandItem
                  key={post.slug}
                  value={`${post.title} ${post.description} ${post.tags?.join(' ') ?? ''} ${
                    post.category ?? ''
                  }`}
                  onSelect={() => run(() => router.push(`/posts/${post.slug}`))}
                >
                  <FileText className="h-4 w-4 shrink-0 text-muted-foreground" />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium">{post.title}</div>
                    {post.description && (
                      <div className="truncate text-xs text-muted-foreground">
                        {post.description}
                      </div>
                    )}
                  </div>
                  <ArrowRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground/60" />
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}

        {categories.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="카테고리">
              {categories.map((category) => (
                <CommandItem
                  key={category}
                  value={`category ${category}`}
                  onSelect={() =>
                    run(() =>
                      router.push(`/categories/${category.toLowerCase().replace(/\s+/g, '-')}`),
                    )
                  }
                >
                  <Folder className="h-4 w-4 text-muted-foreground" />
                  <span>{category}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}

        {tags.length > 0 && (
          <>
            <CommandSeparator />
            <CommandGroup heading="태그">
              {tags.map((tag) => (
                <CommandItem
                  key={tag}
                  value={`tag ${tag}`}
                  onSelect={() => run(() => router.push(`/tags/${tagToSlug(tag)}`))}
                >
                  <Hash className="h-4 w-4 text-muted-foreground" />
                  <span>{tag}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </>
        )}
      </CommandList>
    </CommandDialog>
  )
}

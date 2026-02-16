# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

```bash
npm run dev          # Development server
npm run build        # Production build (next build + .nojekyll)
npm run lint         # ESLint (next lint)
npm run export       # Static export (same as build)
```

No test framework is configured.

## Architecture

**Next.js 16 App Router** with static export (`output: 'export'`) for GitHub Pages deployment.

### Content System

Blog posts live in `content/posts/` as MDX files organized by category folders (up to 2 levels deep, e.g. `devops/docker/`). Frontmatter fields: `title`, `date`, `description`, `tags[]`, `category`, and optional `series`/`seriesOrder`/`coverImage`.

Content processing (`lib/mdx.ts`): gray-matter → next-mdx-remote/rsc with remark-gfm, rehype-prism-plus (syntax highlighting), rehype-slug, rehype-autolink-headings. Includes reading time calculation and heading extraction for TOC.

### Key Routes

- `/` — Homepage (server layout + `home-page-client.tsx` client component)
- `/posts/[slug]` — Individual post (slug derived from filename)
- `/categories/[category]` — Category listing
- `/tags/[tag]` — Tag listing
- `/about` — About page

### UI Stack

- **shadcn/ui** (Radix primitives) configured in `components.json`
- **Tailwind CSS** with HSL design tokens and custom typography plugin (Medium-style)
- **next-themes** for dark mode
- **Framer Motion** for animations
- **Lucide React** for icons
- Fonts: Inter (sans), JetBrains Mono (mono)

### Path Aliases

- `@/*` → project root
- `@/components/*`, `@/lib/*`, `@/content/*`

### Integrations

- Google Analytics 4, AdSense, Giscus comments — all configured via environment variables (see `.env.example`)
- SEO: sitemap.ts, structured data (BlogPosting schema), meta tags
- Mermaid diagram support in MDX code blocks

### Deployment

GitHub Actions (`.github/workflows/deploy.yml`) triggers on push to `main`. Builds with Node 22, outputs to `/out/`.

## Conventions

- Server components by default; client components explicitly marked with `"use client"` and often split into separate files (e.g. `home-page-client.tsx`)
- Blog content is in Korean
- Static generation only — no API routes or server-side runtime

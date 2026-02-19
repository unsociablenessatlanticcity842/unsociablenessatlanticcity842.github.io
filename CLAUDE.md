# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Development Commands

```bash
npm run dev          # Development server (next dev)
npm run build        # Production build (next build + .nojekyll touch)
npm run lint         # ESLint (eslint .)
npm run format       # Prettier format all files
npm run format:check # Prettier check without writing
npm run new-post     # Interactive post scaffolding script
npm run new-post -- --template spring --category Backend  # With template
```

Available post templates: `spring`, `backend`, `devops`, `algorithm`, `frontend`, `default`.

No test framework is configured.

## Architecture

**Next.js 16 App Router** with static export (`output: 'export'`, `trailingSlash: true`) for GitHub Pages at `https://kaameo.github.io`.

### Content Pipeline

MDX files in `content/posts/` are organized by category folders (up to 2 levels: `devops/docker/`, `backend/spring/`). The slug is derived from the filename only (not the path), so filenames must be globally unique.

**Frontmatter** is validated with Zod (`lib/frontmatter-schema.ts`). Required: `title`, `date`, `description`. Optional: `tags[]`, `category`, `author`, `coverImage`, `series`, `seriesOrder`.

**Processing chain** (`lib/mdx.ts`): gray-matter parses frontmatter → `next-mdx-remote/rsc` compiles MDX with remark-gfm, rehype-slug, rehype-code-titles, rehype-prism-plus (syntax highlighting), rehype-autolink-headings → reading-time calculates read time → custom `extractHeadings()` builds TOC data.

**Custom MDX components** (`components/mdx-components.tsx`): `pre` blocks are intercepted — `language-mermaid` code blocks render as Mermaid diagrams via a client wrapper; all other code blocks use a custom `CodeBlock` component.

### Data Flow Pattern

Server components fetch data via `lib/mdx.ts` functions (`getAllPosts`, `getPostBySlug`, `getPostsByTag`, `getPostsByCategory`), then pass serializable post data as props to client components. This is the core server/client split pattern:

- `app/page.tsx` (server) → `home-page-client.tsx` (client)
- `app/posts/[slug]/page.tsx` (server) renders MDX directly via RSC
- `components/posts-search-wrapper.tsx` (server) → `posts-search.tsx` (client)

### Blog Post Layout

`BlogLayout` (`components/blog-layout.tsx`) provides a 3-column layout for post pages: left sidebar (ads), center content (max 800px), right sidebar (sticky TOC). On mobile, TOC is accessible via a Sheet (slide-out panel). The header section (hero with cover image or gradient) is rendered full-bleed above the columns.

### Tag/Category Slug System

Tags support Korean characters. `lib/slug.ts` provides `tagToSlug()` (tag → URL-safe slug) and `slugToTag()` (slug → original tag via lookup). Category slugs are simpler lowercase-hyphenated transforms. Both tag and category pages use `generateStaticParams` for static generation.

### Related Posts

`getRelatedPosts()` in `lib/mdx.ts` scores posts by: same series (+30), same category (+20), shared tags (+5 each), then by date. Returns top 4.

### Key Routes

- `/` — Homepage with featured post + recent posts list
- `/posts/[slug]` — Post page with TOC, structured data, Giscus comments, related posts
- `/categories/[category]` — Category listing (grid layout)
- `/tags/[tag]` — Tag listing (grid layout)
- `/about` — About page

### UI Stack

- **shadcn/ui** (Radix primitives) in `components/ui/` — accordion, badge, button, card, input, navigation-menu, sheet, skeleton, switch, tabs, tooltip
- **Tailwind CSS** with HSL design tokens, `@tailwindcss/typography` plugin for prose styling
- **next-themes** for dark mode (system default, class-based)
- **Framer Motion** for list animations (AnimatePresence in search results)
- **Lucide React** for icons
- Fonts: Inter (sans via `--font-sans`), JetBrains Mono (mono via `--font-mono`)

### Integrations

All optional, configured via environment variables (see `.env.example`):
- **Google Analytics 4**: `NEXT_PUBLIC_GA_MEASUREMENT_ID`
- **Google AdSense**: `NEXT_PUBLIC_ADSENSE_CLIENT_ID`, `NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR`
- **Giscus comments**: `NEXT_PUBLIC_GISCUS_REPO`, `NEXT_PUBLIC_GISCUS_REPO_ID`, `NEXT_PUBLIC_GISCUS_CATEGORY`, `NEXT_PUBLIC_GISCUS_CATEGORY_ID`
- **SEO**: `app/sitemap.ts`, `app/robots.ts`, `app/opengraph-image.tsx`, structured data (BlogPosting + BreadcrumbList + WebSite schemas in `components/structured-data.tsx`)

### Deployment

GitHub Actions (`.github/workflows/deploy.yml`) on push to `main`: Node 22, `npm ci`, `npm run build`, deploys `./out/` to GitHub Pages. Environment variables are sourced from GitHub secrets/vars.

## Conventions

- Server components by default; `"use client"` components are split into separate files (e.g., `giscus-comments-wrapper.tsx` server → `giscus-comments.tsx` client)
- Blog content is written in Korean; UI labels are Korean
- Static generation only — no API routes, no server-side runtime, images are `unoptimized: true`
- Next.js 16 async params pattern: `params` is `Promise<{}>` and must be awaited
- Path aliases: `@/*` → project root, `@/components/*`, `@/lib/*`, `@/content/*`

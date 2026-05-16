import { getAllPosts, getAllTags, getAllCategories } from '@/lib/mdx'
import { CommandPalette, type PaletteItem } from '@/components/command-palette'

export async function CommandPaletteWrapper() {
  const [posts, tags, categories] = await Promise.all([
    getAllPosts(),
    getAllTags(),
    getAllCategories(),
  ])

  const paletteItems: PaletteItem[] = posts.map((p) => ({
    slug: p.slug,
    title: p.title,
    description: p.description,
    tags: p.tags,
    category: p.category,
  }))

  return <CommandPalette posts={paletteItems} tags={tags} categories={categories} />
}

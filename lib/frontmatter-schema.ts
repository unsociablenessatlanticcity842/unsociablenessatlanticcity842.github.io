import { z } from 'zod'

export const frontmatterSchema = z.object({
  title: z.string(),
  date: z.string(),
  description: z.string(),
  tags: z.array(z.string()).optional(),
  category: z.string().optional(),
  author: z.string().optional(),
  coverImage: z.string().optional(),
  series: z.string().optional(),
  seriesOrder: z.number().optional(),
})

export type Frontmatter = z.infer<typeof frontmatterSchema>

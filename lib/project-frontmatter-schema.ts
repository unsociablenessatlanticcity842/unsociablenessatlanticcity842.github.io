import { z } from 'zod'

export const projectFrontmatterSchema = z.object({
  title: z.string(),
  date: z.string(),
  description: z.string(),
  tags: z.array(z.string()).optional(),
  category: z.string().optional(),
  author: z.string().optional(),
  coverImage: z.string().optional(),
  github: z.string().url().optional(),
  demo: z.string().url().optional(),
  stack: z.array(z.string()).optional(),
  period: z.string().optional(),
  status: z.enum(['active', 'completed', 'archived']).optional(),
})

export type ProjectFrontmatter = z.infer<typeof projectFrontmatterSchema>

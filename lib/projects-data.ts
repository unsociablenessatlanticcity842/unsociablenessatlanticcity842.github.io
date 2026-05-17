import { getAllProjects } from './projects'

export async function getProjectCategoriesWithCount() {
  const projects = await getAllProjects()
  const counts = new Map<string, number>()

  projects.forEach((project) => {
    if (project.category) {
      const count = counts.get(project.category) || 0
      counts.set(project.category, count + 1)
    }
  })

  return Array.from(counts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
}

export async function getProjectTagsWithCount() {
  const projects = await getAllProjects()
  const counts = new Map<string, number>()

  projects.forEach((project) => {
    project.tags?.forEach((tag) => {
      const count = counts.get(tag) || 0
      counts.set(tag, count + 1)
    })
  })

  return Array.from(counts.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
}

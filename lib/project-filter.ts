import type { Project } from './projects'

export function filterProjects(
  projects: Project[],
  searchTerm: string,
  selectedTags: string[],
): Project[] {
  const term = searchTerm.trim().toLowerCase()

  return projects
    .filter((project) => {
      if (term) {
        const haystack = [project.title, project.description, ...(project.stack ?? [])]
          .join(' ')
          .toLowerCase()
        if (!haystack.includes(term)) {
          // Fallback: fuzzy match on title (same char-order rule as posts)
          const titleLower = project.title.toLowerCase()
          let searchIndex = 0
          for (let i = 0; i < titleLower.length && searchIndex < term.length; i++) {
            if (titleLower[i] === term[searchIndex]) searchIndex++
          }
          if (searchIndex !== term.length) return false
        }
      }

      if (selectedTags.length > 0) {
        if (!project.tags) return false
        return selectedTags.every((tag) => project.tags!.includes(tag))
      }

      return true
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

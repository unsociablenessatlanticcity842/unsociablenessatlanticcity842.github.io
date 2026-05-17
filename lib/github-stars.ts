/**
 * 빌드 시점에 GitHub repo의 star 수를 가져온다.
 * - 인증 없이 호출하면 IP당 60 req/hr 제한, GITHUB_TOKEN 있으면 5000/hr.
 * - 동일 repo는 메모리 캐시로 중복 호출 방지.
 * - 실패해도 빌드를 막지 않도록 null 반환.
 */

const cache = new Map<string, number | null>()

export function parseGithubRepo(url: string | undefined): { owner: string; repo: string } | null {
  if (!url) return null
  try {
    const u = new URL(url)
    if (u.hostname !== 'github.com') return null
    const parts = u.pathname.split('/').filter(Boolean)
    if (parts.length < 2) return null
    const [owner, rawRepo] = parts
    const repo = rawRepo.replace(/\.git$/, '')
    if (!owner || !repo) return null
    return { owner, repo }
  } catch {
    return null
  }
}

export async function fetchStarCount(owner: string, repo: string): Promise<number | null> {
  const key = `${owner}/${repo}`
  if (cache.has(key)) return cache.get(key) ?? null

  const token = process.env.GITHUB_TOKEN
  const headers: Record<string, string> = {
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'kaameo.github.io-build',
  }
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  try {
    const res = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
      headers,
      // Next.js fetch는 build 시 캐시되지만 일관성 위해 명시
      next: { revalidate: 3600 },
    })

    if (!res.ok) {
      console.warn(`[github-stars] ${key} → HTTP ${res.status}`)
      cache.set(key, null)
      return null
    }

    const data = (await res.json()) as { stargazers_count?: number }
    const stars = typeof data.stargazers_count === 'number' ? data.stargazers_count : null
    cache.set(key, stars)
    return stars
  } catch (err) {
    console.warn(`[github-stars] ${key} fetch failed:`, err)
    cache.set(key, null)
    return null
  }
}

export async function fetchStarCountFromUrl(githubUrl: string | undefined): Promise<number | null> {
  const parsed = parseGithubRepo(githubUrl)
  if (!parsed) return null
  return fetchStarCount(parsed.owner, parsed.repo)
}

export function formatStarCount(n: number): string {
  if (n < 1000) return n.toString()
  if (n < 10_000) return (n / 1000).toFixed(1).replace(/\.0$/, '') + 'k'
  if (n < 1_000_000) return Math.round(n / 1000) + 'k'
  return (n / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M'
}

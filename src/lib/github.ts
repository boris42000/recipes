// Minimal GitHub Contents API client for editing recipes straight from the site.
// The site is static, so the browser talks to GitHub directly with the user's own token.

const REPO = 'boris42000/recipes' // keep in sync with `backend.repo` in public/admin/config.yml
const BRANCH = 'main'
const TOKEN_KEY = 'recipes.githubToken'
/** Where Sveltia CMS (/admin, same origin) keeps its login, so one sign-in covers both. */
const CMS_USER_KEY = 'sveltia-cms.user'

export function getToken(): string | undefined {
  try {
    const own = localStorage.getItem(TOKEN_KEY)
    if (own) return own
    const cmsUser = JSON.parse(localStorage.getItem(CMS_USER_KEY) ?? 'null') as { token?: unknown } | null
    return typeof cmsUser?.token === 'string' ? cmsUser.token : undefined
  } catch {
    return undefined
  }
}

export function setToken(token: string | null) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token)
    else localStorage.removeItem(TOKEN_KEY)
  } catch {
    // Private mode etc.: the token then lives only for this page view.
  }
}

export class GitHubError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message)
  }
}

export type RepoFile = { content: string; sha: string }

const apiUrl = (path: string) =>
  `https://api.github.com/repos/${REPO}/contents/${path.split('/').map(encodeURIComponent).join('/')}`

async function request(token: string, url: string, init?: RequestInit) {
  const res = await fetch(url, {
    ...init,
    cache: 'no-store',
    headers: {
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token}`,
      'X-GitHub-Api-Version': '2022-11-28',
      ...(init?.body ? { 'Content-Type': 'application/json' } : {}),
    },
  })
  if (!res.ok) {
    const body = (await res.json().catch(() => ({}))) as { message?: string }
    throw new GitHubError(body.message ?? res.statusText, res.status)
  }
  return res.json()
}

// atob/btoa work on Latin-1 strings; recipes are UTF-8 (diacritics), so go through bytes.
const decodeBase64 = (b64: string) =>
  new TextDecoder().decode(Uint8Array.from(atob(b64.replace(/\s/g, '')), (c) => c.charCodeAt(0)))
const encodeBase64 = (text: string) => {
  let binary = ''
  for (const byte of new TextEncoder().encode(text)) binary += String.fromCharCode(byte)
  return btoa(binary)
}

/** Current file on `main`, or undefined if it doesn't exist yet. */
export async function getFile(token: string, path: string): Promise<RepoFile | undefined> {
  try {
    const data = (await request(token, `${apiUrl(path)}?ref=${BRANCH}`)) as { content: string; sha: string }
    return { content: decodeBase64(data.content), sha: data.sha }
  } catch (e) {
    if (e instanceof GitHubError && e.status === 404) return undefined
    throw e
  }
}

/** Commit the file to `main`. Pass the `sha` you edited from; GitHub rejects it (409) if the file changed since. */
export async function putFile(token: string, path: string, content: string, message: string, sha?: string) {
  const data = (await request(token, apiUrl(path), {
    method: 'PUT',
    body: JSON.stringify({ message, content: encodeBase64(content), branch: BRANCH, ...(sha ? { sha } : {}) }),
  })) as { content: { sha: string } }
  return data.content.sha
}

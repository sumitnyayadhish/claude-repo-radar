// Minimal GitHub REST client: token from GITHUB_TOKEN / GH_TOKEN, polite retry on rate limits.
const API = "https://api.github.com";
const token = process.env.GITHUB_TOKEN || process.env.GH_TOKEN || "";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export async function gh(path, { raw = false, retries = 3 } = {}) {
  const url = path.startsWith("http") ? path : API + path;
  for (let attempt = 0; attempt <= retries; attempt++) {
    const res = await fetch(url, {
      headers: {
        Accept: raw ? "application/vnd.github.raw+json" : "application/vnd.github+json",
        "User-Agent": "claude-repo-radar",
        "X-GitHub-Api-Version": "2022-11-28",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    if (res.status === 404) return null;
    if (res.status === 403 || res.status === 429) {
      const reset = Number(res.headers.get("x-ratelimit-reset") || 0) * 1000;
      const wait = Math.min(Math.max(reset - Date.now(), 5000), 65000);
      console.error(`  rate limited, waiting ${Math.round(wait / 1000)}s`);
      await sleep(wait);
      continue;
    }
    if (!res.ok) throw new Error(`GitHub ${res.status} for ${url}`);
    return raw ? res.text() : res.json();
  }
  throw new Error(`GitHub retries exhausted for ${url}`);
}

export async function searchRepos(query, page = 1) {
  const q = encodeURIComponent(query);
  const data = await gh(`/search/repositories?q=${q}&sort=updated&order=desc&per_page=100&page=${page}`);
  await sleep(2500); // search API: 30 req/min authenticated
  return data?.items ?? [];
}

export const getRepo = (fullName) => gh(`/repos/${fullName}`);

export async function getTree(fullName, branch) {
  const data = await gh(`/repos/${fullName}/git/trees/${encodeURIComponent(branch)}?recursive=1`);
  return data?.tree ?? [];
}

export async function getFile(fullName, path) {
  try {
    return await gh(`/repos/${fullName}/contents/${encodeURI(path)}`, { raw: true });
  } catch {
    return null;
  }
}

// Accepts "owner/repo", github URLs, or any text containing them.
export function extractRepoNames(text) {
  const out = new Set();
  const re = /github\.com\/([A-Za-z0-9-]+)\/([A-Za-z0-9._-]+)/g;
  for (const m of text.matchAll(re)) out.add(`${m[1]}/${m[2].replace(/\.git$/, "")}`);
  if (!out.size && /^[A-Za-z0-9-]+\/[A-Za-z0-9._-]+$/.test(text.trim())) out.add(text.trim());
  return [...out];
}

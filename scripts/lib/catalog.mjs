import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const CATALOG = join(ROOT, "catalog", "repos.json");
const QUARANTINE = join(ROOT, "catalog", "quarantine.json");
const DAY = 86400000;

export const config = JSON.parse(readFileSync(join(ROOT, "config", "radar.json"), "utf8"));

const readJson = (p, fallback) => (existsSync(p) ? JSON.parse(readFileSync(p, "utf8")) : fallback);
const writeJson = (p, v) => { mkdirSync(dirname(p), { recursive: true }); writeFileSync(p, JSON.stringify(v, null, 2) + "\n"); };

export function loadCatalog() {
  return {
    repos: readJson(CATALOG, { repos: [] }).repos,
    quarantine: readJson(QUARANTINE, { repos: [] }).repos,
  };
}

export function saveCatalog({ repos, quarantine }) {
  // Hand-added repos (manual/reel) are always kept; auto-discovered ones fill the remaining slots.
  repos.sort((a, b) => b.gemScore - a.gemScore);
  const manual = repos.filter((r) => r.source !== "auto");
  const auto = repos.filter((r) => r.source === "auto").slice(0, Math.max(config.filters.maxCatalogSize - manual.length, 0));
  repos = [...manual, ...auto].sort((a, b) => b.gemScore - a.gemScore);
  const now = new Date().toISOString();
  writeJson(CATALOG, { updatedAt: now, count: repos.length, repos });
  writeJson(QUARANTINE, { updatedAt: now, count: quarantine.length, repos: quarantine });
  renderMarkdown(repos);
  return repos;
}

export function classify(repo) {
  const hay = [repo.name, repo.description, ...(repo.topics || [])].join(" ").toLowerCase();
  const hits = [];
  for (const [id, cat] of Object.entries(config.categories)) {
    const n = cat.repoKeywords.filter((k) => hay.includes(k.toLowerCase())).length;
    if (n) hits.push([id, n]);
  }
  hits.sort((a, b) => b[1] - a[1]);
  return hits.length ? hits.map(([id]) => id) : ["skills"];
}

export function gemScore(repo) {
  const ageDays = Math.max((Date.now() - Date.parse(repo.created_at)) / DAY, 7);
  const sincePush = (Date.now() - Date.parse(repo.pushed_at)) / DAY;
  const velocity = repo.stargazers_count / ageDays; // stars per day
  const freshness = Math.exp(-sincePush / 60);
  const hidden = repo.stargazers_count < 1000 ? 1.25 : 1;
  return Math.round(Math.log10(1 + velocity * 30) * freshness * hidden * 100);
}

export function isCandidate(repo) {
  const f = config.filters;
  const ageDays = (Date.now() - Date.parse(repo.created_at)) / DAY;
  const sincePush = (Date.now() - Date.parse(repo.pushed_at)) / DAY;
  return !repo.archived && !repo.fork && !repo.disabled &&
    repo.stargazers_count >= f.minStars && repo.stargazers_count <= f.maxStars &&
    ageDays <= f.maxAgeDays && sincePush <= f.maxDaysSincePush &&
    !config.blocklist.includes(repo.full_name);
}

const STOP = new Set("the a an and or for with of to in on is your you claude code this that from using use by it as are be".split(" "));

export function toEntry(repo, security, source, existing) {
  const categories = classify(repo);
  const words = `${repo.name.replace(/[-_]/g, " ")} ${repo.description || ""} ${(repo.topics || []).join(" ")}`
    .toLowerCase().match(/[a-z][a-z0-9.+#-]{1,}/g) || [];
  return {
    name: repo.full_name,
    url: repo.html_url,
    description: (repo.description || "").slice(0, 300),
    category: categories[0],
    categories,
    topics: repo.topics || [],
    keywords: [...new Set(words.filter((w) => !STOP.has(w)))].slice(0, 40),
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    language: repo.language,
    license: repo.license?.spdx_id ?? null,
    createdAt: repo.created_at,
    pushedAt: repo.pushed_at,
    gemScore: gemScore(repo),
    source: existing?.source ?? source,
    addedAt: existing?.addedAt ?? new Date().toISOString(),
    security,
  };
}

function renderMarkdown(repos) {
  const byCat = {};
  for (const r of repos) (byCat[r.category] ||= []).push(r);
  const badge = { low: "🟢", medium: "🟡", high: "🔴" };
  const row = (r) =>
    `| [${r.name}](${r.url}) | ${r.description.replace(/\|/g, "\\|").slice(0, 120)} | ⭐ ${r.stars} | ${r.gemScore} | ${badge[r.security.risk]} |`;
  const section = (limit) => Object.entries(config.categories)
    .filter(([id]) => byCat[id]?.length)
    .map(([id, c]) => `### ${c.label} (${byCat[id].length})\n\n| Repo | What it does | Stars | Gem score | Safety |\n|---|---|---|---|---|\n${byCat[id].slice(0, limit).map(row).join("\n")}\n`)
    .join("\n");

  const stamp = `_Last updated: ${new Date().toISOString().slice(0, 10)} · ${repos.length} repos · 🟢 low risk · 🟡 review before use_\n`;
  writeFileSync(join(ROOT, "catalog", "CATALOG.md"), `# Full catalog\n\n${stamp}\n${section(Infinity)}`);

  const readmePath = join(ROOT, "README.md");
  if (!existsSync(readmePath)) return;
  const readme = readFileSync(readmePath, "utf8");
  const block = `<!-- RADAR:START -->\n${stamp}\n${section(10)}\n➡️ [See the full catalog](catalog/CATALOG.md)\n<!-- RADAR:END -->`;
  writeFileSync(readmePath, readme.replace(/<!-- RADAR:START -->[\s\S]*<!-- RADAR:END -->/, block));
}

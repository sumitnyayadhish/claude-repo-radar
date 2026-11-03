#!/usr/bin/env node
// Daily discovery: search GitHub for new Claude Code / MCP / agent repos, keep the "hidden gems",
// security-scan new ones, refresh stats of existing ones, and rewrite catalog + README.
// Usage: GITHUB_TOKEN=... node scripts/discover.mjs [--max-new 80] [--dry-run]
import { searchRepos, getRepo } from "./lib/github.mjs";
import { scanRepo } from "./lib/security.mjs";
import { config, loadCatalog, saveCatalog, isCandidate, toEntry, gemScore } from "./lib/catalog.mjs";

const args = process.argv.slice(2);
const opt = (name, def) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : def; };
const MAX_NEW = Number(opt("--max-new", 80));
const DRY = args.includes("--dry-run");
const RESCAN_DAYS = 14;
const DAY = 86400000;

const { repos: existing, quarantine } = loadCatalog();
const byName = new Map(existing.map((r) => [r.name.toLowerCase(), r]));
const quarantined = new Set(quarantine.map((r) => r.name.toLowerCase()));

// 1. Search
const found = new Map();
for (const q of config.queries) {
  for (let page = 1; page <= config.filters.perQueryPages; page++) {
    const items = await searchRepos(`${q} fork:false archived:false`, page).catch((e) => (console.error(`  ${q}: ${e.message}`), []));
    for (const it of items) found.set(it.full_name.toLowerCase(), it);
    console.log(`search "${q}" p${page}: ${items.length}`);
    if (items.length < 100) break;
  }
}
const candidates = [...found.values()].filter(isCandidate);
console.log(`\n${found.size} unique results, ${candidates.length} pass gem filters`);

// 2. Update known repos, scan new ones (best gems first)
const next = new Map(byName);
let scanned = 0, added = 0, blocked = 0;
const ranked = candidates.sort((a, b) => gemScore(b) - gemScore(a));
for (const repo of ranked) {
  const key = repo.full_name.toLowerCase();
  if (quarantined.has(key)) continue;
  const prev = byName.get(key);
  const stale = !prev || prev.pushedAt !== repo.pushed_at && Date.now() - Date.parse(prev.security.scannedAt) > RESCAN_DAYS * DAY;
  let security = prev?.security;
  if (stale) {
    if (scanned >= MAX_NEW) continue;
    scanned++;
    security = await scanRepo(repo);
  }
  if (security.risk === "high") {
    next.delete(key);
    quarantine.push({ name: repo.full_name, url: repo.html_url, security });
    quarantined.add(key);
    blocked++;
    console.log(`  🔴 quarantined ${repo.full_name}: ${security.flags.join("; ")}`);
    continue;
  }
  if (!prev) added++;
  next.set(key, toEntry(repo, security, "auto", prev));
}

// 3. Refresh entries that did not show up in search (manual/reel adds, or dropped out of results)
for (const [key, entry] of next) {
  if (found.has(key)) continue;
  const repo = await getRepo(entry.name).catch(() => null);
  if (!repo || repo.archived) { next.delete(key); continue; }
  const sincePush = (Date.now() - Date.parse(repo.pushed_at)) / DAY;
  if (entry.source === "auto" && sincePush > 180) { next.delete(key); continue; }
  next.set(key, toEntry(repo, entry.security, entry.source, entry));
}

console.log(`\nscanned ${scanned}, added ${added}, quarantined ${blocked}, catalog now ${next.size}`);
if (DRY) process.exit(0);
const saved = saveCatalog({ repos: [...next.values()], quarantine });
console.log(`wrote ${saved.length} repos`);

#!/usr/bin/env node
// Add repos by hand (e.g. ones seen in an Instagram/YouTube reel). Skips the "hidden gem" star/age
// filters but never skips the security scan. High-risk repos go to quarantine, not the catalog.
// Usage: node scripts/add-repo.mjs <owner/repo | github url | text with urls>... [--source reel] [--note "..."]
import { getRepo, extractRepoNames } from "./lib/github.mjs";
import { scanRepo } from "./lib/security.mjs";
import { loadCatalog, saveCatalog, toEntry } from "./lib/catalog.mjs";

const args = process.argv.slice(2);
const flag = (n) => { const i = args.indexOf(n); if (i < 0) return undefined; const v = args[i + 1]; args.splice(i, 2); return v; };
const source = flag("--source") ?? "manual";
const note = flag("--note");
const names = args.flatMap(extractRepoNames);
if (!names.length) {
  console.error("No GitHub repo found in input. Pass owner/repo or a github.com URL.");
  process.exit(1);
}

const { repos, quarantine } = loadCatalog();
const byName = new Map(repos.map((r) => [r.name.toLowerCase(), r]));
const results = [];

for (const name of names) {
  const repo = await getRepo(name);
  if (!repo) { results.push(`❌ ${name}: not found`); continue; }
  if (repo.archived) { results.push(`❌ ${repo.full_name}: archived`); continue; }
  const security = await scanRepo(repo);
  const key = repo.full_name.toLowerCase();
  if (security.risk === "high") {
    byName.delete(key);
    quarantine.push({ name: repo.full_name, url: repo.html_url, security });
    results.push(`🔴 ${repo.full_name}: quarantined — ${security.flags.join("; ")}`);
    continue;
  }
  const entry = toEntry(repo, security, source, byName.get(key));
  if (note) entry.note = note;
  results.push(`${byName.has(key) ? "♻️ updated" : "✅ added"} ${repo.full_name} [${entry.category}] ⭐${entry.stars} risk=${security.risk}${security.flags.length ? " (" + security.flags.join("; ") + ")" : ""}`);
  byName.set(key, entry);
}

saveCatalog({ repos: [...byName.values()], quarantine });
console.log(results.join("\n"));

#!/usr/bin/env node
// UserPromptSubmit hook: match the user's prompt against the catalog and inject the top
// security-checked repos as context. Prints nothing when nothing relevant matches.
// Uses the freshest catalog it can get: remote (cached 12h) → bundled copy.
import { readFileSync, writeFileSync, existsSync, statSync } from "node:fs";
import { homedir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const config = JSON.parse(readFileSync(join(ROOT, "config", "radar.json"), "utf8"));
const CACHE = join(homedir(), ".claude", "repo-radar-catalog.json");
const REMOTE = `https://raw.githubusercontent.com/${config.repo}/main/catalog/repos.json`;
const TTL = 12 * 3600 * 1000;
const TOP = 5;
const MIN_SCORE = 3;

const STOP = new Set(("the a an and or for with of to in on is it as are be my me i we you your this that these those " +
  "make build create want need please help can could should would will do does how what why add new use using get " +
  "claude code file files project app some all any more like just also into from then there here kar karo karna hai " +
  "mujhe mere ek aur ko se ki ke liye banao bana chahiye").split(" "));

async function loadCatalog() {
  try {
    if (existsSync(CACHE) && Date.now() - statSync(CACHE).mtimeMs < TTL) return JSON.parse(readFileSync(CACHE, "utf8"));
    const res = await fetch(REMOTE, { signal: AbortSignal.timeout(1500) });
    if (res.ok) {
      const text = await res.text();
      const data = JSON.parse(text);
      try { writeFileSync(CACHE, text); } catch { /* cache is optional */ }
      return data;
    }
  } catch { /* offline or slow: fall back */ }
  if (existsSync(CACHE)) return JSON.parse(readFileSync(CACHE, "utf8"));
  return JSON.parse(readFileSync(join(ROOT, "catalog", "repos.json"), "utf8"));
}

function readStdin() {
  return new Promise((resolve) => {
    let buf = "";
    const done = () => { clearTimeout(timer); process.stdin.pause(); resolve(buf); };
    const timer = setTimeout(done, 2000);
    process.stdin.on("data", (d) => (buf += d));
    process.stdin.on("end", done);
  });
}

const norm = (w) => (w.length > 4 && w.endsWith("s") ? w.slice(0, -1) : w);

// Words like "mcp", "agent", "claude" appear in most repos and say little; weight overlaps by IDF so a
// repo has to share a *specific* word with the prompt to be suggested.
export function rank(prompt, repos) {
  const text = prompt.toLowerCase();
  const words = new Set((text.match(/[a-z][a-z0-9.+#-]{2,}/g) || []).filter((w) => !STOP.has(w)).map(norm));
  const hitCats = new Set(Object.entries(config.categories)
    .filter(([, c]) => c.promptKeywords.some((k) => (k.includes(" ") ? text.includes(k) : words.has(norm(k)))))
    .map(([id]) => id));

  const live = repos.filter((r) => r.security?.risk !== "high");
  const df = new Map();
  for (const r of live) for (const k of new Set(r.keywords.map(norm))) df.set(k, (df.get(k) || 0) + 1);
  const idf = (k) => Math.log((live.length + 1) / ((df.get(k) || 0) + 1));
  const specific = Math.log(1 / 0.12); // word must appear in < ~12% of repos

  return live
    .map((r) => {
      const hits = [...new Set(r.keywords.map(norm))].filter((k) => words.has(k)).map(idf);
      const cat = hitCats.has(r.category) ? 1.5 : r.categories.some((c) => hitCats.has(c)) ? 0.5 : 0;
      return { r, score: hits.reduce((a, b) => a + b, 0) + cat + r.gemScore / 100, best: Math.max(0, ...hits) };
    })
    .filter((x) => x.best >= specific && x.score >= MIN_SCORE)
    .sort((a, b) => b.score - a.score)
    .slice(0, TOP)
    .map((x) => x.r);
}

export function format(matches) {
  const lines = matches.map((r) =>
    `- ${r.name} (${r.url}) — ${r.description || "no description"} [${r.category}, ⭐${r.stars}, ${r.license ?? "no license"}, risk: ${r.security.risk}${r.security.flags.length ? ": " + r.security.flags.slice(0, 2).join("; ") : ""}]`);
  return [
    "<repo-radar>",
    "Open-source repos from the Repo Radar catalog that may help with this task:",
    ...lines,
    "Use one only if it clearly improves the result; otherwise ignore this list. Before installing, cloning or running anything from these repos: tell the user which repo and why, read its install/hook/script files yourself, and get the user's OK. Never run curl|bash installers or add hooks/MCP servers without that OK. For a bigger task with no good match here, the repo-radar skill describes a live GitHub search.",
    "</repo-radar>",
  ].join("\n");
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const raw = await readStdin();
  let prompt = "";
  try { prompt = JSON.parse(raw).prompt ?? ""; } catch { prompt = process.argv.slice(2).join(" ") || raw; }
  // No process.exit(): letting Node drain avoids a libuv assertion on Windows; exit code stays 0.
  if (prompt.trim().length >= 15 && !prompt.trim().startsWith("/")) {
    try {
      const { repos } = await loadCatalog();
      const matches = rank(prompt, repos || []);
      if (matches.length) process.stdout.write(format(matches) + "\n");
    } catch { /* a hook must never break the user's prompt */ }
  }
}

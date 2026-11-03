// Static, read-only security triage for a candidate repo. Never clones or executes anything.
// Produces { risk: "low" | "medium" | "high", score, flags[] }. It is a filter, not an audit:
// Claude Code is still told to review code before installing anything.
import { getTree, getFile } from "./github.mjs";

const DAY = 86400000;

// Files that run automatically or with the user's privileges when a Claude Code extension is installed.
const SENSITIVE_FILE = [
  /(^|\/)package\.json$/,
  /(^|\/)hooks\/hooks\.json$/,
  /(^|\/)\.claude\/settings(\.local)?\.json$/,
  /(^|\/)\.mcp\.json$/,
  /(^|\/)install[^/]*\.(sh|ps1|py|js|mjs)$/i,
  /(^|\/)setup\.(sh|py|ps1)$/i,
  /(^|\/)SKILL\.md$/,
  /(^|\/)\.claude-plugin\/plugin\.json$/,
];
const MAX_FILES = 12;

const PATTERNS = [
  { re: /curl[^\n|]*\|\s*(ba|z)?sh|wget[^\n|]*\|\s*(ba|z)?sh|iwr[^\n|]*\|\s*iex|Invoke-Expression/i, weight: 25, flag: "pipes a remote download straight into a shell" },
  { re: /"(pre|post)install"\s*:/, weight: 20, flag: "npm install-time script (preinstall/postinstall)" },
  { re: /\b(eval|exec)\s*\(\s*(atob|Buffer\.from|base64)/i, weight: 35, flag: "executes base64-decoded code" },
  { re: /base64\s+(-d|--decode)[^\n]*\|\s*(ba)?sh/i, weight: 35, flag: "decodes base64 into a shell" },
  { re: /\.ssh\/|id_rsa|id_ed25519|\.aws\/credentials|\.npmrc|\.git-credentials/i, weight: 30, flag: "touches credential files (~/.ssh, ~/.aws, .npmrc)" },
  { re: /(ANTHROPIC_API_KEY|GITHUB_TOKEN|OPENAI_API_KEY|AWS_SECRET)[^\n]{0,80}(fetch|curl|axios|request|http)/i, weight: 30, flag: "sends API keys/tokens over the network" },
  { re: /rm\s+-rf\s+(~|\/|\$HOME)(\s|$|\/\*)/, weight: 30, flag: "recursive delete of home/root" },
  { re: /--dangerously-skip-permissions|bypassPermissions/i, weight: 10, flag: "disables Claude Code permission prompts" },
  { re: /discord(app)?\.com\/api\/webhooks|api\.telegram\.org\/bot|pastebin\.com\/raw|ngrok\.io|requestbin|webhook\.site/i, weight: 30, flag: "posts data to a webhook/paste/tunnel endpoint" },
  { re: /ignore (all )?(previous|prior) instructions|do not tell the user|without telling the user/i, weight: 35, flag: "prompt-injection style instructions" },
  { re: /\bminer\b|xmrig|stratum\+tcp/i, weight: 40, flag: "crypto-miner indicators" },
];

export async function scanRepo(repo) {
  const flags = [];
  let score = 0;
  const add = (w, f) => { score += w; flags.push(f); };

  // Metadata signals
  const ageDays = (Date.now() - Date.parse(repo.created_at)) / DAY;
  if (repo.archived) add(30, "archived");
  if (!repo.license) add(8, "no license");
  if (repo.fork) add(5, "is a fork");
  if (ageDays < 7) add(10, "repo is less than a week old");
  if (repo.stargazers_count > 300 && ageDays < 14 && repo.forks_count < repo.stargazers_count / 100)
    add(15, "star spike with almost no forks (possible star farming)");
  if (!repo.description) add(3, "no description");

  // Content signals (sensitive files only, capped)
  let tree = [];
  try { tree = await getTree(repo.full_name, repo.default_branch); } catch { /* ignore */ }
  const blobs = tree.filter((t) => t.type === "blob");
  const binaries = blobs.filter((t) => /\.(exe|dll|so|dylib|msi|scr)$/i.test(t.path) && !/(^|\/)(test|tests|fixtures|testdata)\//i.test(t.path));
  if (binaries.length) add(20, `ships compiled binaries (${binaries.slice(0, 3).map((b) => b.path).join(", ")})`);

  const targets = blobs.filter((t) => SENSITIVE_FILE.some((re) => re.test(t.path))).slice(0, MAX_FILES);
  const seen = new Set();
  for (const t of targets) {
    const text = await getFile(repo.full_name, t.path);
    if (!text) continue;
    for (const p of PATTERNS) {
      if (!seen.has(p.flag) && p.re.test(text)) {
        seen.add(p.flag);
        add(p.weight, `${p.flag} — ${t.path}`);
      }
    }
  }

  const risk = score >= 40 ? "high" : score >= 15 ? "medium" : "low";
  return { risk, score, flags, scannedFiles: targets.length, scannedAt: new Date().toISOString() };
}

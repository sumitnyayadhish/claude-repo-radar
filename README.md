# 📡 Claude Repo Radar — never miss a new open-source tool for Claude Code

![Claude Repo Radar: new open-source tools for Claude Code, found daily, security-scanned, used automatically](assets/social-preview.png)

[![Daily discovery](https://github.com/sumitnyayadhish/claude-repo-radar/actions/workflows/discover.yml/badge.svg)](https://github.com/sumitnyayadhish/claude-repo-radar/actions/workflows/discover.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Claude Code plugin](https://img.shields.io/badge/Claude%20Code-plugin-orange)](#install-claude-code)
[![Suggest a repo](https://img.shields.io/badge/Suggest-a%20repo-blue)](../../issues/new?template=suggest-repo.yml)

**Stop chasing GitHub links from reels, tweets and YouTube.** New Claude Code MCP servers, skills,
subagents, hooks and plugins come out every day. You don't need to track any of them yourself.

Repo Radar is an **auto-updating awesome list** of hidden open-source repos for Claude Code, plus a
**Claude Code plugin**. Once it's installed, **every task you give Claude Code automatically gets
checked against the newest open-source tools.** Claude picks the right one, security-checks it and
uses it (with your OK), so results go a level up without you lifting a finger.

✅ Updated **every day** automatically · ✅ Every repo **security-scanned** · ✅ Works on **every prompt** · ✅ Free & open source

> रील्स में रोज़ नई "hidden" GitHub repos आती हैं, और सबका track रखना मुश्किल है। Repo Radar यह काम
> अपने-आप करता है: रोज़ नई repos ढूँढता है, security check करता है, और Claude Code में हर task
> के साथ बताता है कि कौन-सी repo से result और अच्छा बनेगा।

## How it works

```
 Daily GitHub Action ──► search GitHub (claude-code, mcp-server, skills, hooks…)
        │                 keep "hidden gems": young, fast-rising, active
        ▼
 Security scan (read-only) ──► 🔴 high risk → quarantine (never suggested)
        │                      🟡 medium → suggested with warnings
        ▼                      🟢 low
 catalog/repos.json ──► plugin auto-updates
        │
        ▼
 You type a task in Claude Code
        │  UserPromptSubmit hook matches it against the catalog
        ▼
 Claude sees the top matches → live GitHub search if nothing fits
        → security-reviews the repo → asks you → uses it → better result
```

- **Auto discovery**: [`discover.yml`](.github/workflows/discover.yml) runs every day.
- **Community + reels**: anyone can open a [Suggest a repo](../../issues/new?template=suggest-repo.yml)
  issue. The bot scans the repo, adds it and closes the issue.
- **Per-task suggestions**: a `UserPromptSubmit` hook adds at most 5 relevant repos to Claude's
  context. It stays silent when nothing matches.
- **Live search**: the `repo-radar` skill tells Claude how to search GitHub live for bigger tasks.
- **Security first**: nothing gets installed or run without your OK. Claude reads install scripts,
  hooks and MCP configs before using anything.

## Install (Claude Code)
<a id="install-claude-code"></a>

```
/plugin marketplace add sumitnyayadhish/claude-repo-radar
/plugin install repo-radar@repo-radar
```

That's it. Every prompt now gets matched against the catalog. To get the newest catalog,
run `/plugin marketplace update repo-radar`. The hook also fetches the newest copy on its own,
once every 12 hours.

**Commands**

| Command | What it does |
|---|---|
| `/repo-radar:find <task>` | Shortlists repos for a task (catalog + live search + security check) |
| `/repo-radar:check <owner/repo>` | Read-only security review before you install something |
| `/repo-radar:add <github-url>` | Suggests a repo you saw in a reel; the bot scans it and adds it |

**No plugin?** Add this line to your project's `CLAUDE.md`:

```
Before substantial tasks, check https://github.com/sumitnyayadhish/claude-repo-radar/blob/main/catalog/CATALOG.md for open-source repos that would improve the result; security-review any repo and ask me before installing it.
```

## Security model

The automated scan ([`scripts/lib/security.mjs`](scripts/lib/security.mjs)) only **reads** repo
metadata and the files that run on install: `package.json`, install scripts, `hooks.json`,
`.claude/settings.json`, `.mcp.json`, `SKILL.md`. It flags:

- `curl | sh` installers, `pre/postinstall` scripts, base64-`eval`
- reads of `~/.ssh`, `~/.aws` or `.npmrc`, and API tokens sent over the network
- webhook/pastebin/tunnel endpoints, `rm -rf ~`, permission bypass flags, compiled binaries
- prompt-injection text ("don't tell the user…"), crypto-miner strings
- archived repos, repos with no license, brand-new repos, star spikes with almost no forks

A high score puts the repo in [quarantine](catalog/quarantine.json). The scan is a **filter, not an
audit**, so Claude is also told to review each repo itself and ask you before installing.

## Run it yourself

```bash
export GITHUB_TOKEN=$(gh auth token)
node scripts/discover.mjs --max-new 80          # discover + scan + rebuild catalog
node scripts/add-repo.mjs https://github.com/owner/repo --source reel   # add by hand
echo '{"prompt":"build a landing page with tailwind"}' | node scripts/suggest.mjs   # test the hook
```

To tune search queries, categories, star/age limits, the blocklist and pinned repos, edit
[`config/radar.json`](config/radar.json).

## Catalog

<!-- RADAR:START -->
_Last updated: 2026-11-03 · 400 repos · 🟢 low risk · 🟡 review before use_

### MCP Servers (102)

| Repo | What it does | Stars | Gem score | Safety |
|---|---|---|---|---|
| [muaaz9329/cheap-ag](https://github.com/muaaz9329/cheap-ag) | 50x your usage with cheap-ag. Opus/Astra plans, a dirt-cheap model writes every line, and tests decide what ships. Your  | ⭐ 241 | 374 | 🟢 |
| [wendersoon/radar-cnpj-mcp](https://github.com/wendersoon/radar-cnpj-mcp) | Servidor MCP e CLI para localizar empresas brasileiras por CNAE e região, utilizando dados abertos de CNPJ da Receita Fe | ⭐ 112 | 333 | 🟢 |
| [beenuar/AiSOC](https://github.com/beenuar/AiSOC) | Open-source AI Security Operations Center: alert fusion, LLM-agent triage, MITRE ATT&CK investigation, and a replayable  | ⭐ 6851 | 304 | 🟡 |
| [INSANE0777/Awwwards-mcp](https://github.com/INSANE0777/Awwwards-mcp) | Free, open-source MCP server that gives AI coding agents (Claude Code, Codex, Cursor, OpenCode, ZCode…) design inspirati | ⭐ 403 | 302 | 🟢 |
| [Tavotto/Tavotto](https://github.com/Tavotto/Tavotto) | AI drew your research figure. Tavotto makes it publication-ready: edit matplotlib and AI-generated figures on a canvas,  | ⭐ 650 | 299 | 🟢 |
| [zordhalo/runs-on.dev](https://github.com/zordhalo/runs-on.dev) | Grab your own cool 'runs-on.dev' subdomain to use for free forever. | ⭐ 516 | 297 | 🟢 |
| [redhat-et/ripwire](https://github.com/redhat-et/ripwire) | The ripgrep of AI context: a zero-dependency C++23 CLI + MCP server for coding agents. Find what you want without readin | ⭐ 2508 | 289 | 🟡 |
| [HamSanders/soundbox](https://github.com/HamSanders/soundbox) | Free, open-source, local alternative to ElevenLabs and Suno. AI sound effects, music with lyrics, text-to-speech and voi | ⭐ 134 | 286 | 🟢 |
| [ZeroDayEvil/ai-security-tool](https://github.com/ZeroDayEvil/ai-security-tool) | 🛡️ Free open-source AI-powered security terminal & vulnerability scanner (CVE, SBOM). Supports SSH, SFTP, RDP, VNC, Ser | ⭐ 1309 | 286 | 🟢 |
| [Rijalmoneyfinder/mcp-game-asset-forge](https://github.com/Rijalmoneyfinder/mcp-game-asset-forge) | MCP: Python Tools for Turning AI Prompts into Game Assets | ⭐ 69 | 281 | 🟢 |

### Skills & Prompts (150)

| Repo | What it does | Stars | Gem score | Safety |
|---|---|---|---|---|
| [reacher-z/Awesome-REA](https://github.com/reacher-z/Awesome-REA) | Awesome Reverse Engineering Anything: tools, projects, case studies and research papers for websites, games, apps, binar | ⭐ 870 | 394 | 🟢 |
| [kaankiziltug/logo-design-skill](https://github.com/kaankiziltug/logo-design-skill) | A comprehensive logo-design skill for Claude, Gemini CLI, Codex and other AI agents: principles, process, SVG craft, tes | ⭐ 5849 | 366 | 🟢 |
| [morganlinton/BeautifulRust](https://github.com/morganlinton/BeautifulRust) | Agent Skills that teach coding agents to write, review, and port idiomatic Rust, plus a tested clippy config. Works with | ⭐ 1691 | 361 | 🟢 |
| [Oldcircle/geo-sleuth](https://github.com/Oldcircle/geo-sleuth) | An agent skill that finds where a photo was taken — OpenStreetMap geometry, elevation skylines, satellite imagery and st | ⭐ 5706 | 357 | 🟢 |
| [FengZhenfei/carrel](https://github.com/FengZhenfei/carrel) | Ontology-Augmented Generation for AI agents.  | ⭐ 705 | 344 | 🟢 |
| [zhuyansen/new-term-radar](https://github.com/zhuyansen/new-term-radar) | Daily radar for new AI terms: names of new models, products and repos, caught on X, Hugging Face, GitHub and sitemaps be | ⭐ 2059 | 342 | 🟢 |
| [trina-app/trina-ax](https://github.com/trina-app/trina-ax) | Set up Claude Code once. Your whole company gets it. Self-hosted Claude Code and Codex with your company files, team ski | ⭐ 112 | 335 | 🟢 |
| [JetBrains/thinkrail](https://github.com/JetBrains/thinkrail) | Vibe code with pi in a lightweight, real IDE that customises itself around the way you work — The Vibe You Need | ⭐ 7315 | 327 | 🟡 |
| [danyuchn/asd-ste100-skill](https://github.com/danyuchn/asd-ste100-skill) | ASD-STE100 Simplified Technical English rules, repurposed as a Claude Code skill for rewriting ambiguous agent-facing En | ⭐ 5988 | 321 | 🟢 |
| [Nanako0129/sepia](https://github.com/Nanako0129/sepia) | De-AI writing skill for any Agent Skills-compatible agent (77+ via the Skills CLI), with native plugins for Claude Code, | ⭐ 3596 | 319 | 🟢 |

### Subagents & Multi-agent (54)

| Repo | What it does | Stars | Gem score | Safety |
|---|---|---|---|---|
| [Louis-CFM/coucou](https://github.com/Louis-CFM/coucou) | A tiny friend in your Mac's notch and on your iPhone that keeps an eye on your AI coding agents: Claude Code, Codex, Cur | ⭐ 6917 | 373 | 🟢 |
| [eduwxyz/tucano](https://github.com/eduwxyz/tucano) | Your team of AI agents, on your Mac, Windows or Linux. Agents that talk in channels, write code, review each other and u | ⭐ 142 | 346 | 🟡 |
| [Orkas-AI/Orkas](https://github.com/Orkas-AI/Orkas) | Orkas is an open-source (MIT), local-first AI team for your desktop: a Commander turns your goal into to-dos and coordin | ⭐ 8939 | 314 | 🟡 |
| [nuphos/nuphos](https://github.com/nuphos/nuphos) | The agent workspace for your team — run, manage and collaborate on coding agents across people, machines and tools. | ⭐ 341 | 312 | 🟡 |
| [loopx-project/loopx](https://github.com/loopx-project/loopx) | Turn long-horizon goals into verifiable results. A local-first semantic control plane and research workbench for long-ru | ⭐ 6542 | 310 | 🟢 |
| [savannahfeder/agentbox](https://github.com/savannahfeder/agentbox) | A desktop GUI for running dozens of Claude Code and Codex agents in parallel, each in its own git worktree. Answer them  | ⭐ 344 | 306 | 🟢 |
| [dagoSte/squadra](https://github.com/dagoSte/squadra) | Coordinate Claude, Codex and Cursor windows with shared tasks, acknowledgements, prechecks, parallel tests, source-bound | ⭐ 1201 | 299 | 🟢 |
| [Sidiora-Labs/paxeer-monorepo](https://github.com/Sidiora-Labs/paxeer-monorepo) | Paxeer X is a Distributed HyperState Machine for payments, code execution and intent routing. Designed for Machines and  | ⭐ 546 | 288 | 🟡 |
| [sno-ai/sno-station](https://github.com/sno-ai/sno-station) | When Claude Code hits its usage limit, Codex picks the task up from the same memory. Sno Station puts Codex, Claude Code | ⭐ 1092 | 282 | 🟡 |
| [open-mercato/cezar](https://github.com/open-mercato/cezar) | Open-source orchestrator and ADE for running Claude Code, Codex, OpenCode, Pi and other AI coding agents in parallel — l | ⭐ 926 | 278 | 🟢 |

### Hooks & Automation (8)

| Repo | What it does | Stars | Gem score | Safety |
|---|---|---|---|---|
| [karanb192/awesome-claude-code-mods](https://github.com/karanb192/awesome-claude-code-mods) | 6,000+ Claude Code mods, with what each one can access before you install it. Context and usage meters, prompt cache war | ⭐ 852 | 339 | 🟢 |
| [GGGODLIN/gggodlin-cc-harness](https://github.com/GGGODLIN/gggodlin-cc-harness) | Governance layer of a personal Claude Code harness: gates, hooks, review and spec-to-ticket workflow. Reference, not a t | ⭐ 73 | 243 | 🟢 |
| [ray-amjad/claude-code-mods](https://github.com/ray-amjad/claude-code-mods) | Claude Code mods: panes, bands, prompt guards, secret handling and memory tools | ⭐ 104 | 202 | 🟢 |
| [heardlabs/heard](https://github.com/heardlabs/heard) | Local, open-source (Apache 2.0) voice layer for Claude Code and Codex on macOS that reads your coding agent's progress a | ⭐ 218 | 190 | 🟢 |
| [neteye-platform/cc-split-diff-view](https://github.com/neteye-platform/cc-split-diff-view) | Claude Code mod that draws Edit and Write diffs in two side-by-side columns | ⭐ 17 | 164 | 🟢 |
| [rennf93/opus-fable-playbook](https://github.com/rennf93/opus-fable-playbook) | Make Claude Opus 4.8 behave like Claude Fable 5 — doctrine output style, drift-catching hooks, and an eval loop against  | ⭐ 34 | 119 | 🟢 |
| [rar-file/claude-rpc](https://github.com/rar-file/claude-rpc) | Discord Rich Presence (RPC) for Claude Code — live model, project, tokens, and lifetime stats in your Discord profile. D | ⭐ 32 | 96 | 🟡 |
| [NathanAB/statuslin.es](https://github.com/NathanAB/statuslin.es) | Community gallery of Claude Code status lines and mods, with previews rendered from their real output. | ⭐ 15 | 79 | 🟢 |

### Plugins & Marketplaces (4)

| Repo | What it does | Stars | Gem score | Safety |
|---|---|---|---|---|
| [Nwflower/dsh-claude-style](https://github.com/Nwflower/dsh-claude-style) | Claude Code Desktop theme for DeepSeek Harness｜ 为 DeepSeek Harness 复刻 Claude Code Desktop 风格与交互体验的主题插件 | ⭐ 445 | 310 | 🟢 |
| [oLucasAguilar/pii-tokens](https://github.com/oLucasAguilar/pii-tokens) | Claude Code plugin: swaps Brazilian personal data (CPF, CNPJ, email, phone) for reversible tokens before Claude reads it | ⭐ 20 | 215 | 🟢 |
| [zkforge/dsh-claude-desktop-theme](https://github.com/zkforge/dsh-claude-desktop-theme) | DSH 桌面端 Claude 风格主题插件 | ⭐ 27 | 175 | 🟢 |
| [gtapps/hermitd](https://github.com/gtapps/hermitd) | Think Claude Tag, but local. | ⭐ 83 | 135 | 🟢 |

### Memory & Context (16)

| Repo | What it does | Stars | Gem score | Safety |
|---|---|---|---|---|
| [synchopate/llama-modchip](https://github.com/synchopate/llama-modchip) | ♟️ llama-modchip v2.1: Run 30B Sparse MoE LLMs on Pure CPU (0 GPUs) at 20–60.4 tok/s with a 256K Context Window via a 1. | ⭐ 71 | 310 | 🟡 |
| [MemTensor/memmy-agent](https://github.com/MemTensor/memmy-agent) | 🍙  A personal AI agent & local memory hub for all AI agents, gives every AI one shared, fully controlled memory and per | ⭐ 2183 | 277 | 🟢 |
| [Asymptote-Labs/agent-beacon](https://github.com/Asymptote-Labs/agent-beacon) | The cross-harness, self-improving memory layer for AI agents. Join our community: https://discord.com/invite/zdNChS2fBu | ⭐ 3180 | 273 | 🟢 |
| [HelpCode-ai/anythingmcp](https://github.com/HelpCode-ai/anythingmcp) | Enterprise Agent Harness & MCP Gateway: connect APIs, databases, file servers and 600+ connectors (SAP, Odoo, Etsy…) to  | ⭐ 771 | 247 | 🟢 |
| [slow-stack/mneme](https://github.com/slow-stack/mneme) | 🧠 The memory that dreams — cross-session memory for DeepSeek Harness. Local SQLite + Markdown mirrors, autoDream consol | ⭐ 206 | 235 | 🟢 |
| [oliver-zehentleitner/keep-the-why](https://github.com/oliver-zehentleitner/keep-the-why) | The why layer of repo-native project memory: the reasoning behind a codebase as Markdown in the repo, versioned by Git,  | ⭐ 233 | 223 | 🟢 |
| [ix-infrastructure/Ix](https://github.com/ix-infrastructure/Ix) | Understand any codebase instantly. System intelligence for codebases, built for humans and AI. | ⭐ 1140 | 213 | 🟡 |
| [lastreload/mnemonic-proxy](https://github.com/lastreload/mnemonic-proxy) | Context management proxy for AI coding agents: verbatim archive, on-demand recall, and saved engine state on supported b | ⭐ 48 | 212 | 🟡 |
| [joshuaswarren/remnic](https://github.com/joshuaswarren/remnic) | Open-source memory and context for user-aware agents: scoped memory, provenance, retrieval quality, correction, boundari | ⭐ 231 | 178 | 🟡 |
| [lobu-ai/lobu](https://github.com/lobu-ai/lobu) | Open-source control plane and runtime for organisational agents: shared company context & brain | ⭐ 233 | 150 | 🟡 |

### Frontend, UI & Design (18)

| Repo | What it does | Stars | Gem score | Safety |
|---|---|---|---|---|
| [feimacode/open-design-agent-kit](https://github.com/feimacode/open-design-agent-kit) | Pro-grade UI design built into the coding agent you already use — GitHub Copilot Chat, Claude Code, Codex, Cursor. 270+  | ⭐ 923 | 349 | 🟢 |
| [Kai-Jungsthoefel/SOMA](https://github.com/Kai-Jungsthoefel/SOMA) | Desktop app for designing parametric 3D models in CadQuery together with the coding agent of your choice | ⭐ 445 | 344 | 🟢 |
| [ccch1mneyyy/dsh-TUI](https://github.com/ccch1mneyyy/dsh-TUI) | DSH's officially top-recommended TUI plugin — high performance, low overhead, cute pixel whale, smooth mouse interaction | ⭐ 6686 | 339 | 🟢 |
| [devswha/ovis](https://github.com/devswha/ovis) | Ovis (formerly herdr web UI): free, open-source browser and phone client for herdr. Chat and live terminal for Claude Co | ⭐ 1835 | 307 | 🟡 |
| [arla6ka/design.how](https://github.com/arla6ka/design.how) | Design systems, skills and visuals for coding agents | ⭐ 238 | 285 | 🟢 |
| [kgoedecke/doop](https://github.com/kgoedecke/doop) | The open-source alternative to Paper.design. A multiplayer design canvas where humans and AI agents design together, liv | ⭐ 1595 | 281 | 🟢 |
| [Manavarya09/design-extract](https://github.com/Manavarya09/design-extract) | Extract any website's complete design system with one command. DTCG tokens, semantic+primitive+composite, MCP server for | ⭐ 4478 | 280 | 🟢 |
| [kayraucklnc/beluga](https://github.com/kayraucklnc/beluga) | Beluga: An AI native IDE Mac app peer to peer connections everything designed around AI development | ⭐ 101 | 277 | 🟡 |
| [get-bb/bb](https://github.com/get-bb/bb) | The agent IDE that builds itself | ⭐ 4844 | 276 | 🟢 |
| [kostja94/bricks](https://github.com/kostja94/bricks) | Component layer for AI agents: implementation-aware contracts for building project-native interface components. | ⭐ 191 | 271 | 🟢 |

### Testing, Review & Quality (5)

| Repo | What it does | Stars | Gem score | Safety |
|---|---|---|---|---|
| [iamumeransari/claude-show-your-work](https://github.com/iamumeransari/claude-show-your-work) | Claude Code plugin to see, review and iterate on your agent's work without leaving the terminal: show images, play video | ⭐ 292 | 316 | 🟢 |
| [owl234/ARL-Next](https://github.com/owl234/ARL-Next) | Modern attack-surface reconnaissance & asset monitoring platform — rebuilt from classic ARL with async decoupled schedul | ⭐ 482 | 235 | 🟢 |
| [proffesor-for-testing/agentic-qe](https://github.com/proffesor-for-testing/agentic-qe) | Agentic QE Fleet is an open-source AI-powered QA/QE platform designed for use with Coding Agents (works best with Claude | ⭐ 522 | 198 | 🟢 |
| [agodianel/esp32-claude-workbench](https://github.com/agodianel/esp32-claude-workbench) | Deterministic AI workflow for ESP32 firmware development — structured missions, implementation contracts, debug playbook | ⭐ 81 | 134 | 🟢 |
| [ncoevoet/claude-review-all](https://github.com/ncoevoet/claude-review-all) | Comprehensive multi-agent code review for Claude Code | ⭐ 44 | 114 | 🟢 |

### Browser, Web & Scraping (1)

| Repo | What it does | Stars | Gem score | Safety |
|---|---|---|---|---|
| [maultxyz/mault](https://github.com/maultxyz/mault) | Open-source trading card sorter. A 3D-printed machine scans each card with your webcam, identifies it in the browser, an | ⭐ 76 | 123 | 🟢 |

### DevOps, Cloud & Infra (5)

| Repo | What it does | Stars | Gem score | Safety |
|---|---|---|---|---|
| [TonF1917/claude-desktop-multiple-windows-different-api](https://github.com/TonF1917/claude-desktop-multiple-windows-different-api) | Multiple windows for Claude Desktop with different APIs at the same time: keep your official Claude subscription in one  | ⭐ 970 | 388 | 🟢 |
| [scaleapi/agentenv-framework](https://github.com/scaleapi/agentenv-framework) | Creating realistic RL environments requires collaboration between researchers, engineers, and domain experts across many | ⭐ 410 | 311 | 🟢 |
| [Dicklesworthstone/destructive_command_guard](https://github.com/Dicklesworthstone/destructive_command_guard) | A fast Rust safety hook that blocks destructive shell, git, and filesystem commands before AI coding agents run them. 50 | ⭐ 6241 | 279 | 🟡 |
| [gotempsh/temps](https://github.com/gotempsh/temps) | AI-native open-source alternative to Vercel + Sentry + PostHog + Pingdom + Resend + E2B. 440+ CLI operations with drop-i | ⭐ 893 | 232 | 🟢 |
| [patrickjaja/claude-desktop-extra](https://github.com/patrickjaja/claude-desktop-extra) | Unofficial Linux packages for Claude Desktop AI assistant with automated updates. | ⭐ 718 | 214 | 🟡 |

### Data, AI & LLM Tools (13)

| Repo | What it does | Stars | Gem score | Safety |
|---|---|---|---|---|
| [respanai/respan-gateway](https://github.com/respanai/respan-gateway) | Open-source LLM gateway in Rust. One endpoint for OpenAI, Anthropic, Gemini and every other vendor. Any SDK, any model,  | ⭐ 510 | 322 | 🟡 |
| [Natively-AI-assistant/natively-cluely-ai-assistant](https://github.com/Natively-AI-assistant/natively-cluely-ai-assistant) | Natively — Free open-source AI meeting assistant, interview copilot, and note taker. The best alternative to Cluely, Ott | ⭐ 3166 | 253 | 🟡 |
| [jgravelle/jcodemunch-mcp](https://github.com/jgravelle/jcodemunch-mcp) | Symbol-level code retrieval for AI agents: fetch the function you need, not the whole file. Runs locally. 94.5% fewer to | ⭐ 2831 | 250 | 🟢 |
| [samuelfaj/distill](https://github.com/samuelfaj/distill) | Get FAR MORE done with FAR FEWER tokens 🔥 | ⭐ 775 | 247 | 🟡 |
| [caura-ai/caura](https://github.com/caura-ai/caura) | Caura (formerly MemClaw) — governed shared memory for AI agent fleets. Multi-agent, multi-tenant, MCP-native. Trust tier | ⭐ 549 | 243 | 🟢 |
| [Syngnat/GoNavi](https://github.com/Syngnat/GoNavi) | High-performance multi-data-source database client — ~30MB, AI & MCP ready, zero Electron bloat. \| 高性能多数据源数据库客户端：约 30MB | ⭐ 2088 | 236 | 🟡 |
| [CoWork-OS/CoWork-OS](https://github.com/CoWork-OS/CoWork-OS) | Rent the model. Own everything else. Free, open-source AI app for real work. | ⭐ 524 | 219 | 🟢 |
| [PBJ-2/clauderipple](https://github.com/PBJ-2/clauderipple) | Use GPT, DeepSeek, GLM, Gemini, Kimi and 400+ models in Claude Desktop's own model picker and in Claude Code, while stay | ⭐ 85 | 210 | 🟡 |
| [sanjay3290/ai-skills](https://github.com/sanjay3290/ai-skills) | 24 cross-platform agent skills for Claude Code, Cursor, Codex & Gemini CLI — databases, messaging, research, TTS, DevOps | ⭐ 450 | 203 | 🟢 |
| [doeixd/foldkit-plus](https://github.com/doeixd/foldkit-plus) | Foldkit Plus: packages for Foldkit apps. Server data (Remote), local-first sync, routing (Site), SSR, forms, CRUD, a CMS | ⭐ 28 | 151 | 🟢 |

### Content, Video & Marketing (2)

| Repo | What it does | Stars | Gem score | Safety |
|---|---|---|---|---|
| [yanhua1010/self-media-content-workflow](https://github.com/yanhua1010/self-media-content-workflow) | Modular, tool-agnostic agent skills for social media content: briefs, trend research, platform-native copy for Xiaohongs | ⭐ 641 | 283 | 🟢 |
| [shalintripathi/saas-marketing-agents](https://github.com/shalintripathi/saas-marketing-agents) | AI marketing agents for Claude Code: a B2B SaaS marketing team as a plugin. 91 agents in 17 disciplines, CATALYST orches | ⭐ 30 | 89 | 🟢 |

### Security & Safety (3)

| Repo | What it does | Stars | Gem score | Safety |
|---|---|---|---|---|
| [Cygnux-Labs/Tracekit](https://github.com/Cygnux-Labs/Tracekit) | Tamper-evident tracing, policy gates and cross-checks for AI agents: see what the agent did, and why. | ⭐ 361 | 306 | 🟢 |
| [inoio/agents-sandbox](https://github.com/inoio/agents-sandbox) | Sandbox for AI coding agents (Claude Code, opencode, pi): runs each project in an isolated microVM with host-side secret | ⭐ 83 | 192 | 🟢 |
| [gebruder/wirken](https://github.com/gebruder/wirken) | The enterprise gateway for autonomous agents. Identity management, per-channel isolation, credential vault, per-session  | ⭐ 194 | 179 | 🟡 |

### Usage, UI & Productivity for Claude Code (19)

| Repo | What it does | Stars | Gem score | Safety |
|---|---|---|---|---|
| [kenn-io/agentsview](https://github.com/kenn-io/agentsview) | Local-first session search, analytics, insights, and token use statistics for coding agents, supporting Claude Code, Cod | ⭐ 6336 | 287 | 🟡 |
| [lovecake19ngoctran/claude-desktop-profiles](https://github.com/lovecake19ngoctran/claude-desktop-profiles) | Claude Desktop Profiles: Multi-Account Manager for macOS | ⭐ 58 | 272 | 🟢 |
| [Nanako0129/syrtis](https://github.com/Nanako0129/syrtis) | AI token usage & quota monitor for the macOS menu bar — native Swift, Liquid Glass, 3D contribution graph. Tracks Claude | ⭐ 509 | 253 | 🟢 |
| [ntd4996/agentpet](https://github.com/ntd4996/agentpet) | A desktop pet for macOS & Windows that monitors your AI coding agents (Claude Code, Codex, Cursor, Gemini...) in real ti | ⭐ 398 | 235 | 🟡 |
| [datlechin/pitboard](https://github.com/datlechin/pitboard) | Switch AI coding tools between your accounts. App and command line for macOS, Windows and Linux. | ⭐ 108 | 235 | 🟢 |
| [skyline-e/Local-AI-Route](https://github.com/skyline-e/Local-AI-Route) | Local-AI-Route 是一款专为全平台桌面 AI 应用打造的轻量级、免全局 TUN、免改系统代理的进程级本地代理启动与管理工具，开箱原生深度适配ChatGPT App、Antigravity App/IDE、Claude App、G | ⭐ 16 | 226 | 🟢 |
| [aqua5230/usage](https://github.com/aqua5230/usage) | macOS menu bar & Windows tray app pinning Claude Code, Codex, Antigravity & Grok CLI quota, burn rate, and cost to your  | ⭐ 345 | 224 | 🟢 |
| [rsaryev/tokendoctor](https://github.com/rsaryev/tokendoctor) | Claude Code plugin: see where your tokens go, audit your setup against the docs, and tune settings with an approved diff | ⭐ 19 | 218 | 🟢 |
| [JayantDevkar/claude-code-karma](https://github.com/JayantDevkar/claude-code-karma) | Dashboard for monitoring claude code sessions.  | ⭐ 337 | 191 | 🟢 |
| [SnlperStripes/claude-account-switcher](https://github.com/SnlperStripes/claude-account-switcher) | Use multiple Claude accounts in the Claude desktop app: switch in one click without the email code, keep Claude Code cha | ⭐ 44 | 190 | 🟢 |

➡️ [See the full catalog](catalog/CATALOG.md)
<!-- RADAR:END -->

## FAQ

**What is the best way to find new Claude Code MCP servers, skills and plugins?**
Install Repo Radar. It searches GitHub every day for new `claude-code`, `mcp-server`,
`claude-skills`, `agent-skills` and hooks/subagents repos, and keeps the fast-rising hidden gems.

**Do I have to keep track of the GitHub repos I see in Instagram reels or YouTube videos?**
No. Most of them get picked up automatically. For one that doesn't, open a
[Suggest a repo](../../issues/new?template=suggest-repo.yml) issue or run `/repo-radar:add <link>`.
The bot scans it and adds it.

**Does Claude Code use these repos automatically?**
Yes, for matching tasks. The plugin adds the most relevant repos to every prompt, and for bigger
tasks Claude also searches GitHub live. It still asks you before installing or running anything.

**Is it safe to install random open-source Claude Code plugins and MCP servers?**
Not blindly, which is why every repo here is scanned first: for malicious install scripts,
credential theft, data exfiltration, prompt injection and fake stars. High-risk repos are
quarantined. Claude also reviews each repo itself before using it.

**Is this an awesome-claude-code list?**
Yes, but one that maintains itself: [the catalog](catalog/CATALOG.md) is rebuilt daily, ranked by
"gem score" (star velocity × freshness), and grouped by category.

## Contributing

Suggest repos with the issue form. To improve the scanner or matching, open a PR. Add false
positives to `blocklist` in `config/radar.json`.

MIT License.

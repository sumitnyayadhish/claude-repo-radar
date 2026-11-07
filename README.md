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
_Last updated: 2026-11-07 · 400 repos · 🟢 low risk · 🟡 review before use_

### MCP Servers (91)

| Repo | What it does | Stars | Gem score | Safety |
|---|---|---|---|---|
| [KKKKhazix/agent-autoloop](https://github.com/KKKKhazix/agent-autoloop) | 让你的命令行 Agent 在后台自己接活、自己跟进到底；平时不烦你，遇到拿不准的事才发卡片找你拍板。 | ⭐ 3837 | 421 | 🟢 |
| [muaaz9329/cheap-ag](https://github.com/muaaz9329/cheap-ag) | 50x your usage with cheap-ag. Opus/Astra plans, a dirt-cheap model writes every line, and tests decide what ships. Your  | ⭐ 310 | 373 | 🟢 |
| [emanuele-em/kanzo](https://github.com/emanuele-em/kanzo) | Self-hosted, sharable kanban for humans and agents. One 4.7 MB binary, 5 MB of RAM, 10 to 60 tokens per agent reply, sta | ⭐ 1080 | 335 | 🟢 |
| [kajisho5/ffmpeg-skill](https://github.com/kajisho5/ffmpeg-skill) | Local video editor for coding agents: 42 FFmpeg tools with a machine-readable contract and an MCP server, for Claude Cod | ⭐ 4705 | 334 | 🟢 |
| [wendersoon/radar-cnpj-mcp](https://github.com/wendersoon/radar-cnpj-mcp) | Servidor MCP e CLI para localizar empresas brasileiras por CNAE e região, utilizando dados abertos de CNPJ da Receita Fe | ⭐ 129 | 319 | 🟢 |
| [INSANE0777/Awwwards-mcp](https://github.com/INSANE0777/Awwwards-mcp) | Free, open-source MCP server that gives AI coding agents (Claude Code, Codex, Cursor, OpenCode, ZCode…) design inspirati | ⭐ 496 | 309 | 🟢 |
| [beenuar/AiSOC](https://github.com/beenuar/AiSOC) | Open-source AI Security Operations Center: alert fusion, LLM-agent triage, MITRE ATT&CK investigation, and a replayable  | ⭐ 6676 | 302 | 🟡 |
| [sepehr071/iran-mcp](https://github.com/sepehr071/iran-mcp) | 77 MCP servers (994 tools) that give AI agents the Iranian web: Digikala, Torob, Divar, Snappfood, Alibaba, Neshan, Pazi | ⭐ 230 | 301 | 🟢 |
| [Tavotto/Tavotto](https://github.com/Tavotto/Tavotto) | AI drew your research figure. Tavotto makes it publication-ready: edit matplotlib and AI-generated figures on a canvas,  | ⭐ 672 | 298 | 🟢 |
| [zordhalo/runs-on.dev](https://github.com/zordhalo/runs-on.dev) | Grab your own cool 'runs-on.dev' subdomain to use for free forever. | ⭐ 533 | 296 | 🟢 |

### Skills & Prompts (148)

| Repo | What it does | Stars | Gem score | Safety |
|---|---|---|---|---|
| [JuneYaooo/rea-video](https://github.com/JuneYaooo/rea-video) | Reverse-engineer any video, shot by shot: tells whether each shot was filmed, AI-generated or coded, how the captions, c | ⭐ 3382 | 406 | 🟢 |
| [mhfed/vn-law-check](https://github.com/mhfed/vn-law-check) | Audit pháp lý website theo luật Việt Nam (BVDLCN 91/2025, TMĐT 122/2025, ANM 116/2025, AI 134/2025) cho Claude Code, Cur | ⭐ 465 | 399 | 🟡 |
| [kyy-logs/code-review-skill](https://github.com/kyy-logs/code-review-skill) | Auditable code review skill for Claude Code and Codex: four independent probes, evidence-backed findings, and a JSON-der | ⭐ 347 | 382 | 🟢 |
| [HeyChengC/wallstreet-explainer](https://github.com/HeyChengC/wallstreet-explainer) | 华尔街式财经/科技解读短片 skill：设计思路、风格语言，以及找片、截图、配音、渲染和混音工具。 | ⭐ 623 | 359 | 🟢 |
| [kaankiziltug/logo-design-skill](https://github.com/kaankiziltug/logo-design-skill) | A comprehensive logo-design skill for Claude, Gemini CLI, Codex and other AI agents: principles, process, SVG craft, tes | ⭐ 6204 | 358 | 🟢 |
| [QingYunA/answer-me-with-html](https://github.com/QingYunA/answer-me-with-html) | Answer me with HTML — an agent skill that answers hard questions with a one-page HTML you can actually read. 让 AI Agent  | ⭐ 5950 | 357 | 🟢 |
| [Oldcircle/geo-sleuth](https://github.com/Oldcircle/geo-sleuth) | An agent skill that finds where a photo was taken — OpenStreetMap geometry, elevation skylines, satellite imagery and st | ⭐ 6364 | 346 | 🟢 |
| [daveebbelaar/bama](https://github.com/daveebbelaar/bama) | BAMA: Build Any Mac App. Agent skills to research, clone, design, build, optimize, and test native macOS apps with Swift | ⭐ 1653 | 344 | 🟢 |
| [sno-ai/sno-station-skills](https://github.com/sno-ai/sno-station-skills) | Sno Station Skills: 31 tested skills that turn Claude Code and Codex into one working team. Cross-vendor peer review, au | ⭐ 861 | 340 | 🟢 |
| [FengZhenfei/carrel](https://github.com/FengZhenfei/carrel) | Ontology-Augmented Generation for AI agents.  | ⭐ 801 | 332 | 🟢 |

### Subagents & Multi-agent (53)

| Repo | What it does | Stars | Gem score | Safety |
|---|---|---|---|---|
| [Louis-CFM/coucou](https://github.com/Louis-CFM/coucou) | A tiny friend in your Mac's notch and on your iPhone that keeps an eye on your AI coding agents: Claude Code, Codex, Cur | ⭐ 7026 | 366 | 🟢 |
| [eduwxyz/tucano](https://github.com/eduwxyz/tucano) | Your team of AI agents, on your Mac, Windows or Linux. Agents that talk in channels, write code, review each other and u | ⭐ 268 | 360 | 🟡 |
| [sno-ai/sno-station](https://github.com/sno-ai/sno-station) | When Claude Code hits its usage limit, Codex picks the task up from the same memory. Sno Station puts Codex, Claude Code | ⭐ 985 | 346 | 🟡 |
| [Kemerd/claude-hardware-in-the-loop](https://github.com/Kemerd/claude-hardware-in-the-loop) | Agent-driven hardware-in-the-loop engineering method: Claude Code skill, swarm orchestration, generator-first KiCad PCB  | ⭐ 81 | 316 | 🟢 |
| [Orkas-AI/Orkas](https://github.com/Orkas-AI/Orkas) | Orkas is an open-source (MIT), local-first AI team for your desktop: a Commander turns your goal into to-dos and coordin | ⭐ 9078 | 313 | 🟡 |
| [nuphos/nuphos](https://github.com/nuphos/nuphos) | The agent workspace for your team — run, manage and collaborate on coding agents across people, machines and tools. | ⭐ 372 | 311 | 🟡 |
| [loopx-project/loopx](https://github.com/loopx-project/loopx) | Turn long-horizon goals into verifiable results. A local-first semantic control plane and research workbench for long-ru | ⭐ 6558 | 309 | 🟢 |
| [savannahfeder/agentbox](https://github.com/savannahfeder/agentbox) | A desktop GUI for running dozens of Claude Code and Codex agents in parallel, each in its own git worktree. Answer them  | ⭐ 370 | 304 | 🟢 |
| [synchopate/llama-modchip](https://github.com/synchopate/llama-modchip) | 🐋 Run 284B DeepSeek-V4-Flash (<59GiB RAM, 44.4 tok/s pp, 9.1-14.7 tok/s) & 30B MoEs (25-111 tok/s) on a pure 64GB CPU a | ⭐ 84 | 297 | 🟡 |
| [dagoSte/squadra](https://github.com/dagoSte/squadra) | Coordinate Claude, Codex and Cursor windows with shared tasks, acknowledgements, prechecks, parallel tests, source-bound | ⭐ 1065 | 286 | 🟢 |

### Hooks & Automation (8)

| Repo | What it does | Stars | Gem score | Safety |
|---|---|---|---|---|
| [karanb192/awesome-claude-code-mods](https://github.com/karanb192/awesome-claude-code-mods) | 6,000+ Claude Code mods, with what each one can access before you install it. Context and usage meters, prompt cache war | ⭐ 887 | 337 | 🟢 |
| [wecode-ai/Wegent](https://github.com/wecode-ai/Wegent) | Plan, build, and deliver with an open-source, self-hostable AI workspace for coding, collaboration, and automation. | ⭐ 885 | 243 | 🟢 |
| [GGGODLIN/gggodlin-cc-harness](https://github.com/GGGODLIN/gggodlin-cc-harness) | Governance layer of a personal Claude Code harness: gates, hooks, review and spec-to-ticket workflow. Reference, not a t | ⭐ 73 | 231 | 🟢 |
| [baonguyen-agilityio/bobix](https://github.com/baonguyen-agilityio/bobix) | Your Claude Code sessions as little pixel pets on your screen: see who is working, who needs you and who is done. macOS, | ⭐ 16 | 230 | 🟢 |
| [mishoko/claude-code-recursive-delete-guard](https://github.com/mishoko/claude-code-recursive-delete-guard) | Claude Code hook that blocks unquoted rm -rf $VAR and repo-root deletes, even in bypassPermissions mode | ⭐ 16 | 223 | 🟢 |
| [ray-amjad/claude-code-mods](https://github.com/ray-amjad/claude-code-mods) | Claude Code mods: panes, bands, prompt guards, secret handling and memory tools | ⭐ 109 | 211 | 🟢 |
| [karanb192/claude-code-hooks](https://github.com/karanb192/claude-code-hooks) | 🪝 Claude Code hooks + an installable plugin marketplace: safety, cost, observability, productivity. | ⭐ 577 | 205 | 🟡 |
| [PrimeFoldTools/Andon](https://github.com/PrimeFoldTools/Andon) | Stop hooks that stop AI coding agents (Claude Code, Codex) from claiming "done" without proof. A Lean quality system: ev | ⭐ 168 | 195 | 🟢 |

### Plugins & Marketplaces (5)

| Repo | What it does | Stars | Gem score | Safety |
|---|---|---|---|---|
| [Nwflower/dsh-claude-style](https://github.com/Nwflower/dsh-claude-style) | Claude Code Desktop theme for DeepSeek Harness｜ 为 DeepSeek Harness 复刻 Claude Code Desktop 风格与交互体验的主题插件 | ⭐ 511 | 312 | 🟢 |
| [NahumLitvin/prismantis](https://github.com/NahumLitvin/prismantis) | Colorful, themeable Claude Code replies: tables, code, diagrams, charts and tool rows in 15 themes, with copy buttons. A | ⭐ 318 | 303 | 🟢 |
| [gmickel/flow-next](https://github.com/gmickel/flow-next) | Faster than your agent alone. And better. A workflow plugin that takes a bug, idea or ticket to a verified pull request: | ⭐ 718 | 227 | 🟢 |
| [quemsah/awesome-claude-plugins](https://github.com/quemsah/awesome-claude-plugins) | Automated index of Claude Code plugins and adoption metrics across GitHub repositories, powered by a Node.js/TypeScript  | ⭐ 1555 | 210 | 🟢 |
| [oLucasAguilar/pii-tokens](https://github.com/oLucasAguilar/pii-tokens) | Claude Code plugin: swaps Brazilian personal data (CPF, CNPJ, email, phone) for reversible tokens before Claude reads it | ⭐ 20 | 193 | 🟢 |

### Memory & Context (12)

| Repo | What it does | Stars | Gem score | Safety |
|---|---|---|---|---|
| [MemTensor/memmy-agent](https://github.com/MemTensor/memmy-agent) | 🍙  A personal AI agent & local memory hub for all AI agents, gives every AI one shared, fully controlled memory and per | ⭐ 2203 | 276 | 🟢 |
| [Asymptote-Labs/agent-beacon](https://github.com/Asymptote-Labs/agent-beacon) | The cross-harness, self-improving memory layer for AI agents. Join our community: https://discord.com/invite/zdNChS2fBu | ⭐ 3363 | 275 | 🟢 |
| [HelpCode-ai/anythingmcp](https://github.com/HelpCode-ai/anythingmcp) | Enterprise Agent Harness & MCP Gateway: connect APIs, databases, file servers and 600+ connectors (SAP, Odoo, Etsy…) to  | ⭐ 756 | 245 | 🟢 |
| [slow-stack/mneme](https://github.com/slow-stack/mneme) | 🧠 The memory that dreams — cross-session memory for DeepSeek Harness. Local SQLite + Markdown mirrors, autoDream consol | ⭐ 216 | 235 | 🟢 |
| [mex-memory/mex](https://github.com/mex-memory/mex) | Team memory for engineers and their AI agents. Lives in your repo. Shared through Git. | ⭐ 1794 | 227 | 🟢 |
| [EternalNight996/memory-eternal](https://github.com/EternalNight996/memory-eternal) | Your AI forgets every session. Give it a memory it can trust: local-first, review-gated agent memory — one SQLite vault  | ⭐ 147 | 227 | 🟢 |
| [activeloopai/hivemind](https://github.com/activeloopai/hivemind) | Hivemind turns your traces into reusable skills across agents | ⭐ 1648 | 224 | 🟢 |
| [oliver-zehentleitner/keep-the-why](https://github.com/oliver-zehentleitner/keep-the-why) | The why layer of repo-native project memory: the reasoning behind a codebase as Markdown in the repo, versioned by Git,  | ⭐ 234 | 220 | 🟢 |
| [AallamR/RobloxForge-Intelligence](https://github.com/AallamR/RobloxForge-Intelligence) | RobloxForge Docs 2026: Official MCP Vertical Slice Verification Layer for Studio | ⭐ 75 | 213 | 🟢 |
| [lastreload/mnemonic-proxy](https://github.com/lastreload/mnemonic-proxy) | Context management proxy for AI coding agents: verbatim archive, on-demand recall, and saved engine state on supported b | ⭐ 57 | 212 | 🟡 |

### Frontend, UI & Design (21)

| Repo | What it does | Stars | Gem score | Safety |
|---|---|---|---|---|
| [abdiraimov-otabek/dashboard-design-skill](https://github.com/abdiraimov-otabek/dashboard-design-skill) | A Claude Code skill for clean, honest dashboard UI: KPI tiles, charts, date pickers, ranked lists, states, layouts and a | ⭐ 400 | 352 | 🟢 |
| [ccch1mneyyy/dsh-TUI](https://github.com/ccch1mneyyy/dsh-TUI) | DSH's officially top-recommended TUI plugin — high performance, low overhead, cute pixel whale, smooth mouse interaction | ⭐ 7123 | 339 | 🟢 |
| [Kai-Jungsthoefel/SOMA](https://github.com/Kai-Jungsthoefel/SOMA) | Desktop app for designing parametric 3D models in CadQuery together with the coding agent of your choice | ⭐ 460 | 321 | 🟢 |
| [devswha/ovis](https://github.com/devswha/ovis) | Ovis (formerly herdr web UI): free, open-source browser and phone client for herdr. Chat and live terminal for Claude Co | ⭐ 1931 | 306 | 🟡 |
| [mattabate/life-distributable](https://github.com/mattabate/life-distributable) | A personal agent that works on your life around the clock, on a Mac you own. One sentence to Claude Code installs it. | ⭐ 344 | 298 | 🟢 |
| [kayraucklnc/beluga](https://github.com/kayraucklnc/beluga) | Beluga: An AI native IDE Mac app peer to peer connections everything designed around AI development | ⭐ 153 | 287 | 🟡 |
| [kgoedecke/doop](https://github.com/kgoedecke/doop) | The open-source alternative to Paper.design. A multiplayer design canvas where humans and AI agents design together, liv | ⭐ 1813 | 283 | 🟢 |
| [arla6ka/design.how](https://github.com/arla6ka/design.how) | Design systems, skills and visuals for coding agents | ⭐ 268 | 282 | 🟢 |
| [feimacode/open-design-agent-kit](https://github.com/feimacode/open-design-agent-kit) | Make posters, social posts, slides and landing pages in the coding agent or chat you already use (Copilot, Claude, Codex | ⭐ 1040 | 280 | 🟢 |
| [get-bb/bb](https://github.com/get-bb/bb) | The agent IDE that builds itself | ⭐ 4997 | 276 | 🟢 |

### Testing, Review & Quality (5)

| Repo | What it does | Stars | Gem score | Safety |
|---|---|---|---|---|
| [iamumeransari/claude-show-your-work](https://github.com/iamumeransari/claude-show-your-work) | Claude Code plugin to see, review and iterate on your agent's work without leaving the terminal: show images, play video | ⭐ 298 | 300 | 🟢 |
| [owl234/ARL-Next](https://github.com/owl234/ARL-Next) | Modern attack-surface reconnaissance & asset monitoring platform — rebuilt from classic ARL with async decoupled schedul | ⭐ 502 | 229 | 🟢 |
| [brandonmcconnell/geld](https://github.com/brandonmcconnell/geld) | Browser extension to hide tests when reviewing PRs on Github | ⭐ 104 | 212 | 🟡 |
| [demoos415/lua-script-bridge](https://github.com/demoos415/lua-script-bridge) | AI-Powered Roblox Luau Code Execution Server for Live Game Testing 2026 | ⭐ 69 | 208 | 🟢 |
| [proffesor-for-testing/agentic-qe](https://github.com/proffesor-for-testing/agentic-qe) | Agentic QE Fleet is an open-source AI-powered QA/QE platform designed for use with Coding Agents (works best with Claude | ⭐ 524 | 196 | 🟢 |

### DevOps, Cloud & Infra (6)

| Repo | What it does | Stars | Gem score | Safety |
|---|---|---|---|---|
| [TonF1917/claude-desktop-multiple-windows-different-api](https://github.com/TonF1917/claude-desktop-multiple-windows-different-api) | Multiple windows for Claude Desktop with different APIs at the same time: keep your official Claude subscription in one  | ⭐ 977 | 363 | 🟢 |
| [scaleapi/agentenv-framework](https://github.com/scaleapi/agentenv-framework) | Creating realistic RL environments requires collaboration between researchers, engineers, and domain experts across many | ⭐ 417 | 307 | 🟢 |
| [Dicklesworthstone/destructive_command_guard](https://github.com/Dicklesworthstone/destructive_command_guard) | A fast Rust safety hook that blocks destructive shell, git, and filesystem commands before AI coding agents run them. 50 | ⭐ 6286 | 279 | 🟡 |
| [gotempsh/temps](https://github.com/gotempsh/temps) | AI-native open-source alternative to Vercel + Sentry + PostHog + Pingdom + Resend + E2B. 440+ CLI operations with drop-i | ⭐ 904 | 232 | 🟢 |
| [patrickjaja/claude-desktop-extra](https://github.com/patrickjaja/claude-desktop-extra) | Unofficial Linux packages for Claude Desktop AI assistant with automated updates. | ⭐ 731 | 214 | 🟡 |
| [ajithakdev/claude-desktop-rpm](https://github.com/ajithakdev/claude-desktop-rpm) | Install Anthropic's official Claude Desktop on Fedora: verified, unmodified, no root, auto-updates. Fixes dark mode, Cow | ⭐ 21 | 205 | 🟢 |

### Data, AI & LLM Tools (20)

| Repo | What it does | Stars | Gem score | Safety |
|---|---|---|---|---|
| [YOLOW92/pagesift](https://github.com/YOLOW92/pagesift) | Self-hosted web scraper, crawler and document parser for AI agents: URLs, PDFs with OCR and Office files to clean Markdo | ⭐ 248 | 326 | 🟢 |
| [respanai/respan-gateway](https://github.com/respanai/respan-gateway) | Open-source LLM gateway in Rust. One endpoint for OpenAI, Anthropic, Gemini and every other vendor. Any SDK, any model,  | ⭐ 595 | 325 | 🟡 |
| [gakonst/nanocode](https://github.com/gakonst/nanocode) | SDK for Frontier Embedded Agents. | ⭐ 653 | 279 | 🟢 |
| [ruc-datalab/EvoOntology](https://github.com/ruc-datalab/EvoOntology) | EvoOntology: A Self-Evolving Ontology Layer for Data Agents ⚙️ EvoOntology插件为Claude Code/Codex 建立&进化本体层 | ⭐ 1166 | 277 | 🟢 |
| [raullenchai/Rapid-MLX](https://github.com/raullenchai/Rapid-MLX) | Rapid-MLX is an open-source (Apache 2.0) OpenAI- and Anthropic-compatible LLM inference server for Apple Silicon, built  | ⭐ 4107 | 268 | 🟡 |
| [ruvnet/RuVector](https://github.com/ruvnet/RuVector) | RuVector provides High Performance, Real-Time decisions and agent memory , Self-Learning Ai, Vector GNN DB built in Rust | ⭐ 4672 | 259 | 🟡 |
| [Natively-AI-assistant/natively-cluely-ai-assistant](https://github.com/Natively-AI-assistant/natively-cluely-ai-assistant) | Natively — Free open-source AI meeting assistant, interview copilot, and note taker. The best alternative to Cluely, Ott | ⭐ 3203 | 251 | 🟡 |
| [kitfunso/hippo-memory](https://github.com/kitfunso/hippo-memory) | Stop re-teaching your agent. Make your agent's memory work like a brain. Hippo is long-term memory for coding agents. It | ⭐ 790 | 250 | 🟢 |
| [jgravelle/jcodemunch-mcp](https://github.com/jgravelle/jcodemunch-mcp) | Symbol-level code retrieval for AI agents: fetch the function you need, not the whole file. Runs locally. 94.5% fewer to | ⭐ 2836 | 249 | 🟢 |
| [410979729/scope-recall-hermes](https://github.com/410979729/scope-recall-hermes) | Local long-term memory for Hermes, Codex, Claude Code, WorkBuddy and dsh agents: one SQLite store, source-backed recall, | ⭐ 533 | 245 | 🟢 |

### Content, Video & Marketing (5)

| Repo | What it does | Stars | Gem score | Safety |
|---|---|---|---|---|
| [yanhua1010/self-media-content-workflow](https://github.com/yanhua1010/self-media-content-workflow) | Modular, tool-agnostic agent skills for social media content: briefs, trend research, platform-native copy for Xiaohongs | ⭐ 650 | 264 | 🟢 |
| [Shalaby-VBS/tube-scholar](https://github.com/Shalaby-VBS/tube-scholar) | Turn any YouTube video into a bilingual (Arabic/English) study guide: timestamped explanation, 5-minute summary, animate | ⭐ 25 | 253 | 🟢 |
| [Ootto-AI/claude-content-skills](https://github.com/Ootto-AI/claude-content-skills) | Free, copy-paste Claude skills that run your content growth factory — turn ideas + your NotebookLM memory into scroll-st | ⭐ 407 | 241 | 🟢 |
| [AeternaLabsHQ/pullmd](https://github.com/AeternaLabsHQ/pullmd) | Self-hosted URL- and file-to-Markdown service for humans and AI agents - web pages, documents, images, audio, YouTube. P | ⭐ 518 | 231 | 🟢 |
| [lj1270998580-crypto/Agnes-help-skill](https://github.com/lj1270998580-crypto/Agnes-help-skill) | Agnes AI 全模态 API 非官方帮助中心：完整 API 文档 + 通用支持 Skill。已同步 Agnes 3.0 Flash（512K 上下文 / 65,536 输出 / 三端点 / Thinking）与 Image 2.5 Fl | ⭐ 313 | 224 | 🟢 |

### Security & Safety (2)

| Repo | What it does | Stars | Gem score | Safety |
|---|---|---|---|---|
| [Cygnux-Labs/Tracekit](https://github.com/Cygnux-Labs/Tracekit) | Tamper-evident tracing, policy gates and cross-checks for AI agents: see what the agent did, and why. | ⭐ 497 | 319 | 🟢 |
| [kenryu42/cc-safety-net](https://github.com/kenryu42/cc-safety-net) | A pre-execution guard for AI coding agents. It blocks destructive Git and file system commands, plus common attempts to  | ⭐ 1942 | 222 | 🟢 |

### Usage, UI & Productivity for Claude Code (24)

| Repo | What it does | Stars | Gem score | Safety |
|---|---|---|---|---|
| [sv3nbeast/agent-manager-lite](https://github.com/sv3nbeast/agent-manager-lite) | macOS 上的 Codex、Claude Code CLI 与 Claude Desktop 多实例管理器，统一管理账号、供应商密钥、独立配置、会话与代理。 / A macOS manager for Codex, Claude Code | ⭐ 545 | 324 | 🟢 |
| [onurozcan/omux](https://github.com/onurozcan/omux) | The native agentic development platform for the Mac: a 5 MB terminal that runs fleets of Claude Code and Codex sessions  | ⭐ 130 | 317 | 🟢 |
| [data-goblin/claude-code-filetree](https://github.com/data-goblin/claude-code-filetree) | IDE-style file tree for Claude Code: a live pane that shows which files Claude reads and edits, with git status, diffs,  | ⭐ 388 | 313 | 🟢 |
| [jazzenchen/agent-hud-open](https://github.com/jazzenchen/agent-hud-open) | A HUD for Claude Code, Codex and 25 more coding agents. Know your quotas, tokens and sessions at a glance, answer reques | ⭐ 127 | 292 | 🟢 |
| [kenn-io/agentsview](https://github.com/kenn-io/agentsview) | Local-first session search, analytics, insights, and token use statistics for coding agents, supporting Claude Code, Cod | ⭐ 6395 | 287 | 🟡 |
| [realiti4/claude-swap](https://github.com/realiti4/claude-swap) | Switch between multiple Claude Code accounts, with automatic rate-limit rotation, usage dashboard, and parallel sessions | ⭐ 4513 | 266 | 🟢 |
| [Gaurav-Gosain/tuios](https://github.com/Gaurav-Gosain/tuios) | A terminal window manager that knows what your agents are doing. Tiling panes, workspaces, sessions that survive restart | ⭐ 6405 | 265 | 🟡 |
| [lovecake19ngoctran/claude-desktop-profiles](https://github.com/lovecake19ngoctran/claude-desktop-profiles) | Claude Desktop Profiles: Multi-Account Manager for macOS | ⭐ 58 | 255 | 🟢 |
| [rsaryev/tokendoctor](https://github.com/rsaryev/tokendoctor) | Claude Code plugin: see where your tokens go, audit your setup against the docs, and tune settings with an approved diff | ⭐ 49 | 254 | 🟢 |
| [Nanako0129/syrtis](https://github.com/Nanako0129/syrtis) | AI token usage & quota monitor for the macOS menu bar — native Swift, Liquid Glass, 3D contribution graph. Tracks Claude | ⭐ 512 | 252 | 🟢 |

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

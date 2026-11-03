---
description: Security-check a GitHub repo before installing it into Claude Code
argument-hint: <owner/repo or github url>
---

Security-check this repo before I use it: $ARGUMENTS

Follow step 3 of the repo-radar skill. Read the files only; do not clone-and-run, install or execute anything.
Report a verdict (safe to try / review first / avoid), every red flag with its file path, and which commit SHA to pin if I install it.

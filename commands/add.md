---
description: Suggest a repo (e.g. one you saw in a reel) for the public Repo Radar catalog
argument-hint: <github url(s)> [where you saw it]
---

I want to suggest this for the Repo Radar catalog: $ARGUMENTS

1. Pull out the GitHub repo link(s). If I gave only a reel/video link or a name, find the matching GitHub repo first and confirm it with me.
2. Run a quick security check (repo-radar skill, step 3) and tell me the result.
3. Show me the issue you'll open, then after I say yes run:
   `gh issue create --repo sumitnyayadhish/claude-repo-radar --label repo-suggestion --title "Suggest: <owner/repo>" --body "<links and where I saw it>"`
   The Repo Radar bot scans it and adds it to the catalog automatically.

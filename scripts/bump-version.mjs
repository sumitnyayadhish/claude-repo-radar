#!/usr/bin/env node
// Bump the plugin patch version so `/plugin marketplace update` delivers the new catalog to users.
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { ROOT } from "./lib/catalog.mjs";

for (const file of ["plugin.json", "marketplace.json"]) {
  const path = join(ROOT, ".claude-plugin", file);
  const json = JSON.parse(readFileSync(path, "utf8"));
  const target = file === "plugin.json" ? json : json.plugins[0];
  const [maj, min, patch] = target.version.split(".").map(Number);
  target.version = `${maj}.${min}.${patch + 1}`;
  writeFileSync(path, JSON.stringify(json, null, 2) + "\n");
  console.log(`${file}: ${target.version}`);
}

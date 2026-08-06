import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { execSync } from "node:child_process";
import { readdirSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";

const ROOT_ECOSYSTEM = "Avalanche";
const MIN_REPOS = 6;
const OUT = resolve(process.cwd(), "data/avalanche-owners.json");
const TARBALL =
  "https://codeload.github.com/electric-capital/crypto-ecosystems/tar.gz/refs/heads/master";

function tokenize(line: string): string[] {
  const out: string[] = [];
  let current = "";
  let quote: string | null = null;

  for (const ch of line) {
    if (quote) {
      if (ch === quote) quote = null;
      else current += ch;
    } else if (ch === '"' || ch === "'") {
      quote = ch;
    } else if (/\s/.test(ch)) {
      if (current) out.push(current);
      current = "";
    } else {
      current += ch;
    }
  }
  if (current) out.push(current);
  return out;
}

function main() {
  const work = resolve(tmpdir(), `odd-${Date.now()}`);
  mkdirSync(work, { recursive: true });

  console.log("Downloading taxonomy...");
  execSync(`curl -sL --max-time 300 -o "${work}/t.tar.gz" "${TARBALL}"`, {
    stdio: "inherit",
  });
  execSync(`tar xzf "${work}/t.tar.gz" -C "${work}"`);

  const extracted = readdirSync(work).find((d) => d.endsWith("-master"));
  if (!extracted) throw new Error("could not find extracted taxonomy");
  const migrations = resolve(work, extracted, "migrations");

  console.log("Replaying migrations...");
  const ecoRepos = new Map<string, Set<string>>();
  const children = new Map<string, Set<string>>();

  const add = (m: Map<string, Set<string>>, k: string, v: string) => {
    const s = m.get(k) ?? new Set<string>();
    s.add(v);
    m.set(k, s);
  };

  for (const file of readdirSync(migrations).sort()) {
    const text = readFileSync(resolve(migrations, file), "utf8");
    for (const raw of text.split("\n")) {
      const line = raw.trim();
      if (!line || line.startsWith("--")) continue;
      const t = tokenize(line);
      if (!t.length) continue;

      switch (t[0]) {
        case "repadd":
          if (t.length >= 3) add(ecoRepos, t[1], normalize(t[2]));
          break;
        case "reprem":
          if (t.length >= 3) ecoRepos.get(t[1])?.delete(normalize(t[2]));
          break;
        case "repmov": {
          if (t.length < 3) break;
          const [oldUrl, newUrl] = [normalize(t[1]), normalize(t[2])];
          for (const set of ecoRepos.values()) {
            if (set.delete(oldUrl)) set.add(newUrl);
          }
          break;
        }
        case "ecocon":
          if (t.length >= 3) add(children, t[1], t[2]);
          break;
        case "ecorem":
          if (t.length >= 2) {
            ecoRepos.delete(t[1]);
            children.delete(t[1]);
          }
          break;
      }
    }
  }

  // Walk Avalanche and every sub-ecosystem below it
  const seen = new Set<string>();
  const stack = [ROOT_ECOSYSTEM];
  while (stack.length) {
    const eco = stack.pop()!;
    if (seen.has(eco)) continue;
    seen.add(eco);
    for (const child of children.get(eco) ?? []) stack.push(child);
  }

  // owner -> repos, owner -> ecosystem labels
  const ownerRepos = new Map<string, Set<string>>();
  const ownerEcos = new Map<string, Set<string>>();

  for (const eco of seen) {
    for (const url of ecoRepos.get(eco) ?? []) {
      const m = url.match(/^https?:\/\/github\.com\/([^/]+)\/([^/]+)$/);
      if (!m) continue;
      const owner = m[1].toLowerCase();
      add(ownerRepos, owner, m[2].toLowerCase());
      if (eco !== ROOT_ECOSYSTEM) add(ownerEcos, owner, eco);
    }
  }

  const owners = [...ownerRepos.entries()]
    .map(([owner, repos]) => {
      const ecos = [...(ownerEcos.get(owner) ?? [])].sort();
      return {
        owner,
        repos: repos.size,
        project: ecos[0] ?? ROOT_ECOSYSTEM,
        ecosystems: ecos.slice(0, 3),
      };
    })
    .filter((o) => o.repos >= MIN_REPOS)
    .sort((a, b) => b.repos - a.repos);

  const payload = {
    generated_note:
      "GENERATED FILE - do not edit by hand. Run: yarn ecosystem:sync",
    generated_at: new Date().toISOString(),
    source: "electric-capital/crypto-ecosystems (Open Dev Data)",
    root: ROOT_ECOSYSTEM,
    sub_ecosystems: seen.size - 1,
    total_owners_in_taxonomy: ownerRepos.size,
    total_repos_in_taxonomy: [...ownerRepos.values()].reduce(
      (s, r) => s + r.size,
      0,
    ),
    min_repos_threshold: MIN_REPOS,
    owners,
  };

  mkdirSync(dirname(OUT), { recursive: true });
  writeFileSync(OUT, JSON.stringify(payload, null, 2));
  rmSync(work, { recursive: true, force: true });

  console.log(
    `\nWrote ${OUT}\n` +
      `  sub-ecosystems      ${payload.sub_ecosystems}\n` +
      `  owners in taxonomy  ${payload.total_owners_in_taxonomy}\n` +
      `  repos in taxonomy   ${payload.total_repos_in_taxonomy}\n` +
      `  owners kept (>=${MIN_REPOS})  ${owners.length}`,
  );
}

function normalize(url: string) {
  return url.toLowerCase().replace(/\/+$/, "");
}

main();

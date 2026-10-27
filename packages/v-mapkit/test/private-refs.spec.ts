import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { describe, expect, it } from "vitest";

/**
 * Guard: no tracked file in this public repo may name a private repo or a
 * product built from one. The forbidden names are stored only as SHA-256
 * digests of the lowercase word, hostname, or owner/repo slug, so this file
 * never spells them out.
 */
const FORBIDDEN_DIGESTS = new Set([
  "72165796b67119a7b57759b350a2663346c1cefbf4a17c88d9bbb2fe7f35d478",
  "85d808232e01037fa6a8055cd090c1173854d72f6513f23ebcee6a3260d31660",
  "e2520c990efb01e3dd6542f071a56d7b1c8eb66dad3da1e89db544c56ddee0cf",
  "e2d14981b3895a8ece7be2206724c752ef1205882e4dc1ed6f745add079b9634",
  "7559a9a1a2623c9ec9bb334230a1005eaa7f4aebbf8fb9266313e49d57f84fea",
  "45df6e6712bdafb88a8b133ffbcf435d5bc458b5e90de18daf6f2245f540613f",
  "e4f743a670ac2a340e23542b6a72869b339e418de43406685bcd2705d1b694a5",
  "f1a3ec0ea4f47cd20634df7acee8a0583eaffc3772dfefa33989d0971f1549c0",
  "43daf55a26ade264c25dfcd151281ce46940f5508a573b17b2ba18d4fe41f6f5",
  "dc50f77b1cd9db35fd7b734401cee296869fe08612ae07904b6309f938d884a2",
  "0b9a5d20aa9c44fac80f4b7ae6ba685b59d71caf16301f1354eb4b148d623cc0",
  "15a489db9e9f88a9aed5059b9c3bdd12db4dad837cb14b06ea09cbc31f279430",
  "0c918cc13d6af28552094e90198f77c9072783088938c69c946e2c99fa95419f",
  "7dc93e700df37018813392832eaf7efd4ebbd84a820c54068764b21a9fa7d505",
  "04df4cb3209399bf080f2293a807631fcf2cf8936f9c33b8974899dd0d838854",
]);

const repoRoot = execFileSync("git", ["rev-parse", "--show-toplevel"], {
  encoding: "utf8",
}).trim();

function sha256(value: string): string {
  return createHash("sha256").update(value).digest("hex");
}

/** Lowercase words, hostnames and owner/repo slugs found in a text. */
function candidates(text: string): Set<string> {
  const lower = text.toLowerCase();
  const found = new Set<string>();
  for (const match of lower.matchAll(/[a-z0-9-]+/g)) found.add(match[0]);
  for (const match of lower.matchAll(/[a-z0-9-]+(?:\.[a-z0-9-]+)+/g)) found.add(match[0]);
  for (const match of lower.matchAll(/[a-z0-9-]+\/[a-z0-9.-]+/g))
    found.add(match[0].replace(/\.+$/, ""));
  return found;
}

function forbiddenHits(text: string): string[] {
  return [...candidates(text)].filter((c) => FORBIDDEN_DIGESTS.has(sha256(c)));
}

describe("private repo references", () => {
  it("allows public names", () => {
    expect(forbiddenHits("see github.com/geoql/doctor and https://the-doctor.report")).toEqual([]);
  });

  it("no tracked file names a private repo or product", () => {
    const files = execFileSync("git", ["ls-files", "-z"], {
      cwd: repoRoot,
      encoding: "utf8",
    })
      .split("\0")
      .filter(Boolean);

    expect(files.length).toBeGreaterThan(0);

    const offenders: string[] = [];
    for (const file of files) {
      let text: string;
      try {
        text = readFileSync(resolve(repoRoot, file), "utf8");
      } catch {
        continue;
      }
      if (text.includes("\0")) continue;
      text.split("\n").forEach((line, index) => {
        if (forbiddenHits(line).length > 0) offenders.push(`${file}:${index + 1}`);
      });
    }

    expect(offenders).toEqual([]);
  });
});

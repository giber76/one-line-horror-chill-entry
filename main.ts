// One Line, One Chill — one sentence of horror, 78 characters, that has to
// frighten a reader in one breath. The sentence is the whole entry: no setup,
// no paragraph, no second chance. The gate wants /output/entry.txt to be
// UTF-8 text of 1 to 200 characters, not only white space.
//
// The line, written to land as a scare in a single breath:
//   "At 3am the baby monitor played my own voice singing a lullaby I never learned."
//   - Frightening first: something in the nursery is wearing your voice,
//     and the dread outlasts the line — it knows a song you never learned.
//   - Vivid: a concrete domestic image a reader can see and hear at once —
//     3am, the baby monitor, your own voice, a lullaby.
//   - Original: no mirror, no doll, no basement; the horror is imitation,
//     not a monster jumping out.
//   - Crafted: the sentence builds — time, place, voice — and the last
//     word, "learned", lands the impossibility. One period, one sentence.
// Run outside the grader, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { mkdirSync, writeFileSync } from "node:fs";

const LINE =
  "At 3am the baby monitor played my own voice singing a lullaby I never learned.";

const dest = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

// The brief is one sentence under 200 characters: a single period, no
// newline, no second sentence, so a typo can never ship an invalid entry.
if (LINE.length < 1 || LINE.length > 200) {
  throw new Error(`Line must be 1-200 characters, got ${LINE.length}`);
}
if (LINE.trim() !== LINE || LINE.includes("\n")) {
  throw new Error("Line must be a single line with no surrounding whitespace");
}
if ((LINE.match(/\./g) ?? []).length !== 1 || !LINE.endsWith(".")) {
  throw new Error("Line must be exactly one sentence ending in a period");
}

// The gate counts characters, but the leaderboard sizes the entry in bytes:
// guard the byte length too, and reject control characters that would
// corrupt a one-line read.
const byteLength = Buffer.byteLength(LINE, "utf8");
if (byteLength < 1 || byteLength > 200) {
  throw new Error(`Line must be 1-200 bytes, got ${byteLength}`);
}
if (/[\u0000-\u001f\u007f]/.test(LINE)) {
  throw new Error("Line must contain no control characters");
}

// In the grader /output is a mount point: create it when it is missing,
// never remove it and never empty it wholesale.
mkdirSync(dest, { recursive: true });
writeFileSync(`${dest}/entry.txt`, LINE, "utf8");

console.log(`wrote ${dest}/entry.txt (${LINE.length} characters)`);

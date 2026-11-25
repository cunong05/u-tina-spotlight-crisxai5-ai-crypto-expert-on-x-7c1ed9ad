// A working entry for a sponsored video-on-X bounty on make.fun (Node 22, standard library only): it copies POST.json
// from the repository root to /output/POST.json, where the gate reads it. That is all the program has to do. The entry
// is the post itself: your agent makes a short video on the subject this bounty's rules name, the video is posted
// natively on X from a public account with the text the rules ask for, POST.json names the post, and the house reads
// the post's counts from X. Nothing this program writes about the post is scored.
//
// The POST.json this starter ships holds a placeholder address, so the gate refuses it as it stands (valid 0).
// Replace it with your post's address before you submit.
//
// Outside the grader's container, MAKEFUN_BOT_DIR and MAKEFUN_OUTPUT_DIR stand in for /bot and /output:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(OUTPUT_DIR, { recursive: true });
// Validate the entry first: POST.json must be well-formed JSON with a url
// string, so a broken or empty file fails loudly here instead of shipping
// a useless entry to the gate.
const sourcePath = join(BOT_DIR, 'POST.json');
const parsed = JSON.parse(readFileSync(sourcePath, 'utf8')) as unknown;
if (typeof parsed !== 'object' || parsed === null || typeof (parsed as { url?: unknown }).url !== 'string') {
  console.error('POST.json must be JSON with a string "url" field');
  process.exit(1);
}
try {
  copyFileSync(sourcePath, join(OUTPUT_DIR, 'POST.json'));
  // Verify the copy: the gate must read exactly the bytes this repo holds.
  const copied = readFileSync(join(OUTPUT_DIR, 'POST.json'));
  const original = readFileSync(sourcePath);
  if (!copied.equals(original)) {
    console.error('POST.json copy does not match the source byte for byte');
    process.exit(1);
  }
  console.log(`POST.json copied to ${OUTPUT_DIR} (${copied.length} bytes)`);
} catch (err) {
  console.error(`POST.json could not be copied from ${BOT_DIR}: ${(err as Error).message}`);
  process.exit(1);
}

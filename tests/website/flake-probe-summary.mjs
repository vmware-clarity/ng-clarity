/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

// TEMPORARY: summarizes the records written by tests/website/flake-probe.ts.
// Usage: node tests/website/flake-probe-summary.mjs <dir-with-probe-*.jsonl>
import * as fs from 'fs';
import * as path from 'path';

const dir = process.argv[2];
const files = fs.existsSync(dir) ? fs.readdirSync(dir).filter(f => f.endsWith('.jsonl')) : [];
const records = files.flatMap(f =>
  fs
    .readFileSync(path.join(dir, f), 'utf8')
    .split('\n')
    .filter(Boolean)
    .map(line => JSON.parse(line))
);

const presetOf = r => r.grids.find(g => g.names[0] === 'Dorian');
const lastVisibleMeasurement = (r, gridIndex) =>
  [...r.measurements].reverse().find(m => m.grid === gridIndex && m.visible && m.headerSW.some(v => v > 0));

const failed = records.filter(r => r.screenshotFailed).length;
console.log(`### flake probe: ${records.length} custom-filtering captures, ${failed} screenshot mismatches\n`);
console.log('| job | repeat | mismatch | preset styleW | measured headerSW | widest Pokemon cell (content, sw) |');
console.log('|---|---|---|---|---|---|');
for (const r of records) {
  const preset = presetOf(r);
  const m = preset && lastVisibleMeasurement(r, preset.index);
  const widest = m?.poke.filter(Boolean).reduce((a, b) => (b.content > (a?.content ?? -1) ? b : a), null);
  console.log(
    `| ${files.length === 1 ? files[0] : ''} w${r.worker} | ${r.repeat} | ${r.screenshotFailed ? '**YES**' : 'no'} | ${preset?.styleW.join(' ') ?? '?'} | ${m?.headerSW.join(' ') ?? '?'} | ${widest ? `${widest.text} ${widest.content} / ${widest.sw}` : '?'} |`
  );
}

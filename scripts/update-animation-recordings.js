/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

// Records the animations of the Storybook build and updates the committed recordings (tests/animations/recordings) of
// the scenarios that animate differently, like `playwright test --update-snapshots` does for the screenshots.
// A scenario that still animates the same keeps its committed recording, so that timing noise does not show as changes.
// The comparison report is written to dist/animation-recordings/baseline-vs-current.html.
//
// Usage: node ./scripts/update-animation-recordings.js [--no-record] [playwright test options]
//   --no-record  compare with the last recording (dist/animation-recordings/current) instead of recording again

const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const committedDir = path.join('tests', 'animations', 'recordings');
const recordingsDir = path.join('dist', 'animation-recordings');
const BASELINE = 'baseline';
const CURRENT = 'current';

const args = process.argv.slice(2);
const record = !args.includes('--no-record');
const playwrightArgs = args.filter(arg => arg !== '--no-record');

if (record) {
  fs.rmSync(path.join(recordingsDir, CURRENT), { recursive: true, force: true });
  const result = spawnSync('npx', ['playwright', 'test', '-c', 'playwright.animations.config.ts', ...playwrightArgs], {
    stdio: 'inherit',
    env: { ...process.env, CLARITY_ANIMATIONS_LABEL: CURRENT },
    shell: process.platform === 'win32',
  });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

const current = listScenarios(path.join(recordingsDir, CURRENT));
const committed = listScenarios(committedDir);
if (!current.length) {
  console.error(`No recording found in ${path.join(recordingsDir, CURRENT)}`);
  process.exit(1);
}

// Compare the new recordings with the committed ones.
let verdicts = {};
fs.rmSync(path.join(recordingsDir, BASELINE), { recursive: true, force: true });
if (committed.length) {
  fs.cpSync(committedDir, path.join(recordingsDir, BASELINE), { recursive: true });
  const result = spawnSync(
    process.execPath,
    [path.join(__dirname, 'compare-animation-recordings.js'), BASELINE, CURRENT],
    { stdio: 'inherit' }
  );
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
  verdicts = JSON.parse(fs.readFileSync(path.join(recordingsDir, `${BASELINE}-vs-${CURRENT}.json`), 'utf8')).scenarios;
}

const updated = current.filter(scenario => (verdicts[scenario] ?? 'new') !== 'same');
for (const scenario of updated) {
  fs.rmSync(path.join(committedDir, scenario), { recursive: true, force: true });
  fs.cpSync(path.join(recordingsDir, CURRENT, scenario), path.join(committedDir, scenario), { recursive: true });
}

// Recordings of scenarios that no longer exist, only known when every scenario was recorded.
const removed = playwrightArgs.length ? [] : committed.filter(scenario => !current.includes(scenario));
for (const scenario of removed) {
  fs.rmSync(path.join(committedDir, scenario), { recursive: true, force: true });
}

console.log(
  updated.length || removed.length
    ? `\nUpdated recordings in ${committedDir}:` +
        updated.map(scenario => `\n  ${(verdicts[scenario] ?? 'new').padEnd(7)} ${scenario}`).join('') +
        removed.map(scenario => `\n  removed ${scenario}`).join('')
    : `\nThe animations match the recordings in ${committedDir}.`
);

function listScenarios(dir) {
  if (!fs.existsSync(dir)) {
    return [];
  }
  return fs
    .readdirSync(dir)
    .filter(name => fs.existsSync(path.join(dir, name, 'recording.json')))
    .sort();
}

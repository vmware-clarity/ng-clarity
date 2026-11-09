/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

// Copies AI agent files (AGENTS.md and per-component SKILL.md) into a built package:
//   projects/<lib>/ai/AGENTS.md          -> dist/clr-<lib>/ai/AGENTS.md
//   projects/<lib>/**/SKILL.md           -> dist/clr-<lib>/ai/skills/<name>/SKILL.md
// Usage: node ./scripts/copy-ai-files.js <angular|addons> [destRoot]

const fs = require('fs');
const path = require('path');

const { LIBS, collectSkills, getAgentsFile } = require('./ai-files');

const lib = process.argv[2];
if (!LIBS[lib]) {
  console.error(`Usage: node ./scripts/copy-ai-files.js <${Object.keys(LIBS).join('|')}> [destRoot]`);
  process.exit(1);
}

const dest = path.join(process.argv[3] || `dist/clr-${lib}`, 'ai');
const { skills, errors } = collectSkills(lib);

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}

// `ai` is also the `@clr/angular/ai` entry point, so only what this script writes is replaced.
fs.rmSync(path.join(dest, 'skills'), { recursive: true, force: true });
fs.rmSync(path.join(dest, 'AGENTS.md'), { force: true });
fs.mkdirSync(dest, { recursive: true });

const agents = getAgentsFile(lib);
if (agents) {
  fs.copyFileSync(agents.file, path.join(dest, 'AGENTS.md'));
}

for (const skill of skills) {
  fs.mkdirSync(path.join(dest, 'skills', skill.name), { recursive: true });
  fs.copyFileSync(skill.file, path.join(dest, 'skills', skill.name, 'SKILL.md'));
}

console.log(`Copied ${skills.length} skill(s) to ${dest}`);

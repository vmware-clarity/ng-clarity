/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

// Copies AI agent files into a built package:
//   projects/<lib>/ai/AGENTS.md      -> dist/clr-<lib>/ai/AGENTS.md
//   projects/<lib>/ai/SKILL.md       -> dist/clr-<lib>/ai/skills/<skill>/SKILL.md
//   projects/<lib>/**/GUIDE.md    -> dist/clr-<lib>/ai/skills/<skill>/references/<guide>.md (without frontmatter)
// Usage: node ./scripts/copy-ai-files.js <angular|addons> [destRoot]

const fs = require('fs');
const path = require('path');

const { LIBS, collectAiFiles, getAgentsFile } = require('./ai-files');

const lib = process.argv[2];
if (!LIBS[lib]) {
  console.error(`Usage: node ./scripts/copy-ai-files.js <${Object.keys(LIBS).join('|')}> [destRoot]`);
  process.exit(1);
}

const dest = path.join(process.argv[3] || `dist/clr-${lib}`, 'ai');
const { skill, guides, errors } = collectAiFiles(lib);

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}

fs.rmSync(dest, { recursive: true, force: true });
const referencesDir = path.join(dest, 'skills', skill.name, 'references');
fs.mkdirSync(referencesDir, { recursive: true });

const agents = getAgentsFile(lib);
if (agents) {
  fs.copyFileSync(agents.file, path.join(dest, 'AGENTS.md'));
}

fs.copyFileSync(skill.file, path.join(dest, 'skills', skill.name, 'SKILL.md'));
for (const guide of guides) {
  fs.writeFileSync(path.join(referencesDir, `${guide.name}.md`), guide.body.trimStart());
}

console.log(`Copied the ${skill.name} skill with ${guides.length} guide(s) to ${dest}`);

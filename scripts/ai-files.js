/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

// Shared discovery of AI agent files (AGENTS.md and per-component SKILL.md).
// Used by scripts/copy-ai-files.js (npm packages) and projects/website/scripts/compile-content.js (website).

const fs = require('fs');
const glob = require('glob');
const path = require('path');
const parseFrontMatter = require('front-matter');

const REPO_ROOT = path.resolve(__dirname, '..');

const LIBS = {
  angular: { packageName: '@clr/angular', prefix: 'clr-' },
  addons: { packageName: '@clr/addons', prefix: 'appfx-' },
};

function getAgentsFile(lib) {
  const file = path.join(REPO_ROOT, 'projects', lib, 'ai/AGENTS.md');
  return fs.existsSync(file) ? { file, raw: fs.readFileSync(file, 'utf8') } : undefined;
}

// Returns { skills, errors }. Each skill: { lib, packageName, name, description, docs, file, raw, body }.
function collectSkills(lib) {
  const { packageName, prefix } = LIBS[lib];
  const skills = [];
  const errors = [];
  const seen = new Map();

  const files = glob.sync(`projects/${lib}/**/SKILL.md`, { cwd: REPO_ROOT, ignore: ['**/node_modules/**'] }).sort();
  for (const relativeFile of files) {
    const file = path.join(REPO_ROOT, relativeFile);
    const raw = fs.readFileSync(file, 'utf8');
    const { attributes, body } = parseFrontMatter(raw);
    const { name, description } = attributes;

    if (!name) {
      errors.push(`${relativeFile}: missing "name" in frontmatter`);
    } else if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(name) || !name.startsWith(prefix)) {
      errors.push(`${relativeFile}: name "${name}" must be kebab-case and start with "${prefix}"`);
    } else if (seen.has(name)) {
      errors.push(`${relativeFile}: name "${name}" already used by ${seen.get(name)}`);
    } else if (!description) {
      errors.push(`${relativeFile}: missing "description" in frontmatter`);
    } else {
      seen.set(name, relativeFile);
      skills.push({ lib, packageName, name, description, docs: attributes.metadata?.docs, file, raw, body });
    }
  }

  return { skills, errors };
}

module.exports = { LIBS, REPO_ROOT, collectSkills, getAgentsFile };

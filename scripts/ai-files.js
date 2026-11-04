/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

// Shared discovery of AI agent files. Each library has:
//   projects/<lib>/ai/AGENTS.md         a short pointer to the package skill
//   projects/<lib>/ai/SKILL.md          the package skill: rules for all components plus an index of the guides
//   projects/<lib>/**/AI-GUIDE.md       one guide per component, shipped as references/<name>.md of the skill
// Used by scripts/copy-ai-files.js (npm packages), projects/website/scripts/compile-content.js (website) and
// .claude/skills/update-ai-skills/check-ai-skills.js (maintainers).

const fs = require('fs');
const glob = require('glob');
const path = require('path');
const parseFrontMatter = require('front-matter');

const REPO_ROOT = path.resolve(__dirname, '..');

const LIBS = {
  angular: { packageName: '@clr/angular', skillName: 'clarity-angular', prefix: 'clr-' },
  addons: { packageName: '@clr/addons', skillName: 'clarity-addons', prefix: 'appfx-' },
};

function getAgentsFile(lib) {
  const file = path.join(REPO_ROOT, 'projects', lib, 'ai/AGENTS.md');
  return fs.existsSync(file) ? { file, raw: fs.readFileSync(file, 'utf8') } : undefined;
}

function getPackageSkill(lib) {
  const file = path.join(REPO_ROOT, 'projects', lib, 'ai/SKILL.md');
  if (!fs.existsSync(file)) {
    return undefined;
  }
  const raw = fs.readFileSync(file, 'utf8');
  const { attributes, body } = parseFrontMatter(raw);
  return { name: attributes.name, description: attributes.description, file, raw, body };
}

// Returns { skill, guides, errors }. Each guide: { lib, packageName, name, description, docs, guidance, file, raw, body }.
// `guidance` lists the design guidance (https://guidance.clarity.design/<id>) the guide follows, as '<id>:<updated date>',
// read from one `guidance-<id>: '<updated date>'` metadata key per CIP.
function collectAiFiles(lib) {
  const { packageName, skillName, prefix } = LIBS[lib];
  const guides = [];
  const errors = [];
  const seen = new Map();

  const skill = getPackageSkill(lib);
  if (!skill) {
    errors.push(`projects/${lib}/ai/SKILL.md is missing`);
  } else if (skill.name !== skillName || !skill.description) {
    errors.push(`projects/${lib}/ai/SKILL.md: needs "name: ${skillName}" and a "description" in frontmatter`);
  }

  const files = glob.sync(`projects/${lib}/**/AI-GUIDE.md`, { cwd: REPO_ROOT, ignore: ['**/node_modules/**'] }).sort();
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
      const { docs, ...metadata } = attributes.metadata || {};
      const guidance = Object.entries(metadata)
        .filter(([key]) => key.startsWith('guidance-'))
        .map(([key, date]) => `${key.slice('guidance-'.length)}:${date}`);
      guides.push({ lib, packageName, name, description, docs, guidance, file, raw, body });
    }
  }

  if (skill) {
    errors.push(...checkGuideIndex(skill, guides));
  }

  return { skill, guides, errors };
}

// The package skill's guide index must list exactly the guides of its package, as table rows ("| `guide-name` | ...").
function checkGuideIndex(skill, guides) {
  const listed = new Set([...skill.body.matchAll(/^\|\s*`([a-z0-9-]+)`\s*\|/gm)].map(m => m[1]));
  const names = guides.map(guide => guide.name);
  const relativeFile = path.relative(REPO_ROOT, skill.file);
  return [
    ...names.filter(name => !listed.has(name)).map(name => `${relativeFile}: guide ${name} is not in the index`),
    ...[...listed]
      .filter(name => !names.includes(name))
      .map(name => `${relativeFile}: index lists ${name}, but no such guide exists`),
  ];
}

module.exports = { LIBS, REPO_ROOT, collectAiFiles, getAgentsFile };

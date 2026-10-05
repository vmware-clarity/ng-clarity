/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

// Checks the Clarity API names used in AI skill files (SKILL.md, ai/AGENTS.md) against the public API reports.
// Reports names that are missing from every *.api.md (removed or renamed) and names that are deprecated.
// Also checks the design guidance (https://guidance.clarity.design) cited by skills against a local clone of
// https://github.com/vmware-clarity/clarity-guidance: reports cited CIPs that were updated after the date in the
// skill's `metadata.guidance` ('<id>:<date>'), CIPs that no longer exist, and guidance links not listed in metadata.
// Usage (from the repo root): node .claude/skills/update-ai-skills/check-ai-skills.js [--changed <base-ref>] [--guidance <dir>]
//   --changed <ref>    also list which skill files cover each *.api.md that differs from <ref> (e.g. origin/main)
//   --guidance <dir>   clarity-guidance clone (default: ../clarity-guidance next to this repo; skipped if absent)

const { execSync } = require('child_process');
const fs = require('fs');
const glob = require('glob');
const path = require('path');

const { LIBS, REPO_ROOT, collectSkills, getAgentsFile } = require(path.join(process.cwd(), 'scripts/ai-files'));

// Lines that warn against a name (e.g. "there is no `clrFoo`", "do not use `clrBar`") are skipped on purpose.
const WARNING_LINE = /\b(no|not|never|deprecated|instead of|don't|doesn't)\b/i;

const apiFiles = glob.sync('projects/{angular,addons}/**/*.api.md', { cwd: REPO_ROOT, ignore: ['**/node_modules/**'] });
const apiText = apiFiles.map(file => fs.readFileSync(path.join(REPO_ROOT, file), 'utf8')).join('\n');
const deprecated = findDeprecatedNames(apiText);

const files = [];
for (const lib of Object.keys(LIBS)) {
  const { skills, errors } = collectSkills(lib);
  if (errors.length) {
    console.error(errors.join('\n'));
    process.exit(1);
  }
  files.push(...skills.map(skill => ({ lib, name: skill.name, file: skill.file, guidance: skill.guidance })));
  const agents = getAgentsFile(lib);
  if (agents) {
    files.push({ lib, name: 'AGENTS.md', file: agents.file, agents: true });
  }
}
const skillNames = new Set(files.filter(f => !f.agents).map(f => f.name));

let problems = 0;
for (const entry of files) {
  const names = extractApiNames(fs.readFileSync(entry.file, 'utf8')).filter(name => !skillNames.has(name));
  const missing = names.filter(name => !apiText.includes(name));
  const deprecatedUsed = names.filter(name => deprecated.has(name));

  if (missing.length || deprecatedUsed.length) {
    console.log(`\n${label(entry)}`);
    missing.forEach(name => console.log(`  missing     ${name}`));
    deprecatedUsed.forEach(name => console.log(`  deprecated  ${name}`));
    problems += missing.length + deprecatedUsed.length;
  }
}

const guidanceIndex = process.argv.indexOf('--guidance');
const guidanceDir = path.resolve(
  guidanceIndex !== -1 ? process.argv[guidanceIndex + 1] : path.join(REPO_ROOT, '../clarity-guidance')
);
if (fs.existsSync(guidanceDir)) {
  const cipDates = readCipDates(guidanceDir);

  for (const entry of files) {
    const issues = [];
    const tracked = new Map(
      (entry.guidance || []).map(item => {
        const [id, date] = String(item).split(':');
        return [id, date];
      })
    );

    for (const [id, date] of tracked) {
      if (!cipDates.has(id)) {
        issues.push(`guidance   CIP ${id} no longer exists`);
      } else if (!date || cipDates.get(id) > date) {
        issues.push(`guidance   CIP ${id} updated ${cipDates.get(id)} (skill follows ${date || 'no date'})`);
      }
    }

    const linked = [...fs.readFileSync(entry.file, 'utf8').matchAll(/guidance\.clarity\.design\/(\d+)/g)].map(
      m => m[1]
    );
    for (const id of new Set(linked)) {
      if (!cipDates.has(id)) {
        issues.push(`guidance   link to CIP ${id}, which does not exist`);
      } else if (!entry.agents && !tracked.has(id)) {
        issues.push(`guidance   links to CIP ${id} but metadata.guidance does not list it`);
      }
    }

    if (issues.length) {
      console.log(`\n${label(entry)}`);
      issues.forEach(issue => console.log(`  ${issue}`));
      problems += issues.length;
    }
  }
} else {
  console.log(`\nGuidance check skipped: ${guidanceDir} not found (pass --guidance <clarity-guidance clone>).`);
}

const changedIndex = process.argv.indexOf('--changed');
if (changedIndex !== -1) {
  const base = process.argv[changedIndex + 1] || 'origin/main';
  const changedApi = execSync(`git diff --name-only ${base} -- "projects/**/*.api.md"`, { cwd: REPO_ROOT })
    .toString()
    .split('\n')
    .filter(Boolean);

  console.log(`\nAPI reports changed since ${base}:${changedApi.length ? '' : ' none'}`);
  for (const apiFile of changedApi) {
    const dir = path.dirname(apiFile);
    const lib = apiFile.split('/')[1];
    const skillsForApi = files.filter(f => !f.agents && rel(f.file).startsWith(`${dir}/`));
    const agentsForLib = files.filter(f => f.agents && f.lib === lib);

    console.log(`  ${apiFile}`);
    [...skillsForApi, ...agentsForLib].forEach(f => console.log(`    -> ${label(f)}`));
    if (!skillsForApi.length) {
      console.log('    (no skill covers this API yet)');
    }
  }
}

console.log(
  problems
    ? `\n${problems} problem(s) found.`
    : '\nNo problems found: API names exist and are not deprecated, and cited guidance is current.'
);
process.exit(problems ? 1 : 0);

// Names inside inline code and code blocks: ClrFoo / AppfxFoo classes, clrFoo / appfxFoo inputs, clr-foo / appfx-foo selectors.
function extractApiNames(markdown) {
  const usable = markdown
    .split('\n')
    .filter(line => !WARNING_LINE.test(line))
    .join('\n');
  const code = [...usable.matchAll(/```[\s\S]*?```|`[^`\n]+`/g)].map(m => m[0]).join('\n');
  const names =
    code.match(/\b(?:Clr|Appfx|clr|appfx)[A-Z][A-Za-z0-9]*\b|\b(?:clr|appfx)-[a-z0-9]+(?:-[a-z0-9]+)*\b/g) || [];
  return [...new Set(names)].sort();
}

// Deprecated members, plus the input/output aliases that point at them ("prop": { "alias": "clrFoo" ...).
function findDeprecatedNames(text) {
  const names = new Set();
  const lines = text.split('\n');
  lines.forEach((line, i) => {
    if (line.includes('@deprecated')) {
      const member = lines[i + 1]?.match(/^\s*(?:protected |static |readonly |get |set )*([A-Za-z_$][\w$]*)\s*[(:<]/);
      if (member) {
        names.add(member[1]);
      }
    }
  });
  for (const [, prop, alias] of text.matchAll(/"([\w$]+)": \{ "alias": "([\w$]+)"/g)) {
    if (names.has(prop)) {
      names.add(alias);
    }
  }
  return names;
}

// CIP id -> `updated:` date (YYYY-MM-DD) from the frontmatter of <id>-*.md files.
function readCipDates(dir) {
  const dates = new Map();
  for (const file of fs.readdirSync(dir).filter(f => /^\d+-.*\.md$/.test(f))) {
    const updated = fs.readFileSync(path.join(dir, file), 'utf8').match(/^updated:\s*['"]?(\d{4}-\d{2}-\d{2})/m);
    dates.set(file.split('-')[0], updated ? updated[1] : '');
  }
  return dates;
}

function label({ name, file }) {
  return `${name} (${rel(file)})`;
}

function rel(file) {
  return path.relative(REPO_ROOT, file).split(path.sep).join('/');
}

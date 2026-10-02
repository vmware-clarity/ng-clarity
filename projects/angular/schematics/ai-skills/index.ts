/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Rule, SchematicContext, Tree } from '@angular-devkit/schematics';
import * as fs from 'fs';
import * as path from 'path';

export interface AiSkillsOptions {
  /** Also set up Claude Code: copy skills to .claude/skills and reference AGENTS.md from CLAUDE.md. */
  claude?: boolean;
}

export interface AiPackage {
  name: string;
  /** Content of the package's ai/AGENTS.md, wrapped in `<!-- <key>:start ... -->` / `<!-- <key>:end -->` markers. */
  agents?: string;
  skills: { name: string; content: string }[];
}

const CLAUDE_IMPORT = '@AGENTS.md';

/**
 * Adds the AI agent files shipped in @clr/angular (and @clr/addons, if installed) to the workspace:
 * - merges each package's AGENTS.md section into ./AGENTS.md (re-running replaces the section)
 * - with `claude`, copies skills to ./.claude/skills/<name>/SKILL.md and adds `@AGENTS.md` to ./CLAUDE.md
 */
export function aiSkills(options: AiSkillsOptions): Rule {
  return (tree: Tree, context: SchematicContext) => {
    const packages = readInstalledAiPackages();
    if (!packages.length) {
      context.logger.warn('No Clarity AI files found. Make sure @clr/angular is installed.');
      return tree;
    }
    return applyAiFiles(tree, context, packages, options);
  };
}

export function applyAiFiles(tree: Tree, context: SchematicContext, packages: AiPackage[], options: AiSkillsOptions) {
  for (const pkg of packages) {
    if (pkg.agents) {
      writeFile(tree, 'AGENTS.md', mergeSection(readFile(tree, 'AGENTS.md'), pkg.agents));
      context.logger.info(`Updated AGENTS.md with the ${pkg.name} section.`);
    }
  }

  if (options.claude) {
    for (const pkg of packages) {
      for (const skill of pkg.skills) {
        writeFile(tree, `.claude/skills/${skill.name}/SKILL.md`, skill.content);
      }
      context.logger.info(`Copied ${pkg.skills.length} ${pkg.name} skill(s) to .claude/skills.`);
    }

    const claudeMd = readFile(tree, 'CLAUDE.md');
    if (claudeMd === undefined) {
      writeFile(tree, 'CLAUDE.md', `${CLAUDE_IMPORT}\n`);
      context.logger.info('Created CLAUDE.md referencing AGENTS.md.');
    } else if (!claudeMd.split(/\r?\n/).some(line => line.trim() === CLAUDE_IMPORT)) {
      writeFile(tree, 'CLAUDE.md', `${claudeMd.replace(/\s*$/, '')}\n\n${CLAUDE_IMPORT}\n`);
      context.logger.info('Added @AGENTS.md to CLAUDE.md.');
    }
  }

  return tree;
}

/** Replaces the marked section in `existing`, or appends it when absent. */
export function mergeSection(existing: string | undefined, section: string): string {
  const key = section.match(/<!--\s*([a-z0-9-]+):start/)?.[1];
  if (!key) {
    throw new Error('AGENTS.md section is missing its "<!-- <key>:start" marker.');
  }

  const trimmedSection = section.trim();
  if (!existing?.trim()) {
    return `${trimmedSection}\n`;
  }

  const sectionPattern = new RegExp(`<!--\\s*${key}:start[\\s\\S]*?<!--\\s*${key}:end\\s*-->`);
  if (sectionPattern.test(existing)) {
    return existing.replace(sectionPattern, () => trimmedSection);
  }
  return `${existing.replace(/\s*$/, '')}\n\n${trimmedSection}\n`;
}

function readInstalledAiPackages(): AiPackage[] {
  const aiDirs: [string, string | undefined][] = [
    // this file lives in <pkg>/schematics/ai-skills/
    ['@clr/angular', path.resolve(__dirname, '../../ai')],
    ['@clr/addons', resolvePackageDir('@clr/addons', 'ai')],
  ];

  return aiDirs
    .filter((entry): entry is [string, string] => !!entry[1] && fs.existsSync(entry[1]))
    .map(([name, aiDir]) => readAiPackage(name, aiDir));
}

function readAiPackage(name: string, aiDir: string): AiPackage {
  const agentsFile = path.join(aiDir, 'AGENTS.md');
  const skillsDir = path.join(aiDir, 'skills');
  const skillNames = fs.existsSync(skillsDir) ? fs.readdirSync(skillsDir).sort() : [];

  return {
    name,
    agents: fs.existsSync(agentsFile) ? fs.readFileSync(agentsFile, 'utf8') : undefined,
    skills: skillNames
      .map(skillName => ({ name: skillName, file: path.join(skillsDir, skillName, 'SKILL.md') }))
      .filter(({ file }) => fs.existsSync(file))
      .map(({ name: skillName, file }) => ({ name: skillName, content: fs.readFileSync(file, 'utf8') })),
  };
}

function resolvePackageDir(packageName: string, subDir: string): string | undefined {
  try {
    const manifest = require.resolve(`${packageName}/package.json`, { paths: [process.cwd()] });
    return path.join(path.dirname(manifest), subDir);
  } catch {
    return undefined;
  }
}

function readFile(tree: Tree, filePath: string): string | undefined {
  return tree.exists(filePath) ? tree.readText(filePath) : undefined;
}

function writeFile(tree: Tree, filePath: string, content: string) {
  if (tree.exists(filePath)) {
    if (tree.readText(filePath) !== content) {
      tree.overwrite(filePath, content);
    }
  } else {
    tree.create(filePath, content);
  }
}

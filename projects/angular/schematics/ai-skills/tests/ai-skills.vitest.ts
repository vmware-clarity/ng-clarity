/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { logging } from '@angular-devkit/core';
import { HostTree, SchematicContext } from '@angular-devkit/schematics';

import { AiPackage, applyAiFiles, mergeSection } from '../index';

const context = { logger: new logging.NullLogger() } as unknown as SchematicContext;

const angularSection = '<!-- clarity:start — managed -->\n## Clarity\n- rule v2\n<!-- clarity:end -->\n';
const addonsSection = '<!-- appfx:start — managed -->\n## AppFX\n<!-- appfx:end -->\n';

const packages: AiPackage[] = [
  { name: '@clr/angular', agents: angularSection, skills: [{ name: 'clr-button', content: '# button' }] },
  { name: '@clr/addons', agents: addonsSection, skills: [{ name: 'appfx-datagrid', content: '# appfx' }] },
];

describe('mergeSection', () => {
  it('creates the content when there is no file', () => {
    expect(mergeSection(undefined, angularSection)).toBe(angularSection);
  });

  it('appends the section after existing content', () => {
    expect(mergeSection('# My app\n\nOwn rules.\n', angularSection)).toBe(
      `# My app\n\nOwn rules.\n\n${angularSection}`
    );
  });

  it('replaces an existing section and keeps the rest', () => {
    const existing = '# My app\n\n<!-- clarity:start — managed -->\nold\n<!-- clarity:end -->\n\nAfter.\n';
    expect(mergeSection(existing, angularSection)).toBe(
      '# My app\n\n<!-- clarity:start — managed -->\n## Clarity\n- rule v2\n<!-- clarity:end -->\n\nAfter.\n'
    );
  });

  it('throws when the section has no start marker', () => {
    expect(() => mergeSection(undefined, '## no markers')).toThrow();
  });
});

describe('applyAiFiles', () => {
  it('writes AGENTS.md sections for every package without Claude files by default', () => {
    const tree = applyAiFiles(new HostTree(), context, packages, {});

    expect(tree.readText('AGENTS.md')).toBe(`${angularSection}\n${addonsSection}`);
    expect(tree.exists('CLAUDE.md')).toBe(false);
    expect(tree.exists('.claude/skills/clr-button/SKILL.md')).toBe(false);
  });

  it('is idempotent', () => {
    const tree = applyAiFiles(new HostTree(), context, packages, { claude: true });
    const agents = tree.readText('AGENTS.md');
    const claude = tree.readText('CLAUDE.md');

    applyAiFiles(tree, context, packages, { claude: true });

    expect(tree.readText('AGENTS.md')).toBe(agents);
    expect(tree.readText('CLAUDE.md')).toBe(claude);
  });

  it('copies skills and creates CLAUDE.md with claude enabled', () => {
    const tree = applyAiFiles(new HostTree(), context, packages, { claude: true });

    expect(tree.readText('.claude/skills/clr-button/SKILL.md')).toBe('# button');
    expect(tree.readText('.claude/skills/appfx-datagrid/SKILL.md')).toBe('# appfx');
    expect(tree.readText('CLAUDE.md')).toBe('@AGENTS.md\n');
  });

  it('adds @AGENTS.md to an existing CLAUDE.md only once', () => {
    const tree = new HostTree();
    tree.create('CLAUDE.md', '# Team notes\n');

    applyAiFiles(tree, context, packages, { claude: true });
    expect(tree.readText('CLAUDE.md')).toBe('# Team notes\n\n@AGENTS.md\n');

    tree.overwrite('CLAUDE.md', '# Team notes\n@AGENTS.md\nmore\n');
    applyAiFiles(tree, context, packages, { claude: true });
    expect(tree.readText('CLAUDE.md')).toBe('# Team notes\n@AGENTS.md\nmore\n');
  });
});

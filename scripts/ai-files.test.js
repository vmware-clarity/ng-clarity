/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

const assert = require('node:assert/strict');
const path = require('node:path');
const { describe, it } = require('node:test');

const { LIBS, REPO_ROOT, checkGuideIndex, collectAiFiles } = require('./ai-files');

const file = path.join(REPO_ROOT, 'projects/angular/ai/SKILL.md');
const skill = body => ({ file, body });
const guides = (...names) => names.map(name => ({ name }));

describe('checkGuideIndex', () => {
  it('accepts an index that lists every guide', () => {
    const body = '| Guide | Use for |\n|---|---|\n| `clr-alert` | Alerts |\n|`clr-modal`|Dialogs|\n';
    assert.deepEqual(checkGuideIndex(skill(body), guides('clr-alert', 'clr-modal')), []);
  });

  it('reports a guide that has no row', () => {
    const body = '| `clr-alert` | Alerts |\n';
    assert.deepEqual(checkGuideIndex(skill(body), guides('clr-alert', 'clr-modal')), [
      'projects/angular/ai/SKILL.md: guide clr-modal is not in the index',
    ]);
  });

  it('reports a row for a guide that does not exist', () => {
    const body = '| `clr-alert` | Alerts |\n|   `clr-gone`   | Removed |\n';
    assert.deepEqual(checkGuideIndex(skill(body), guides('clr-alert')), [
      'projects/angular/ai/SKILL.md: index lists clr-gone, but no such guide exists',
    ]);
  });

  it('ignores backticked names outside the first cell', () => {
    const body = '| `clr-alert` | Use with `clr-modal` |\nSee `clr-modal` too.\n';
    assert.deepEqual(checkGuideIndex(skill(body), guides('clr-alert', 'clr-modal')), [
      'projects/angular/ai/SKILL.md: guide clr-modal is not in the index',
    ]);
  });
});

describe('collectAiFiles', () => {
  for (const lib of Object.keys(LIBS)) {
    it(`finds no problems in the ${lib} AI files`, () => {
      const { skill, guides, errors } = collectAiFiles(lib);
      assert.deepEqual(errors, []);
      assert.equal(skill.name, LIBS[lib].skillName);
      assert.ok(guides.length > 0);
    });
  }
});

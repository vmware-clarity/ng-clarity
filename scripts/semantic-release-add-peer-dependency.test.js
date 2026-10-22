/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { afterEach, beforeEach, describe, it } = require('node:test');
const { prepare } = require('./semantic-release-add-peer-dependency');

describe('semantic-release-add-peer-dependency', () => {
  const originalCwd = process.cwd();
  let releaseDir;

  function writeManifest(name, manifest) {
    fs.mkdirSync(path.join(releaseDir, 'dist', name), { recursive: true });
    fs.writeFileSync(path.join(releaseDir, 'dist', name, 'package.json'), JSON.stringify(manifest));
  }

  function readPeers(name) {
    return JSON.parse(fs.readFileSync(path.join(releaseDir, 'dist', name, 'package.json'), 'utf8')).peerDependencies;
  }

  beforeEach(() => {
    releaseDir = fs.mkdtempSync(path.join(os.tmpdir(), 'clr-release-'));
    writeManifest('clr-angular', { name: '@clr/angular', peerDependencies: { '@angular/core': '^22.0.0' } });
    writeManifest('clr-addons', { name: '@clr/addons', peerDependencies: { '@clr/angular': '^19.0.0' } });
    process.chdir(releaseDir);
  });

  afterEach(() => {
    process.chdir(originalCwd);
    fs.rmSync(releaseDir, { recursive: true, force: true });
  });

  for (const version of ['19.0.0', '19.1.2', '19.0.0-next.3']) {
    it(`pins @clr/ui and @clr/angular to ${version}`, () => {
      prepare({}, { nextRelease: { version } });

      assert.deepEqual(readPeers('clr-angular'), { '@angular/core': '^22.0.0', '@clr/ui': version });
      assert.deepEqual(readPeers('clr-addons'), { '@clr/angular': version });
    });
  }

  it('adds peerDependencies when a manifest has none', () => {
    writeManifest('clr-angular', { name: '@clr/angular' });

    prepare({}, { nextRelease: { version: '19.0.0' } });

    assert.deepEqual(readPeers('clr-angular'), { '@clr/ui': '19.0.0' });
  });
});

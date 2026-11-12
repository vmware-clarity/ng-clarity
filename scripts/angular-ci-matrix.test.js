/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

const assert = require('node:assert/strict');
const { test } = require('node:test');
const { angularBuildMatrix } = require('./angular-ci-matrix');

test('Angular 21 retains the published-library and Angular 22 consumer legs', () => {
  assert.deepEqual(angularBuildMatrix('^21.2.0'), {
    major: 21,
    matrix: [
      { angular: 'Angular v21', primary: true },
      { angular: 'Angular v22', primary: false },
    ],
  });
});
test('Angular 22 has one primary leg regardless of PR base branch', () => {
  assert.deepEqual(angularBuildMatrix('~22.1.0'), { major: 22, matrix: [{ angular: 'Angular v22', primary: true }] });
});
test('unsupported or missing majors require an explicit matrix update', () => {
  for (const value of ['23.0.0', 'workspace:*', undefined]) {
    assert.throws(() => angularBuildMatrix(value));
  }
});

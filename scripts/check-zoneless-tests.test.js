/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

const assert = require('node:assert/strict');
const { test } = require('node:test');
const { checkSource } = require('./check-zoneless-tests');

test('rejects aliased Zone helpers and scheduler overrides', () => {
  const errors = checkSource(
    `
    import { fakeAsync as fake, tick } from '@angular/core/testing';
    import { provideZoneChangeDetection as scheduler } from '@angular/core';
    import 'zone.js/testing';
  `,
    'example.spec.ts'
  );
  assert.equal(errors.length, 4);
  assert.match(errors.join('\n'), /fakeAsync/);
  assert.match(errors.join('\n'), /provideZoneChangeDetection/);
});

test('rejects testing namespace imports that could hide Zone helpers', () => {
  assert.equal(checkSource("import * as testing from '@angular/core/testing';", 'example.spec.ts').length, 1);
});

test('accepts native asynchronous tests and ignores examples in comments', () => {
  assert.deepEqual(
    checkSource(
      `
    import { TestBed } from '@angular/core/testing';
    // Previously imported fakeAsync from @angular/core/testing.
    it('renders', async () => { await fixture.whenStable(); });
  `,
      'example.spec.ts'
    ),
    []
  );
});

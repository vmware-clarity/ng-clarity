/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

const assert = require('node:assert/strict');
const { test } = require('node:test');
const { checkSource, countForcedChecks, hasZonelessProviders } = require('./check-zoneless-tests');

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

test('counts legacy direct and helper renders without counting comments', () => {
  assert.equal(
    countForcedChecks(
      `
    fixture.detectChanges();
    context.detectChanges();
    renderFixture(fixture);
    // fixture.detectChanges();
    await fixture.whenStable();
  `,
      'example.spec.ts'
    ),
    3
  );
});

test('rejects dynamic Zone loading, namespace schedulers, and patched event inspection', () => {
  assert.equal(
    checkSource(
      `
    import * as core from '@angular/core';
    import('zone.js');
    require('zone.js/testing');
    element.eventListeners();
  `,
      'example.spec.ts'
    ).length,
    4
  );
});

test('counts aliases, computed method names and application ticks', () => {
  assert.equal(
    countForcedChecks(
      `
    import { renderFixture as render } from '@clr/angular/utils/testing';
    render(fixture);
    fixture['detectChanges']();
    appRef.tick();
    TestBed.tick();
  `,
      'example.spec.ts'
    ),
    4
  );
});

test('requires active exported exhaustive zoneless providers, not comments', () => {
  const source = `
    import { provideZonelessChangeDetection, provideCheckNoChangesConfig } from '@angular/core';
    export default [provideZonelessChangeDetection(), provideCheckNoChangesConfig({ exhaustive: true })];
  `;
  assert.equal(hasZonelessProviders(source), true);
  assert.equal(hasZonelessProviders(source.replace('exhaustive: true', 'exhaustive: false')), false);
  assert.equal(
    hasZonelessProviders(
      '// provideZonelessChangeDetection()\n// provideCheckNoChangesConfig({ exhaustive: true })\nexport default [];'
    ),
    false
  );
});

test('rejects direct and computed disabled checks', () => {
  assert.equal(
    checkSource("fixture.detectChanges(false); fixture['detectChanges'](false);", 'example.spec.ts').length,
    2
  );
});

test('rejects test-local exhaustive opt-outs, including an aliased provider', () => {
  assert.equal(
    checkSource(
      `
    import { provideCheckNoChangesConfig as configureChecks } from '@angular/core';
    TestBed.configureTestingModule({ providers: [configureChecks({ exhaustive: false })] });
  `,
      'example.spec.ts'
    ).length,
    1
  );
  assert.deepEqual(
    checkSource(
      `
    import { provideCheckNoChangesConfig } from '@angular/core';
    TestBed.configureTestingModule({ providers: [provideCheckNoChangesConfig({ exhaustive: true })] });
  `,
      'example.spec.ts'
    ),
    []
  );
});

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

test('normalizes Windows baseline keys', () => {
  const { normalizePath } = require('./check-zoneless-tests');
  assert.equal(normalizePath('projects\\angular\\example.spec.ts'), 'projects/angular/example.spec.ts');
});

function policyFixture(t) {
  const fs = require('node:fs');
  const path = require('node:path');
  const os = require('node:os');
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'clarity-zoneless-policy-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const write = (file, value) => {
    fs.mkdirSync(path.dirname(path.join(root, file)), { recursive: true });
    fs.writeFileSync(path.join(root, file), typeof value === 'string' ? value : JSON.stringify(value));
  };
  const workspace = { projects: {} };
  for (const library of ['angular', 'addons']) {
    workspace.projects[`clr-${library}`] = {
      architect: {
        test: {
          options: {
            providersFile: 'projects/test-providers.ts',
            setupFiles: ['projects/test-setup.ts'],
            buildTarget: `clr-${library}:test-build`,
          },
          configurations: { ci: {} },
        },
        'test-build': { options: { polyfills: [] } },
      },
    };
    write(
      `projects/${library}/example.spec.ts`,
      library === 'angular' ? 'fixture.detectChanges();' : 'await fixture.whenStable();'
    );
  }
  write(
    'projects/test-providers.ts',
    `import { provideZonelessChangeDetection, provideCheckNoChangesConfig } from '@angular/core'; export default [provideZonelessChangeDetection(), provideCheckNoChangesConfig({exhaustive:true})];`
  );
  write('projects/test-setup.ts', '');
  write('scripts/zoneless-test-baseline.json', { 'projects/angular/example.spec.ts': 1 });
  write('angular.json', workspace);
  return { root, write, workspace };
}

test('audits effective CI overrides and path polyfills', t => {
  const { checkRepository } = require('./check-zoneless-tests');
  const { root, write, workspace } = policyFixture(t);
  workspace.projects['clr-angular'].architect.test.configurations.ci.providersFile = 'other.ts';
  workspace.projects['clr-angular'].architect['test-build'].configurations = {
    ci: { polyfills: ['node_modules/zone.js/fesm2015/zone.js'] },
  };
  write('angular.json', workspace);
  const errors = checkRepository(root).errors.join('\n');
  assert.match(errors, /shared zoneless providers/);
  assert.match(errors, /must not load Zone/);
});

test('audits additional setup files and transitive local imports', t => {
  const { checkRepository } = require('./check-zoneless-tests');
  const { root, write, workspace } = policyFixture(t);
  workspace.projects['clr-addons'].architect.test.configurations.ci.setupFiles = ['projects/extra-setup.ts'];
  write('projects/extra-setup.ts', "import './nested-setup';");
  write('projects/nested-setup.ts', "import '../node_modules/zone.js/testing';");
  write('angular.json', workspace);
  assert.match(checkRepository(root).errors.join('\n'), /imports .*zone.js/);
});

test('allows reductions and updates their baseline without accepting increases', t => {
  const fs = require('node:fs');
  const path = require('node:path');
  const { checkRepository } = require('./check-zoneless-tests');
  const { root, write } = policyFixture(t);
  write('projects/angular/example.spec.ts', 'await fixture.whenStable();');
  assert.deepEqual(checkRepository(root).errors, []);
  assert.deepEqual(checkRepository(root, { update: true }).errors, []);
  const baselineFile = path.join(root, 'scripts/zoneless-test-baseline.json');
  assert.deepEqual(JSON.parse(fs.readFileSync(baselineFile, 'utf8')), {});
  write('projects/angular/example.spec.ts', 'fixture.detectChanges();');
  assert.match(checkRepository(root, { update: true }).errors.join('\n'), /forced checks increased/);
  assert.deepEqual(JSON.parse(fs.readFileSync(baselineFile, 'utf8')), {});
});

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');

const zoneHelpers = new Set(['fakeAsync', 'waitForAsync', 'tick', 'flush', 'flushMicrotasks', 'discardPeriodicTasks']);

function checkSource(source, filename) {
  const errors = [];
  const sourceFile = ts.createSourceFile(filename, source, ts.ScriptTarget.Latest, true);
  function visit(node) {
    if (ts.isImportDeclaration(node) && ts.isStringLiteral(node.moduleSpecifier)) {
      const moduleName = node.moduleSpecifier.text;
      if (moduleName === 'zone.js' || moduleName.startsWith('zone.js/')) {
        errors.push(`${filename}: imports ${moduleName}`);
      }
      const bindings = node.importClause?.namedBindings;
      if (bindings && ts.isNamedImports(bindings)) {
        for (const binding of bindings.elements) {
          const name = (binding.propertyName || binding.name).text;
          if (
            (moduleName === '@angular/core/testing' && zoneHelpers.has(name)) ||
            (moduleName === '@angular/core' && name === 'provideZoneChangeDetection')
          ) {
            errors.push(`${filename}: imports ${name}`);
          }
        }
      }
      if (bindings && ts.isNamespaceImport(bindings) && moduleName === '@angular/core/testing') {
        // Namespace imports could hide aliased Zone helpers from the explicit import audit.
        errors.push(`${filename}: use named Angular testing imports`);
      }
    }
    ts.forEachChild(node, visit);
  }
  visit(sourceFile);
  return errors;
}

function checkRepository(root) {
  const errors = [];
  const counts = {};
  const workspace = JSON.parse(fs.readFileSync(path.join(root, 'angular.json'), 'utf8'));
  const provider = fs.readFileSync(path.join(root, 'projects/test-providers.ts'), 'utf8');
  if (
    !/provideZonelessChangeDetection\(\)/.test(provider) ||
    !/provideCheckNoChangesConfig\(\{\s*exhaustive:\s*true\s*\}\)/.test(provider)
  ) {
    errors.push('Both suites must retain zoneless scheduling and exhaustive check-no-changes validation.');
  }
  errors.push(...checkSource(provider, 'projects/test-providers.ts'));
  errors.push(
    ...checkSource(fs.readFileSync(path.join(root, 'projects/test-setup.ts'), 'utf8'), 'projects/test-setup.ts')
  );
  for (const library of ['angular', 'addons']) {
    const targets = workspace.projects[`clr-${library}`].architect;
    if (targets.test.options.providersFile !== 'projects/test-providers.ts') {
      errors.push(`clr-${library}: test must use the shared zoneless providers`);
    }
    if (targets['test-build'].options.polyfills.some(polyfill => polyfill.startsWith('zone.js'))) {
      errors.push(`clr-${library}: test bundle must not load Zone`);
    }
    counts[library] = 0;
    const directory = path.join(root, 'projects', library);
    for (const filename of fs.readdirSync(directory, { recursive: true })) {
      if (!filename.endsWith('.spec.ts') || filename.startsWith(`schematics${path.sep}`)) {
        continue;
      }
      counts[library]++;
      const relative = path.join('projects', library, filename);
      errors.push(...checkSource(fs.readFileSync(path.join(root, relative), 'utf8'), relative));
    }
  }
  return { errors, counts };
}

if (require.main === module) {
  const { errors, counts } = checkRepository(path.resolve(__dirname, '..'));
  const summary = `Zoneless test policy: ${counts.angular} Angular and ${counts.addons} addons spec files; ${errors.length} violations (allowed: 0).`;
  console.log(summary);
  if (process.env.GITHUB_STEP_SUMMARY) {
    fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${summary}\n`);
  }
  for (const error of errors) {
    console.error(error);
  }
  process.exitCode = errors.length ? 1 : 0;
}

module.exports = { checkSource, checkRepository };

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
  const checkConfigNames = new Set(['provideCheckNoChangesConfig']);
  for (const statement of sourceFile.statements) {
    if (
      ts.isImportDeclaration(statement) &&
      statement.moduleSpecifier.text === '@angular/core' &&
      statement.importClause?.namedBindings &&
      ts.isNamedImports(statement.importClause.namedBindings)
    ) {
      for (const binding of statement.importClause.namedBindings.elements) {
        if ((binding.propertyName || binding.name).text === 'provideCheckNoChangesConfig') {
          checkConfigNames.add(binding.name.text);
        }
      }
    }
  }
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
      if (
        bindings &&
        ts.isNamespaceImport(bindings) &&
        ['@angular/core/testing', '@angular/core'].includes(moduleName)
      ) {
        // Namespace imports could hide aliased Zone helpers from the explicit import audit.
        errors.push(`${filename}: use named Angular testing imports`);
      }
    }
    if (ts.isCallExpression(node)) {
      const imported = node.arguments[0];
      if (
        (node.expression.kind === ts.SyntaxKind.ImportKeyword || node.expression.getText(sourceFile) === 'require') &&
        imported &&
        ts.isStringLiteral(imported) &&
        (imported.text === 'zone.js' || imported.text.startsWith('zone.js/'))
      ) {
        errors.push(`${filename}: imports ${imported.text}`);
      }
      if (
        ((ts.isPropertyAccessExpression(node.expression) && node.expression.name.text === 'detectChanges') ||
          (ts.isElementAccessExpression(node.expression) &&
            ts.isStringLiteral(node.expression.argumentExpression) &&
            node.expression.argumentExpression.text === 'detectChanges')) &&
        node.arguments[0]?.kind === ts.SyntaxKind.FalseKeyword
      ) {
        errors.push(`${filename}: detectChanges(false) disables the exhaustive check; keep checks enabled`);
      }
      if (ts.isIdentifier(node.expression) && checkConfigNames.has(node.expression.text)) {
        const options = node.arguments[0];
        if (
          !options ||
          !ts.isObjectLiteralExpression(options) ||
          !options.properties.some(
            prop =>
              ts.isPropertyAssignment(prop) &&
              prop.name.getText(sourceFile) === 'exhaustive' &&
              prop.initializer.kind === ts.SyntaxKind.TrueKeyword
          )
        ) {
          errors.push(`${filename}: test-local check configuration must retain exhaustive: true`);
        }
      }
      if (ts.isPropertyAccessExpression(node.expression) && node.expression.name.text === 'eventListeners') {
        errors.push(`${filename}: eventListeners depends on the Zone event patch; inspect native listeners instead`);
      }
    }
    ts.forEachChild(node, visit);
  }
  visit(sourceFile);
  return errors;
}

function countForcedChecks(source, filename) {
  let count = 0;
  const sourceFile = ts.createSourceFile(filename, source, ts.ScriptTarget.Latest, true);
  const helperNames = new Set(['renderFixture']);
  for (const node of sourceFile.statements) {
    if (
      !ts.isImportDeclaration(node) ||
      !node.importClause?.namedBindings ||
      !ts.isNamedImports(node.importClause.namedBindings)
    ) {
      continue;
    }
    for (const binding of node.importClause.namedBindings.elements) {
      if ((binding.propertyName || binding.name).text === 'renderFixture') {
        helperNames.add(binding.name.text);
      }
    }
  }
  function visit(node) {
    if (ts.isCallExpression(node)) {
      const expression = node.expression;
      const name = ts.isPropertyAccessExpression(expression)
        ? expression.name.text
        : ts.isElementAccessExpression(expression) && ts.isStringLiteral(expression.argumentExpression)
          ? expression.argumentExpression.text
          : undefined;
      if (
        ['detectChanges', 'tick', 'renderFixture'].includes(name) ||
        (ts.isIdentifier(expression) && helperNames.has(expression.text))
      ) {
        count++;
      }
    }
    ts.forEachChild(node, visit);
  }
  visit(sourceFile);
  return count;
}

function hasZonelessProviders(source) {
  const sourceFile = ts.createSourceFile('test-providers.ts', source, ts.ScriptTarget.Latest, true);
  const names = new Map();
  for (const node of sourceFile.statements) {
    if (
      ts.isImportDeclaration(node) &&
      node.moduleSpecifier.text === '@angular/core' &&
      node.importClause?.namedBindings &&
      ts.isNamedImports(node.importClause.namedBindings)
    ) {
      for (const binding of node.importClause.namedBindings.elements) {
        names.set(binding.name.text, (binding.propertyName || binding.name).text);
      }
    }
  }
  const exported = sourceFile.statements.find(node => ts.isExportAssignment(node) && !node.isExportEquals);
  if (!exported || !ts.isArrayLiteralExpression(exported.expression)) {
    return false;
  }
  const calls = exported.expression.elements.filter(ts.isCallExpression);
  const named = name =>
    calls.filter(call => ts.isIdentifier(call.expression) && names.get(call.expression.text) === name);
  const checks = named('provideCheckNoChangesConfig');
  return (
    named('provideZonelessChangeDetection').length === 1 &&
    checks.length === 1 &&
    checks.every(
      call =>
        call.arguments[0] &&
        ts.isObjectLiteralExpression(call.arguments[0]) &&
        call.arguments[0].properties.some(
          prop =>
            ts.isPropertyAssignment(prop) &&
            prop.name.getText(sourceFile) === 'exhaustive' &&
            prop.initializer.kind === ts.SyntaxKind.TrueKeyword
        )
    )
  );
}

function checkRepository(root) {
  const errors = [];
  const counts = {};
  const forcedChecks = {};
  const baseline = JSON.parse(fs.readFileSync(path.join(root, 'scripts/zoneless-test-baseline.json'), 'utf8'));
  const workspace = JSON.parse(fs.readFileSync(path.join(root, 'angular.json'), 'utf8'));
  const provider = fs.readFileSync(path.join(root, 'projects/test-providers.ts'), 'utf8');
  if (!hasZonelessProviders(provider)) {
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
      if (
        (!filename.endsWith('.spec.ts') &&
          !(
            library === 'angular' &&
            filename.startsWith(`forms${path.sep}tests${path.sep}`) &&
            filename.endsWith('.ts')
          )) ||
        filename.startsWith(`schematics${path.sep}`)
      ) {
        continue;
      }
      if (filename.endsWith('.spec.ts')) {
        counts[library]++;
      }
      const relative = path.join('projects', library, filename);
      const source = fs.readFileSync(path.join(root, relative), 'utf8');
      errors.push(...checkSource(source, relative));
      const forcedCount = countForcedChecks(source, relative);
      if (forcedCount) {
        forcedChecks[relative] = forcedCount;
      }
      if (forcedCount > (baseline[relative] || 0)) {
        errors.push(
          `${relative}: forced checks increased from ${baseline[relative] || 0} to ${forcedCount}; use rendering notifications`
        );
      }
      if (forcedCount < (baseline[relative] || 0)) {
        errors.push(`${relative}: reduce its forced-check baseline to ${forcedCount}`);
      }
    }
  }
  for (const filename of Object.keys(baseline)) {
    if (!fs.existsSync(path.join(root, filename))) {
      errors.push(`${filename}: remove the deleted spec from the forced-check baseline`);
    }
  }
  return { errors, counts, forcedChecks };
}

if (require.main === module) {
  const { errors, counts, forcedChecks } = checkRepository(path.resolve(__dirname, '..'));
  const summary = `Zoneless test policy: ${counts.angular} Angular and ${counts.addons} addons spec files; ${errors.length} violations (allowed: 0).`;
  const progress = `Legacy explicit rendering calls: ${Object.values(forcedChecks).reduce((sum, count) => sum + count, 0)} across ${Object.keys(forcedChecks).length} test files. Notification-based regressions must not add forced checks.`;
  console.log(summary);
  console.log(progress);
  if (process.env.GITHUB_STEP_SUMMARY) {
    fs.appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${summary}\n\n${progress}\n`);
  }
  for (const error of errors) {
    console.error(error);
  }
  process.exitCode = errors.length ? 1 : 0;
}

module.exports = { checkSource, checkRepository, countForcedChecks, hasZonelessProviders };

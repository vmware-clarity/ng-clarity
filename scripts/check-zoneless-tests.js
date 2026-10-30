/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');

const normalizePath = filename => filename.replaceAll('\\', '/');
const isZoneImport = value => /(^|\/)zone\.js($|\/)/.test(normalizePath(value));

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
      if (isZoneImport(moduleName)) {
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
        isZoneImport(imported.text)
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

function checkRepository(root, { update = false } = {}) {
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
  const scanned = new Set();
  const scanEntry = entry => {
    if (isZoneImport(entry)) {
      errors.push(`${entry}: test bundle must not load Zone`);
      return;
    }
    const absolute = path.resolve(root, entry);
    const resolved = [absolute, `${absolute}.ts`, `${absolute}.js`, path.join(absolute, 'index.ts')].find(
      file => fs.existsSync(file) && fs.statSync(file).isFile()
    );
    if (!resolved) {
      errors.push(`${entry}: cannot audit configured test entry`);
      return;
    }
    if (scanned.has(resolved)) {
      return;
    }
    scanned.add(resolved);
    const source = fs.readFileSync(resolved, 'utf8');
    errors.push(...checkSource(source, normalizePath(path.relative(root, resolved))));
    const file = ts.createSourceFile(resolved, source, ts.ScriptTarget.Latest, true);
    const visit = node => {
      const specifier =
        ts.isImportDeclaration(node) || ts.isExportDeclaration(node)
          ? node.moduleSpecifier
          : ts.isCallExpression(node) &&
              (node.expression.kind === ts.SyntaxKind.ImportKeyword || node.expression.getText(file) === 'require')
            ? node.arguments[0]
            : undefined;
      if (specifier && ts.isStringLiteral(specifier) && specifier.text.startsWith('.')) {
        scanEntry(path.relative(root, path.resolve(path.dirname(resolved), specifier.text)));
      }
      ts.forEachChild(node, visit);
    };
    visit(file);
  };
  for (const library of ['angular', 'addons']) {
    const targets = workspace.projects[`clr-${library}`].architect;
    for (const configuration of [undefined, ...Object.keys(targets.test.configurations || {})]) {
      const options = { ...targets.test.options, ...(targets.test.configurations?.[configuration] || {}) };
      if (options.providersFile !== 'projects/test-providers.ts') {
        errors.push(`clr-${library}:${configuration || 'default'}: test must use the shared zoneless providers`);
      }
      for (const entry of options.setupFiles || []) {
        scanEntry(entry);
      }
      const [project, target, buildConfigurations] = options.buildTarget.split(':');
      const build = workspace.projects[project].architect[target];
      const selected = buildConfigurations ? buildConfigurations.split(',') : [];
      const base = Object.assign({}, build.options, ...selected.map(name => build.configurations?.[name] || {}));
      for (const effective of [
        base,
        ...Object.values(build.configurations || {}).map(value => ({ ...base, ...value })),
      ]) {
        for (const entry of effective.polyfills || []) {
          scanEntry(entry);
        }
      }
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
      const relative = normalizePath(path.join('projects', library, filename));
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
    }
  }
  if (update && errors.length === 0) {
    fs.writeFileSync(
      path.join(root, 'scripts/zoneless-test-baseline.json'),
      JSON.stringify(Object.fromEntries(Object.entries(forcedChecks).sort(([a], [b]) => a.localeCompare(b))), null, 2) +
        '\n'
    );
  }
  return { errors, counts, forcedChecks };
}

if (require.main === module) {
  const { errors, counts, forcedChecks } = checkRepository(path.resolve(__dirname, '..'), {
    update: process.argv.includes('--update'),
  });
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

module.exports = { checkSource, checkRepository, countForcedChecks, hasZonelessProviders, normalizePath };

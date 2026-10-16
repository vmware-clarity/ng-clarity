/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { SchematicContext, Tree } from '@angular-devkit/schematics';
import { posix } from 'path';

import { ProjectInfo } from './workspace';

const PROVIDER = 'provideAnimationsAsync';
const IMPORT = `import { ${PROVIDER} } from '@angular/platform-browser/animations/async';`;
const EXISTING_PROVIDER =
  /provideAnimations(Async)?\s*\(|provideNoopAnimations\s*\(|BrowserAnimationsModule|NoopAnimationsModule/;

export const ANIMATIONS_HINT = `The datagrid needs an animations provider at runtime: add ${PROVIDER}() to the providers of your application.`;

/**
 * Adds `provideAnimationsAsync()` to the project's app.config.ts unless an animations provider is already set up.
 * Logs a warning instead of failing when the file cannot be found or patched.
 */
export function addAnimationsProvider(tree: Tree, context: SchematicContext, project: ProjectInfo | undefined): void {
  const configPath = findAppConfig(tree, project);
  if (!configPath) {
    context.logger.warn(`Could not find app.config.ts. ${ANIMATIONS_HINT}`);
    return;
  }

  const content = tree.readText(configPath);
  if (EXISTING_PROVIDER.test(content)) {
    return;
  }

  const patched = insertProvider(content);
  if (!patched) {
    context.logger.warn(`Could not find a \`providers: [...]\` array in ${configPath}. ${ANIMATIONS_HINT}`);
    return;
  }

  tree.overwrite(configPath, patched);
  context.logger.info(`UPDATE ${configPath} (${PROVIDER}())`);
}

/** Returns the patched source, or `undefined` when there is no `providers: [` to extend. */
export function insertProvider(content: string): string | undefined {
  const providers = /providers\s*:\s*\[/.exec(content);
  if (!providers) {
    return undefined;
  }

  const insertAt = providers.index + providers[0].length;
  const rest = content.slice(insertAt);
  const lineStart = content.lastIndexOf('\n', providers.index) + 1;
  const outerIndent = /^[ \t]*/.exec(content.slice(lineStart, providers.index))?.[0] ?? '';

  let entry: string;
  if (/^[ \t]*\r?\n/.test(rest)) {
    // one entry per line: add a line with the indentation of the first entry
    const innerIndent = /^[ \t]*\r?\n([ \t]+)\S/.exec(rest)?.[1] ?? `${outerIndent}  `;
    entry = `\n${innerIndent}${PROVIDER}(),`;
  } else if (/^\s*\]/.test(rest)) {
    entry = `${PROVIDER}()`;
  } else {
    entry = `${PROVIDER}(), `;
  }

  return addImport(content.slice(0, insertAt) + entry + rest);
}

/** Adds the import after the last package import (or the last import, or at the top of the file). */
function addImport(content: string): string {
  const imports = [...content.matchAll(/^import\s[^;]*from\s+['"]([^'"]+)['"];[ \t]*$/gm)];
  if (!imports.length) {
    return `${IMPORT}\n\n${content}`;
  }
  const packageImports = imports.filter(match => !match[1].startsWith('.'));
  const candidates = packageImports.length ? packageImports : imports;
  const last = candidates[candidates.length - 1];
  const end = last.index + last[0].length;
  return `${content.slice(0, end)}\n${IMPORT}${content.slice(end)}`;
}

function findAppConfig(tree: Tree, project: ProjectInfo | undefined): string | undefined {
  const sourceRoot = project?.sourceRoot ?? 'src';
  const preferred = posix.join(sourceRoot, 'app', 'app.config.ts');
  if (tree.exists(preferred)) {
    return preferred;
  }

  let found: string | undefined;
  const dir = tree.getDir(sourceRoot);
  dir.visit(path => {
    if (!found && path.endsWith('/app.config.ts')) {
      found = path.replace(/^\//, '');
    }
  });
  return found;
}

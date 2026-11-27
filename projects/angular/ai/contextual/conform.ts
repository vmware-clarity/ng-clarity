/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { isDevMode } from '@angular/core';

import { ClrPageContext } from './interfaces/context.interface';
import { validate } from './schemas/page-context.validator';

/** A validator compiled from a JSON Schema by scripts/ai-schemas.js. */
export type SchemaValidator = ((data: unknown) => boolean) & {
  errors?: { instancePath: string; schemaPath?: string; message?: string; params?: Record<string, unknown> }[] | null;
};

const validatePage = validate as SchemaValidator;
const NODE_LISTS = new Set(['components', 'regions', 'children']);
const OPTIONAL_FIELDS = new Set<keyof ClrPageContext>([
  'metadata',
  'url',
  'route',
  'availableRoutes',
  'truncated',
  'modal',
]);
// Each pass removes one part; a snapshot with more broken parts than this is a bug, not data.
const MAX_REMOVALS = 100;

/**
 * Checks the snapshot against the page context schema a backend validates with, and leaves out what does not
 * match: the node it is in, or an optional field. A dev-mode warning names each part left out.
 */
export function conformingSnapshot(snapshot: ClrPageContext): ClrPageContext {
  for (let removals = 0; removals < MAX_REMOVALS && !validatePage(snapshot); removals++) {
    const error = validatePage.errors?.[0];
    if (isDevMode()) {
      console.warn(`ClrContextService: left out ${error?.instancePath || 'the snapshot'}: ${error?.message}.`);
    }
    if (!error || !removeAt(snapshot, error.instancePath)) {
      break;
    }
  }
  return snapshot;
}

/** Removes the innermost node, or else the optional top-level field, that `pointer` points into. */
function removeAt(snapshot: ClrPageContext, pointer: string): boolean {
  const keys = pointer.split('/').slice(1);
  for (let depth = keys.length - 1; depth > 0; depth--) {
    if (NODE_LISTS.has(keys[depth - 1]) && /^\d+$/.test(keys[depth])) {
      const list = valueAt(snapshot, keys.slice(0, depth));
      if (Array.isArray(list)) {
        list.splice(Number(keys[depth]), 1);
        return true;
      }
    }
  }
  const field = keys[0] as keyof ClrPageContext | undefined;
  if (field && OPTIONAL_FIELDS.has(field)) {
    delete snapshot[field];
    return true;
  }
  return false;
}

function valueAt(root: unknown, keys: string[]): unknown {
  return keys.reduce<unknown>(
    (value, key) => (value && typeof value === 'object' ? (value as Record<string, unknown>)[key] : undefined),
    root
  );
}

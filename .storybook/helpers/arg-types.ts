/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import type { ArgTypes } from '@storybook/angular';

/**
 * Hides story-only args (helper props that are not component inputs) from both the controls
 * panel and the docs table.
 *
 * Replaces the hand-written `{ control: { disable: true }, table: { disable: true } }` block.
 *
 * ```ts
 * argTypes: {
 *   ...hideControls('elements', 'openIndices'),
 * }
 * ```
 *
 * Note that disabling a control only hides the UI: the arg can still be set through the URL,
 * which is how `tests/visual-snapshots.spec.ts` drives stories.
 */
export function hideControls(...names: string[]): Partial<ArgTypes> {
  return Object.fromEntries(
    names.map((name): [string, ArgTypes[string]] => [name, { control: { disable: true }, table: { disable: true } }])
  );
}

/**
 * Hides an arg from the docs table but keeps its control usable, for args that are worth
 * playing with in the controls panel but only add noise to the generated API table.
 */
export function hideFromDocs(...names: string[]): Partial<ArgTypes> {
  return Object.fromEntries(names.map((name): [string, ArgTypes[string]] => [name, { table: { disable: true } }]));
}

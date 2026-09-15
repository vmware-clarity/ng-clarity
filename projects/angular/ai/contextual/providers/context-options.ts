/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { InjectionToken, Provider } from '@angular/core';

import { ClrContextSnapshotOptions } from '../interfaces/context.interface';
import { clrContextPreset, ClrContextPreset } from '../snapshot-options';

/**
 * Application-wide snapshot options. Whatever is provided here is what every snapshot
 * starts from — the engine, the tracker, the frame bridge and the global accessor all
 * read it — and options passed to an individual call are applied over it.
 */
export const CLR_CONTEXT_OPTIONS = new InjectionToken<ClrContextSnapshotOptions>('CLR_CONTEXT_OPTIONS');

/**
 * Configures, once for the whole application, what a snapshot collects:
 *
 * ```ts
 * provideClrContextOptions('interactive', { excludeSelectors: ['clr-header'] });
 * provideClrContextOptions({ maxComponents: 200, includeText: false });
 * ```
 *
 * A preset name gives a starting bundle (see `CLR_CONTEXT_PRESETS`); explicit options,
 * or the overrides after a preset, are applied over it.
 */
export function provideClrContextOptions(
  options: ClrContextPreset | ClrContextSnapshotOptions,
  overrides: ClrContextSnapshotOptions = {}
): Provider[] {
  const resolved = typeof options === 'string' ? clrContextPreset(options, overrides) : { ...options, ...overrides };
  return [{ provide: CLR_CONTEXT_OPTIONS, useValue: resolved }];
}

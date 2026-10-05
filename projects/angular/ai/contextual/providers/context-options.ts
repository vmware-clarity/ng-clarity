/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { EnvironmentProviders, InjectionToken, makeEnvironmentProviders } from '@angular/core';

import { ClrContextSnapshotOptions } from '../interfaces/context.interface';
import { clrContextPreset, ClrContextPreset, warnIfExclusionsAreNotLists, withCallOptions } from '../snapshot-options';

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
 * A preset name gives a starting bundle (see `CLR_CONTEXT_PRESETS`); the overrides are
 * applied over it, or over explicit options, the way a call's options are: budgets and
 * switches replace, exclusion lists add.
 *
 * Provide it at application level (`bootstrapApplication` or the root module's
 * `providers`): the engine is root-provided and reads the root injector only. The return
 * type keeps it out of a component's `providers`, where it would be silently ignored.
 */
export function provideClrContextOptions(
  options: ClrContextPreset | ClrContextSnapshotOptions,
  overrides: ClrContextSnapshotOptions = {}
): EnvironmentProviders {
  if (typeof options !== 'string') {
    // Overrides are checked as they are applied; the options they go over are not.
    warnIfExclusionsAreNotLists(options);
  }
  const resolved =
    typeof options === 'string' ? clrContextPreset(options, overrides) : withCallOptions(options, overrides);
  return makeEnvironmentProviders([{ provide: CLR_CONTEXT_OPTIONS, useValue: resolved }]);
}

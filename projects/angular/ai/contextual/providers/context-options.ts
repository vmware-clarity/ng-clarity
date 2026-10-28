/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { EnvironmentProviders, InjectionToken, isDevMode, makeEnvironmentProviders } from '@angular/core';

import { ClrApplicationContext, ClrContextSnapshotOptions } from '../interfaces/context.interface';
import { clrContextPreset, ClrContextPreset, warnIfExclusionsAreNotLists, withCallOptions } from '../snapshot-options';

/** Application-wide snapshot options that every snapshot starts from. */
export const CLR_CONTEXT_OPTIONS = new InjectionToken<ClrContextSnapshotOptions>('CLR_CONTEXT_OPTIONS');

/**
 * Configures snapshot options for the whole application, from a preset, options or both:
 * ```ts
 * provideClrContextOptions('interactive', { excludeSelectors: ['clr-header'] });
 * ```
 * Provide it at application level: the engine is root-provided and reads only the root injector.
 */
export function provideClrContextOptions(
  options: ClrContextPreset | ClrContextSnapshotOptions,
  overrides: ClrContextSnapshotOptions = {}
): EnvironmentProviders {
  if (typeof options !== 'string') {
    warnIfExclusionsAreNotLists(options);
  }
  const resolved =
    typeof options === 'string' ? clrContextPreset(options, overrides) : withCallOptions(options, overrides);
  return makeEnvironmentProviders([{ provide: CLR_CONTEXT_OPTIONS, useValue: resolved }]);
}

/** The application's identity, and where its view id and metadata come from. */
export interface ClrContextApplicationOptions extends ClrApplicationContext {
  /** The current view's id; checked before the route's `data.viewId`. */
  viewId?: () => string | null | undefined;
  /** Metadata about the current view, as a small serializable object. */
  metadata?: () => Record<string, unknown> | null | undefined;
  /**
   * Which views are read: `'all'` (the default) reads every view; `'enabled'` reads only views
   * with metadata and reports the others as `enabled: false`, with nothing about the page.
   */
  views?: 'all' | 'enabled';
}

/** The application every snapshot describes. */
export const CLR_CONTEXT_APPLICATION = new InjectionToken<ClrContextApplicationOptions>('CLR_CONTEXT_APPLICATION');

/**
 * Identifies the application in every snapshot:
 * ```ts
 * provideClrContextApplication({ id: 'inventory', version: '2.4.0', viewId: () => currentView() });
 * ```
 */
export function provideClrContextApplication(application: ClrContextApplicationOptions): EnvironmentProviders {
  if (
    application.views !== undefined &&
    application.views !== 'all' &&
    application.views !== 'enabled' &&
    isDevMode()
  ) {
    console.warn(
      `provideClrContextApplication: views "${application.views}" is neither 'all' nor 'enabled'; only enabled views are read.`
    );
  }
  return makeEnvironmentProviders([{ provide: CLR_CONTEXT_APPLICATION, useValue: application }]);
}

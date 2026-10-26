/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { EnvironmentProviders, InjectionToken, makeEnvironmentProviders } from '@angular/core';

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
  /**
   * Origins other than the page's own that `data-ai-metadata-url` and a configuration URL may load
   * from, e.g. `['https://help.example.com']`.
   */
  metadataOrigins?: string[];
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
  return makeEnvironmentProviders([{ provide: CLR_CONTEXT_APPLICATION, useValue: application }]);
}

/** How one view is identified and described, without editing its HTML or code. */
export interface ClrContextViewConfig {
  /** The route pattern, as `route.path` reports it, e.g. `'hosts/:id'`. */
  route?: string;
  /** Matches while an element matching this selector is on the page. */
  selector?: string;
  /** The view's id, used when nothing on the page or the route names one. */
  viewId?: string;
  /** Metadata about the view; the page's own metadata wins. */
  metadata?: Record<string, unknown>;
  /** `false` keeps the view from being read; `true` reads it with `views: 'enabled'` even without metadata. */
  enabled?: boolean;
}

/** Views described from outside the application, matched in order; the first match applies. */
export interface ClrContextConfig {
  /** The views, most specific first. */
  views: ClrContextViewConfig[];
}

/** The views configuration, or the URL of its JSON. */
export const CLR_CONTEXT_CONFIG = new InjectionToken<ClrContextConfig | string>('CLR_CONTEXT_CONFIG');

/**
 * Describes views by route or selector, as an object or the URL of an `ai-config.json`:
 * ```ts
 * provideClrContextConfig('/assets/ai-config.json');
 * provideClrContextConfig({ views: [{ route: 'hosts/:id', viewId: 'host-detail', metadata: { purpose: '…' } }] });
 * ```
 */
export function provideClrContextConfig(config: ClrContextConfig | string): EnvironmentProviders {
  return makeEnvironmentProviders([{ provide: CLR_CONTEXT_CONFIG, useValue: config }]);
}

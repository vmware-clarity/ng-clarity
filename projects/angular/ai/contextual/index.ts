/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

export * from './interfaces/context.interface';
export * from './providers/context-registry.service';
export * from './providers/contextual-engine.service';
export { CLR_CONTEXT_DEFAULT_OPTIONS } from './dom/dom-context-collector';
export type { ClrContextDomExtractor } from './dom/dom-context-collector';
export * from './diff';
export * from './schema';
export { CLR_CONTEXT_CATEGORIES, CLR_CONTEXT_PRESETS } from './snapshot-options';
export type { ClrContextPreset } from './snapshot-options';
export { ClrContextIgnore, ClrContextRedact } from '@clr/angular/utils';
export * from './context';
export * from './contextual.module';

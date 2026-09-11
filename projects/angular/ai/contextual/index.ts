/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

export * from './interfaces/context.interface';
export * from './providers/context-options';
export * from './providers/context-registry.service';
export * from './providers/context-tracker.service';
export * from './providers/contextual-engine.service';
export * from './dom/dom-context-collector';
export * from './diff';
export { CLR_CONTEXT_PRESETS, clrContextPreset } from './snapshot-options';
export type { ClrContextPreset } from './snapshot-options';
export * from './dom/element-context';
export * from './iframe/context-frame-bridge';
export * from './context.directive';
export * from './contextual.module';

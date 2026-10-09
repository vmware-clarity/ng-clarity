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
export {
  CLR_CONTEXT_CATEGORIES,
  CLR_CONTEXT_PRESETS,
  clrContextCategoryRoles,
  clrContextPreset,
} from './snapshot-options';
export type { ClrContextPreset } from './snapshot-options';
// The publishing contract lives in @clr/angular/utils, so components publish without
// depending on this entry point; it is re-exported here so readers find it in one place.
export { CLR_ELEMENT_CONTEXT_PROPERTY, clrPublishElementContext } from '@clr/angular/utils';
export type { ClrElementContextCallback } from '@clr/angular/utils';
export { CLR_CONTEXT_IGNORE_ATTRIBUTE, CLR_CONTEXT_REDACT_ATTRIBUTE } from '@clr/angular/utils';
// The host class stays internal: `enableFrameBridge` is the only way to serve frames, so
// the application-wide options always apply.
export { CLR_CONTEXT_PROTOCOL, clrRequestHostContext } from './iframe/context-frame-bridge';
export type {
  ClrContextFrameHostOptions,
  ClrContextFrameRequest,
  ClrContextFrameRequestOptions,
  ClrContextFrameResponse,
} from './iframe/context-frame-bridge';
export * from './context';
export * from './contextual.module';
export { CLR_CONTEXT_UNTRUSTED_OPTION_KEYS } from './untrusted-options';

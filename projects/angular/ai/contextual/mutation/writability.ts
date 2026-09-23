/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CLR_CONTEXT_IGNORE_ATTRIBUTE, CLR_CONTEXT_REDACT_ATTRIBUTE } from '@clr/angular/utils';

import { isRedacted } from '../dom/aria-state';
import { isVisible } from '../dom/walk';

/** Why an element that a ref points at must not be written to right now. */
export type ClrWriteObstacle = 'hidden' | 'redacted' | 'disabled' | 'readOnly';

const HIDDEN_ANCESTRY = `[hidden], [aria-hidden="true"], [inert], [${CLR_CONTEXT_IGNORE_ATTRIBUTE}]`;

/**
 * The reason the mutation engine must not write to this element, or `null` when there
 * is none. The rules are the read half's: what a snapshot would not show — hidden,
 * inert, ignored, or inside a region the application marked sensitive — the engine does
 * not write, so that a field a person cannot see cannot be filled on their behalf. A
 * disabled or read-only control is refused for the same reason a user could not type
 * into it.
 */
export function writeObstacle(element: Element): ClrWriteObstacle | null {
  if (!element.isConnected || element.closest(HIDDEN_ANCESTRY) || !isVisible(element as HTMLElement)) {
    return 'hidden';
  }
  if (isRedacted(element) || element.closest(`[${CLR_CONTEXT_REDACT_ATTRIBUTE}]`)) {
    return 'redacted';
  }
  if (
    element.getAttribute('aria-disabled') === 'true' ||
    ('disabled' in element && ((element as HTMLInputElement).disabled || element.matches(':disabled')))
  ) {
    return 'disabled';
  }
  if (
    element.getAttribute('aria-readonly') === 'true' ||
    ('readOnly' in element && (element as HTMLInputElement).readOnly)
  ) {
    return 'readOnly';
  }
  return null;
}

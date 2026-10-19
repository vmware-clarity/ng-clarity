/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { isNativelyDisabled, isRedacted } from '../dom/aria-state';
import { isHiddenFromEngine, openModalDialogs } from '../dom/walk';

export type ClrWriteObstacle = 'hidden' | 'redacted' | 'disabled' | 'readOnly';

/**
 * Why the engine must not write to this element, or `null`: what a snapshot would not show, behind a modal,
 * or disabled. `knownModals` excludes the dialog the application used to ask for confirmation.
 */
export function writeObstacle(element: Element, knownModals?: ReadonlySet<Element>): ClrWriteObstacle | null {
  if (isHiddenFromEngine(element)) {
    return 'hidden';
  }
  const modal = topmostModal(element.ownerDocument, knownModals);
  if (modal && !modal.contains(element)) {
    return 'hidden';
  }
  if (isRedacted(element)) {
    return 'redacted';
  }
  if (element.getAttribute('aria-disabled') === 'true' || isNativelyDisabled(element)) {
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

export function topmostModal(document: Document, knownModals?: ReadonlySet<Element>): Element | null {
  const modals = openModalDialogs(document).filter(dialog => !knownModals || knownModals.has(dialog));
  return modals[modals.length - 1] ?? null;
}

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/**
 * The selectors in `selectors` that `root`'s document accepts, joined into one, or `''`
 * when none is usable. Each is checked on its own, so one invalid entry — a typo in an
 * application's `excludeSelectors` — does not throw away the others, nor throw on every
 * element tested against the list. The contextual engine and the components that publish
 * context both use this, so they never disagree about which of a snapshot's selectors apply.
 */
export function clrUsableSelectors(root: ParentNode, selectors: readonly string[]): string {
  return selectors
    .filter(selector => {
      if (typeof selector !== 'string' || !selector.trim()) {
        return false;
      }
      try {
        root.querySelector(selector);
        return true;
      } catch {
        return false;
      }
    })
    .join(', ');
}

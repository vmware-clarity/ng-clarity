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
  // Checked against an empty fragment of the same document: the syntax is what is being
  // tested, and searching the page itself for each one would cost a document walk per
  // selector every time a component or an option is judged.
  const document = (root as Node).ownerDocument ?? (root as Document);
  const probe: ParentNode =
    typeof document?.createDocumentFragment === 'function' ? document.createDocumentFragment() : root;
  return selectors
    .filter(selector => {
      if (typeof selector !== 'string' || !selector.trim()) {
        return false;
      }
      try {
        probe.querySelector(selector);
        return true;
      } catch {
        return false;
      }
    })
    .join(', ');
}

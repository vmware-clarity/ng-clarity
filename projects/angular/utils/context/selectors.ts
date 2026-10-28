/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/** The selectors `root`'s document accepts, joined, or `''`; one invalid entry drops only itself. */
export function usableSelectors(root: ParentNode, selectors: readonly string[]): string {
  // Checked against an empty fragment: only syntax matters, and querying the page would cost a walk per selector.
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

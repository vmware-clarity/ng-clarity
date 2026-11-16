/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { afterEveryRender } from '@angular/core';

// Static `<pre><code class="language-…">` blocks in page templates and compiled content.
const STATIC_CODE_BLOCKS = 'pre > code[class*="language-"]';

// Blocks already handled. A block whose language has no grammar (a ```text block, for example) never gets
// tokens, so the tokens alone can't tell whether it was handled, and highlighting it again replaces its content
// (and the user's text selection in it) after every render.
const handledBlocks = new WeakSet<Element>();

/**
 * Highlights the static code blocks of the pages after every render.
 *
 * Prism no longer highlights the page by itself (see `prism-manual.ts`), and a page reached by navigating within
 * the site renders its static code blocks long after the page loaded. Each block is highlighted once, unless it
 * already has tokens from the build (compiled markdown).
 *
 * Must be called in an injection context.
 */
export function highlightStaticCode(): void {
  afterEveryRender({
    read: () => {
      const blocks = Array.from(document.querySelectorAll<HTMLElement>(STATIC_CODE_BLOCKS)).filter(
        block => !handledBlocks.has(block)
      );
      for (const block of blocks) {
        handledBlocks.add(block);
      }
      const plainBlocks = blocks.filter(block => !block.querySelector('.token'));
      if (plainBlocks.length === 0) {
        return;
      }
      import('./prism')
        .then(({ default: prism }) => {
          for (const block of plainBlocks) {
            if (block.isConnected) {
              prism.highlightElement(block);
            }
          }
        })
        // A failed chunk load leaves the code readable, just not highlighted.
        .catch(() => undefined);
    },
  });
}

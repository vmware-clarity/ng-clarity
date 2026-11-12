/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { afterEveryRender } from '@angular/core';

// Static `<pre><code class="language-…">` blocks in page templates. A block with tokens is already highlighted.
const STATIC_CODE_BLOCKS = 'pre > code[class*="language-"]';

/**
 * Highlights the static code blocks of the pages after every render.
 *
 * Prism highlights the page once, in the first animation frame after it loads. A page rendered after that
 * frame, or reached by navigating within the site, kept its static code blocks unhighlighted. Without
 * Zone.js the first render can happen after that frame too.
 *
 * Must be called in an injection context.
 */
export function highlightStaticCode(): void {
  afterEveryRender({
    read: () => {
      const blocks = Array.from(document.querySelectorAll<HTMLElement>(STATIC_CODE_BLOCKS)).filter(
        block => !block.querySelector('.token')
      );
      if (blocks.length === 0) {
        return;
      }
      import('./prism').then(({ default: prism }) => {
        for (const block of blocks) {
          if (block.isConnected && !block.querySelector('.token')) {
            prism.highlightElement(block);
          }
        }
      });
    },
  });
}

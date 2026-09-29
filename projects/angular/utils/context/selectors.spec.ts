/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { clrUsableSelectors } from './selectors';

describe('clrUsableSelectors', () => {
  it('joins the selectors the document accepts and drops the rest, one by one', () => {
    expect(clrUsableSelectors(document, ['header', '[[[', '.secret', ''])).toBe('header, .secret');
  });

  it('is empty when no selector is usable', () => {
    expect(clrUsableSelectors(document, [])).toBe('');
    expect(clrUsableSelectors(document, ['[[[', '  '])).toBe('');
  });

  it('checks against an element as well as a document', () => {
    expect(clrUsableSelectors(document.createElement('div'), ['li', ':not('])).toBe('li');
  });
});

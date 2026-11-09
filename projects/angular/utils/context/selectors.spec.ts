/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { usableSelectors } from './selectors';

describe('usableSelectors', () => {
  it('joins the selectors the document accepts and drops the rest, one by one', () => {
    expect(usableSelectors(document, ['header', '[[[', '.secret', ''])).toBe('header, .secret');
  });

  it('is empty when no selector is usable', () => {
    expect(usableSelectors(document, [])).toBe('');
    expect(usableSelectors(document, ['[[[', '  '])).toBe('');
  });

  it('checks against an element as well as a document', () => {
    expect(usableSelectors(document.createElement('div'), ['li', ':not('])).toBe('li');
  });

  it('checks the syntax without searching the page', () => {
    const search = spyOn(document, 'querySelector').and.callThrough();

    expect(usableSelectors(document, ['header', '.secret'])).toBe('header, .secret');
    expect(search).not.toHaveBeenCalled();
  });
});

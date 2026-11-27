/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { accessibleText, truncate } from './text';

describe('truncate', () => {
  it('collapses runs of whitespace into single spaces', () => {
    expect(truncate('  Add   firewall\n  rule ', 100)).toBe('Add firewall rule');
  });

  it('leaves text within the budget untouched', () => {
    expect(truncate('Add rule', 100)).toBe('Add rule');
  });

  it('marks text it had to shorten with an ellipsis', () => {
    expect(truncate('abcdefghij', 5)).toBe('abcd…');
  });

  it('never exceeds the budget it was given', () => {
    expect(truncate('abcdefghij', 5).length).toBe(5);
  });

  it('keeps an emoji sequence whole or leaves it out', () => {
    const family = '\u{1F468}\u200D\u{1F469}\u200D\u{1F467}';
    expect(truncate(`ab${family}x`, 5)).toBe('ab…');
    expect(truncate(`ab${family}xyz`, family.length + 3)).toBe(`ab${family}…`);
  });

  it('keeps a flag and a decomposed letter whole', () => {
    expect(truncate('a\u{1F1E7}\u{1F1EC}bc', 4)).toBe('a…');
    expect(truncate('Cafe\u0301 noir', 5)).toBe('Caf…');
  });

  it('drops a direction mark the cut left open', () => {
    expect(truncate('ab\u2067שלום עולם\u2069', 6)).toBe('abשל…');
    expect(truncate('a\u2067ש\u2069 bcdef', 6)).toBe('a\u2067ש\u2069 …');
  });

  it('keeps surrogate pairs whole without Intl.Segmenter', () => {
    vi.stubGlobal('Intl', { ...Intl, Segmenter: undefined });
    try {
      expect(truncate('ab\u{1F600}cd', 4)).toBe('ab…');
    } finally {
      vi.unstubAllGlobals();
    }
  });
});

describe('accessibleText', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => container.remove());

  it('does not read inside a hidden subtree', () => {
    container.innerHTML = '<span>Shown</span><div style="display: none"><span>a</span><span>b</span></div>';
    const hiddenSpans = Array.from(container.querySelectorAll(':scope > div span'));
    const getComputedStyle = vi.spyOn(window, 'getComputedStyle');

    expect(accessibleText(container).trim()).toBe('Shown');
    expect(getComputedStyle.mock.calls.some(([element]) => hiddenSpans.includes(element))).toBe(false);
  });

  it('leaves out what `withholds` picks', () => {
    container.innerHTML = '3 <span class="secret">hosts</span> up';

    expect(accessibleText(container, undefined, '', child => child.classList.contains('secret'))).toBe('3  up');
  });

  it('reads no option of an embedded choice list', () => {
    container.innerHTML =
      'Flash the screen <select><option>1</option><option>3</option></select>' +
      '<div role="listbox"><div role="option">5</div></div> times';

    expect(accessibleText(container).replace(/\s+/g, ' ')).toBe('Flash the screen times');
  });
});

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { checkVisibility, isVisible } from './visibility';

describe('visibility', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => container.remove());

  function element(html: string, selector = '#target'): HTMLElement {
    container.innerHTML = html;
    return container.querySelector(selector) as HTMLElement;
  }

  const CASES: [string, string, boolean][] = [
    ['a plain element', '<span id="target">x</span>', true],
    ['inside display: none', '<div style="display: none"><span id="target">x</span></div>', false],
    ['visibility: hidden', '<span id="target" style="visibility: hidden">x</span>', false],
    ['inside a transparent ancestor', '<div style="opacity: 0"><span id="target">x</span></div>', false],
    ['a display: contents wrapper', '<div id="target" style="display: contents"><span>x</span></div>', true],
    [
      'a display: contents wrapper inside display: none',
      '<div style="display: none"><div id="target" style="display: contents"><span>x</span></div></div>',
      false,
    ],
  ];

  it('judges visibility the same way with and without Element.checkVisibility', () => {
    for (const [name, html, visible] of CASES) {
      expect(isVisible(element(html)))
        .withContext(`${name}, native`)
        .toBe(visible);

      // As in jsdom, where application unit tests run: the method does not exist.
      const target = element(html);
      Object.defineProperty(target, 'checkVisibility', { value: undefined, configurable: true });
      expect(isVisible(target)).withContext(`${name}, without checkVisibility`).toBe(visible);
    }
  });

  it('only judges display when asked to render rather than to be seen, with or without the native method', () => {
    const target = element('<span id="target" style="visibility: hidden">x</span>');
    expect(checkVisibility(target, false)).toBe(true);
    Object.defineProperty(target, 'checkVisibility', { value: undefined, configurable: true });
    expect(checkVisibility(target, false)).toBe(true);
    expect(checkVisibility(target, true)).toBe(false);
  });

  it('treats an element that is not in the document as not visible', () => {
    const detached = document.createElement('span');
    Object.defineProperty(detached, 'checkVisibility', { value: undefined, configurable: true });
    expect(checkVisibility(detached, true)).toBe(false);
  });
});

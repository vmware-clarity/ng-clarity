/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { NoopDomAdapter } from './noop-dom-adapter';

export default function (): void {
  describe('NoopDomAdapter', function () {
    let domAdapter;
    let element;
    beforeEach(() => {
      domAdapter = new NoopDomAdapter();
      element = document.createElement('div');
      element.appendChild(document.createTextNode('Hello'));
    });

    it('computes the scrollwidth of an element', () => {
      expect(domAdapter.scrollWidth(element)).toBe(0);
    });

    it('computes the width of the scrollbar on an element', () => {
      expect(domAdapter.scrollBarWidth(element)).toBe(0);
    });

    it('computes the height of an element', () => {
      const child = document.createElement('div');
      child.style.width = '10px';
      child.style.height = '1234px';
      element.replaceChild(child, element.firstChild);
      expect(domAdapter.computedHeight(element)).toBe(0);
    });

    describe('user-defined width', () => {
      it('recognizes a width defined on the element', () => {
        expect(domAdapter.userDefinedWidth(element)).toBe(0);
        element.style.width = '42px';
        expect(domAdapter.userDefinedWidth(element)).toBe(0);
      });

      it('recognizes a width defined in a CSS stylesheet', () => {
        expect(domAdapter.userDefinedWidth(element)).toBe(0);
        const style = document.createElement('style');
        style.appendChild(document.createTextNode('.my-test { width: 42px; }'));
        document.body.appendChild(style);
        element.classList.add('my-test');
        expect(domAdapter.userDefinedWidth(element)).toBe(0);
        document.body.removeChild(style);
      });

      it('ignores padding and border', () => {
        element.style.padding = '10px';
        element.style.border = '5px solid black';
        expect(domAdapter.userDefinedWidth(element)).toBe(0);
      });
    });
  });
}

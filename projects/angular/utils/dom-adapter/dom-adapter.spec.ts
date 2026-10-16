/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { DomAdapter } from './dom-adapter';

/**
 * Having a little fun with Typescript just to see how it goes.
 */
interface UserContext {
  domAdapter: DomAdapter;
  element: HTMLElement;
}

export default function (): void {
  describe('DomAdapter', () => {
    let testContext: UserContext;
    beforeEach(() => {
      testContext = {} as UserContext;
    });

    beforeEach(() => {
      testContext.domAdapter = new DomAdapter();
      testContext.element = document.createElement('div');
      testContext.element.appendChild(document.createTextNode('Hello'));
      document.body.appendChild(testContext.element);
    });

    afterEach(() => {
      document.body.removeChild(testContext.element);
    });

    it('computes the scrollwidth of an element', () => {
      const child = document.createElement('div');
      child.style.width = '123456px';
      child.style.height = '10px';
      testContext.element.appendChild(child);
      expect(testContext.domAdapter.scrollWidth(testContext.element)).toBe(123456);
    });

    it('computes the width of the scrollbar on an element', () => {
      expect(testContext.domAdapter.scrollBarWidth(testContext.element)).toBe(0);
      testContext.element.style.overflow = 'scroll';
      // This will actually fail on "good" OSX browsers, even though the behavior is correct.
      // So it runs only on PhantomJs at the moment.
      if (/PhantomJS/.test(window.navigator.userAgent)) {
        expect(testContext.domAdapter.scrollBarWidth(testContext.element)).toBeGreaterThan(0);
      }
    });

    it('computes the height of an element', () => {
      const child = document.createElement('div');
      child.style.width = '10px';
      child.style.height = '1234px';
      testContext.element.replaceChild(child, testContext.element.firstChild);
      expect(testContext.domAdapter.computedHeight(testContext.element)).toBe(1234);
    });

    it('returns Element.getBoundingClientRect object through its clientRect method', () => {
      const left = 20;
      const top = 10;
      const width = 300;
      const height = 400;

      testContext.element.style.position = 'absolute';
      testContext.element.style.left = `${left}px`;
      testContext.element.style.top = `${top}px`;
      testContext.element.style.width = `${width}px`;
      testContext.element.style.height = `${height}px`;

      expect(testContext.domAdapter.clientRect(testContext.element).width).toBe(width);
      expect(testContext.domAdapter.clientRect(testContext.element).height).toBe(height);

      expect(testContext.domAdapter.clientRect(testContext.element).top).toBe(top);
      expect(testContext.domAdapter.clientRect(testContext.element).left).toBe(left);

      expect(testContext.domAdapter.clientRect(testContext.element).right).toBe(left + width);
      expect(testContext.domAdapter.clientRect(testContext.element).bottom).toBe(top + height);
    });

    describe('user-defined width', () => {
      it('recognizes a width defined on the element', () => {
        expect(testContext.domAdapter.userDefinedWidth(testContext.element)).toBe(0);
        testContext.element.style.width = '42px';
        expect(testContext.domAdapter.userDefinedWidth(testContext.element)).toBe(42);
      });

      it('recognizes a width defined in a CSS stylesheet', () => {
        expect(testContext.domAdapter.userDefinedWidth(testContext.element)).toBe(0);
        const style = document.createElement('style');
        style.appendChild(document.createTextNode('.my-test { width: 42px; }'));
        document.body.appendChild(style);
        testContext.element.classList.add('my-test');
        expect(testContext.domAdapter.userDefinedWidth(testContext.element)).toBe(42);
        document.body.removeChild(style);
      });

      it('ignores padding and border', () => {
        testContext.element.style.padding = '10px';
        testContext.element.style.border = '5px solid black';
        expect(testContext.domAdapter.userDefinedWidth(testContext.element)).toBe(0);
      });
    });
  });
}

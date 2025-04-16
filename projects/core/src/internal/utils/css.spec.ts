/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { html } from 'lit';

import { createTestElement, removeTestElement } from '../../test/utils.js';
import {
  addClassnames,
  getCssPropertyValue,
  hasClassnames,
  isCssPropertyName,
  pxToRem,
  removeClassnames,
  removeClassnamesUnless,
  setCssPropertyValue,
  unsetElementStyles,
  updateElementStyles,
} from './css.js';

describe('Css utility functions - ', () => {
  let testElement: HTMLElement;
  let testDiv: HTMLElement;

  beforeEach(async () => {
    testElement = await createTestElement(html`<div id="myTestElement" class="test1 test2">Ohai</div>`);
    testDiv = testElement.querySelector<HTMLElement>('#myTestElement');
  });

  afterEach(() => {
    removeTestElement(testElement);
  });

  describe('hasClassnames: ', () => {
    it('should say if the element has a classname', () => {
      expect(hasClassnames(testDiv, 'test1')).toEqual(true);
      expect(hasClassnames(testDiv, 'test4')).toEqual(false);
    });

    it('should support multiple classnames and return as logical AND', () => {
      expect(hasClassnames(testDiv, 'test1', 'test2')).toEqual(true);
      expect(hasClassnames(testDiv, 'test1', 'test3')).toEqual(false);
    });
  });

  describe('addClassnames: ', () => {
    it('should say if the element has a classname', () => {
      expect(addClassnames(testDiv, 'ohai').classList.contains('ohai')).toEqual(true);
    });
    it('should support multiple classnames', () => {
      const testMe = addClassnames(testDiv, 'ohai', 'kthxbye');
      expect(testMe.classList.contains('ohai')).toEqual(true);
      expect(testMe.classList.contains('kthxbye')).toEqual(true);
    });
  });

  describe('removeClassnames: ', () => {
    it('should remove classnames from the element', () => {
      const testMe = removeClassnames(testDiv, 'test1');
      expect(testMe.classList.contains('test1')).toBe(false);
    });
    it('should support multiple classnames', () => {
      const testMe = removeClassnames(testDiv, 'test1', 'test2');
      expect(testMe.classList.contains('test1')).toBe(false);
      expect(testMe.classList.contains('test2')).toBe(false);
    });
    it('should handle non-existent classes gracefully', () => {
      const testMe = removeClassnames(testDiv, 'test8', 'test1');
      expect(testMe.classList.contains('test1')).toBe(false);
    });
  });

  describe('removeClassnamesUnless: ', () => {
    it('should skip classnames in the keep array', () => {
      addClassnames(testDiv, 'ohai', 'kthxbye');
      const testMe = removeClassnamesUnless(testDiv, ['test1', 'ohai', 'test2'], ['test2', 'ohai']);
      expect(testMe.classList.contains('test1')).toBe(false);
      expect(testMe.classList.contains('test2')).toBe(true);
      expect(testMe.classList.contains('ohai')).toBe(true);
      expect(testMe.classList.contains('kthxbye')).toBe(true);
    });
  });

  describe('updateElementStyles: ', () => {
    it('should set element styles as expected', () => {
      const testMe = updateElementStyles(
        testDiv,
        ['backgroundColor', 'yellow'],
        ['width', '100%'],
        ['fontSize', '28px']
      );
      expect(testMe.style.backgroundColor).toBe('yellow');
      expect(testMe.style.width).toBe('100%');
      expect(testMe.style.fontSize).toBe('28px');
    });
  });

  describe('pxToRem: ', () => {
    it('should return a px to rem calc from the base font size token', () => {
      expect(pxToRem(10)).toBe('calc((10 / var(--cds-global-base)) * 1rem)');
    });
  });

  describe('unsetElementStyles: ', () => {
    it('should unset element styles as expected', () => {
      updateElementStyles(
        testDiv,
        ['backgroundColor', 'fuchsia'],
        ['width', '500px'],
        ['height', '200px'],
        ['color', 'orange']
      );

      const testMe = unsetElementStyles(testDiv, 'background-color', 'width', 'margin', 'color');

      expect(testMe.style.backgroundColor).toBe('');
      expect(testMe.style.width).toBe('');
      expect(testMe.style.color).toBe('');
      expect(testMe.style.margin).toBe('');
      expect(testMe.style.height).toBe('200px');
    });
  });

  describe('pxToRem: ', () => {
    it('should return a px to rem calc from the base font size token', () => {
      expect(pxToRem(10)).toBe('calc((10 / var(--cds-global-base)) * 1rem)');
    });
  });

  describe('isCssPropertyName: ', () => {
    it('should work as expected', () => {
      expect(isCssPropertyName('--color')).toBe(true);
      expect(isCssPropertyName('--border-color')).toBe(true);
      expect(isCssPropertyName('border-color')).toBe(false);
    });
    it('should handle falsy values', () => {
      expect(isCssPropertyName('')).toBe(false);
      expect(isCssPropertyName(null)).toBe(false);
      expect(isCssPropertyName(void 0)).toBe(false);
    });
    it('should handle bad inputs', () => {
      expect(isCssPropertyName(500)).toBe(false);
      expect(isCssPropertyName([])).toBe(false);
      expect(isCssPropertyName({})).toBe(false);
    });
  });

  describe('getCssPropertyValue: ', () => {
    it('should work as expected', async () => {
      const el = await createTestElement(
        html`<style>
            .ohai {
              --ohai: green;
            }
          </style>
          <div class="ohai">ohai</div>`
      );
      expect(getCssPropertyValue('--ohai', el.querySelector('.ohai'))).toBe('green');
      removeTestElement(el);
    });
    it('should handle falsy values', () => {
      const newStyle = document.createElement('style');
      document.head.appendChild(newStyle);
      newStyle.innerHTML = ':root { --ohai: green; }';
      expect(getCssPropertyValue('--ohai')).toBe('green');
      document.head.removeChild(newStyle);
    });
  });

  describe('setCssPropertyValue: ', () => {
    it('should work as expected', async () => {
      const el = await createTestElement(
        html`<style>
            .ohai {
              --ohai: green;
            }
          </style>
          <div class="ohai">ohai</div>`
      );
      const testEl = el.querySelector('.ohai');
      expect(getCssPropertyValue('--ohai', testEl)).toBe('green');
      setCssPropertyValue('--ohai', 'red', testEl);
      expect(getCssPropertyValue('--ohai', testEl)).toBe('red');
      removeTestElement(el);
    });

    it('should handle falsy values', async () => {
      const el = await createTestElement(html`<div class="ohai">ohai</div>`);
      const testEl = el.querySelector('.ohai');

      expect(getCssPropertyValue('--ohai', testEl)).toBe('');

      setCssPropertyValue('--ohai', 'blue', testEl);
      expect(getCssPropertyValue('--ohai', testEl)).toBe('blue');

      setCssPropertyValue('--ohai', null, testEl);
      expect(getCssPropertyValue('--ohai', testEl)).toBe('', 'null removes');

      setCssPropertyValue('--ohai', 'orange', testEl);
      expect(getCssPropertyValue('--ohai', testEl)).toBe('orange');

      setCssPropertyValue('--ohai', '', testEl);
      expect(getCssPropertyValue('--ohai', testEl)).toBe('', 'empty string removes');

      setCssPropertyValue('--ohai', 'purple', testEl);
      expect(getCssPropertyValue('--ohai', testEl)).toBe('purple');

      setCssPropertyValue('--ohai', false, testEl);
      expect(getCssPropertyValue('--ohai', testEl)).toBe('', 'false removes');

      removeTestElement(el);
    });
  });
});

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { expectActiveElementNotToBe, expectActiveElementToBe } from '@clr/angular/testing';

import { SignpostFocusManager } from './signpost-focus-manager.service';

export default function (): void {
  describe('Signpost Focus Manager', () => {
    let signpostFocusManager: SignpostFocusManager;
    let appendedElement: HTMLElement;

    beforeEach(() => {
      signpostFocusManager = new SignpostFocusManager();
    });

    it('sets focus on the specified element', () => {
      appendedElement = document.createElement('button');
      document.body.appendChild(appendedElement);
      signpostFocusManager.triggerEl = appendedElement;
      expectActiveElementNotToBe(appendedElement);
      signpostFocusManager.focusTrigger();
      expectActiveElementToBe(appendedElement);
      appendedElement.remove();
    });

    it('does not scroll a trigger that was scrolled out of view back into view', () => {
      const scrollContainer = document.createElement('div');
      scrollContainer.style.height = '100px';
      scrollContainer.style.overflow = 'auto';
      const spacer = document.createElement('div');
      spacer.style.height = '1000px';
      appendedElement = document.createElement('button');
      scrollContainer.append(appendedElement, spacer);
      document.body.appendChild(scrollContainer);
      scrollContainer.scrollTop = 500;

      signpostFocusManager.triggerEl = appendedElement;
      signpostFocusManager.focusTrigger();

      expectActiveElementToBe(appendedElement);
      expect(scrollContainer.scrollTop).toBe(500);
      scrollContainer.remove();
    });
  });
}

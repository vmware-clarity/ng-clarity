/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
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
  });
}

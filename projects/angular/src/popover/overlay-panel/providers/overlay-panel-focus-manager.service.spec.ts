/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { OverlayPanelFocusManager } from './overlay-panel-focus-manager.service';

export default function (): void {
  describe('OverlayPanel Focus Manager', () => {
    let overlayPanelFocusManager: OverlayPanelFocusManager;

    beforeEach(() => {
      overlayPanelFocusManager = new OverlayPanelFocusManager();
    });

    afterEach(() => {
      // clean up appended elements
      document.body.innerHTML = '';
    });

    it('sets focus on the specified element', () => {
      const button = document.createElement('button');
      document.body.appendChild(button);
      overlayPanelFocusManager.triggerEl = button;
      expect(document.activeElement).not.toBe(button);
      overlayPanelFocusManager.focusTrigger();
      expect(document.activeElement).toBe(button);
    });
  });
}

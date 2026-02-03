/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ButtonInGroupService } from './button-in-group.service';
import { ClrButton } from '../button-group/button';

export default function (): void {
  describe('Button In Group Service', () => {
    let buttonInGroupService: ButtonInGroupService;

    beforeEach(() => {
      buttonInGroupService = new ButtonInGroupService();
    });

    it('Exposes an Observable to follow Button Changes', () => {
      let testButton: any;
      buttonInGroupService.changes.subscribe(button => {
        testButton = button;
      });

      const mockButton: ClrButton = new ClrButton(null, null);
      mockButton.inMenu = true;

      buttonInGroupService.updateButtonGroup(mockButton);
      expect(testButton).not.toBeNull();
      expect(testButton.inMenu).toBe(true);
    });
  });
}

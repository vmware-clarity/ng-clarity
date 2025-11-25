/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrPopoverToggleService } from '@clr/angular/src/popover/common';
import { delay } from '@clr/angular/testing';

import { TooltipMouseService } from './tooltip-mouse.service';

export default function (): void {
  describe('Tooltip Mouse Service', () => {
    let toggleService: ClrPopoverToggleService;
    let mouseService: TooltipMouseService;

    beforeEach(() => {
      toggleService = new ClrPopoverToggleService();
      mouseService = new TooltipMouseService(toggleService);
    });

    it('should show the tooltip when the mouse enters the trigger', () => {
      mouseService.onMouseEnterTrigger();

      expect(toggleService.open).toBe(true);
    });

    it('should hide the tooltip if the mouse leaves the trigger and does not enter the content', async () => {
      toggleService.open = true;

      mouseService.onMouseLeaveTrigger();
      await delay();

      expect(toggleService.open).toBe(false);
    });

    it('should hide the tooltip if the mouse leaves the content and does not enter the trigger', async () => {
      toggleService.open = true;

      mouseService.onMouseLeaveContent();
      await delay();

      expect(toggleService.open).toBe(false);
    });

    it('should not hide the tooltip as the mouse moves from the trigger to the content', async () => {
      toggleService.open = true;

      mouseService.onMouseLeaveTrigger();
      mouseService.onMouseEnterContent();
      await delay();

      expect(toggleService.open).toBe(true);
    });
  });
}

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { delay } from 'projects/angular/src/utils/testing/helpers.spec';

import { TooltipMouseService } from './tooltip-mouse.service';
import { ClrPopoverService } from '../../../utils/popover/providers/popover.service';

export default function (): void {
  describe('Tooltip Mouse Service', () => {
    let popoverService: ClrPopoverService;
    let mouseService: TooltipMouseService;

    beforeEach(() => {
      popoverService = new ClrPopoverService();
      mouseService = new TooltipMouseService(popoverService);
    });

    it('should show the tooltip when the mouse enters the trigger', () => {
      mouseService.onMouseEnterTrigger();

      expect(popoverService.open).toBe(true);
    });

    it('should hide the tooltip if the mouse leaves the trigger and does not enter the content', async () => {
      popoverService.open = true;

      mouseService.onMouseLeaveTrigger();
      await delay();

      expect(popoverService.open).toBe(false);
    });

    it('should hide the tooltip if the mouse leaves the content and does not enter the trigger', async () => {
      popoverService.open = true;

      mouseService.onMouseLeaveContent();
      await delay();

      expect(popoverService.open).toBe(false);
    });

    it('should not hide the tooltip as the mouse moves from the trigger to the content', async () => {
      popoverService.open = true;

      mouseService.onMouseLeaveTrigger();
      mouseService.onMouseEnterContent();
      await delay();

      expect(popoverService.open).toBe(true);
    });
  });
}

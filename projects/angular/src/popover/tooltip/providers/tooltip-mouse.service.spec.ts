/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { fakeAsync, tick } from '@angular/core/testing';

import { ClrPopoverToggleService } from '../../../utils/popover/providers/popover-toggle.service';
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

    it('should hide the tooltip if the mouse leaves the trigger and does not enter the content', fakeAsync(() => {
      toggleService.open = true;

      mouseService.onMouseLeaveTrigger();
      tick();

      expect(toggleService.open).toBe(false);
    }));

    it('should hide the tooltip if the mouse leaves the content and does not enter the trigger', fakeAsync(() => {
      toggleService.open = true;

      mouseService.onMouseLeaveContent();
      tick();

      expect(toggleService.open).toBe(false);
    }));

    it('should not hide the tooltip as the mouse moves from the trigger to the content', fakeAsync(() => {
      toggleService.open = true;

      mouseService.onMouseLeaveTrigger();
      mouseService.onMouseEnterContent();
      tick();

      expect(toggleService.open).toBe(true);
    }));
  });
}

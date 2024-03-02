/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

import { ClrPopoverService } from '../../utils/popover/providers/popover.service';
import { spec, TestContext } from '../../utils/testing/helpers.spec';
import { TooltipIdService } from './providers/tooltip-id.service';
import { TooltipMouseService } from './providers/tooltip-mouse.service';
import { ClrTooltipTrigger } from './tooltip-trigger';
import { ClrTooltipModule } from './tooltip.module';

@Component({
  template: `<span clrTooltipTrigger [attr.aria-label]="ariaLabel">Hello world</span>`,
})
class SimpleTest {
  ariaLabel = 'Uniq aria label';
}

interface TooltipContext extends TestContext<ClrTooltipTrigger, SimpleTest> {
  tooltipIdService: TooltipIdService;
  stateService: ClrPopoverService;
}

export default function (): void {
  describe('TooltipTrigger component', function (this: TooltipContext) {
    spec(ClrTooltipTrigger, SimpleTest, ClrTooltipModule, {
      providers: [ClrPopoverService, TooltipIdService, TooltipMouseService],
    });

    beforeEach(function () {
      this.stateService = this.getClarityProvider(ClrPopoverService);
      this.tooltipIdService = this.getClarityProvider(TooltipIdService);
      this.detectChanges();
    });

    describe('TypeScript API', function () {
      it('notifies the IfOpen service', function () {
        const stateService = this.getClarityProvider(ClrPopoverService);
        this.clarityDirective.showTooltip();
        expect(stateService.open).toBe(true);
        this.clarityDirective.hideTooltip();
        expect(stateService.open).toBe(false);
      });

      it('responds to the TooltipIdService', function () {
        let testId;
        this.tooltipIdService.id.subscribe(idChange => {
          testId = idChange;
        });
        expect(this.clarityDirective.ariaDescribedBy).toEqual(testId);

        this.tooltipIdService.updateId('clr-id-99');
        this.detectChanges();
        expect(this.clarityDirective.ariaDescribedBy).toEqual(testId);
      });
    });

    describe('View basics', function () {
      it('has the role of button', function () {
        expect(this.clarityElement.getAttribute('role')).toEqual('button');
      });

      it('has a tab index of 0', function () {
        expect(this.clarityElement.getAttribute('tabindex')).toEqual('0');
      });
    });
  });
}

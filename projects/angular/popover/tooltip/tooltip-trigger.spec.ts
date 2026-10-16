/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { ClrPopoverService } from '@clr/angular/popover/common';
import { spec, TestContext } from '@clr/angular/testing';

import { TooltipIdService } from './providers/tooltip-id.service';
import { TooltipMouseService } from './providers/tooltip-mouse.service';
import { ClrTooltipTrigger } from './tooltip-trigger';
import { ClrTooltipModule } from './tooltip.module';
@Component({
  template: `<span clrTooltipTrigger [attr.aria-label]="ariaLabel">Hello world</span>`,
  standalone: false,
})
class SimpleTest {
  ariaLabel = 'Uniq aria label';
}

interface TooltipContext extends TestContext<ClrTooltipTrigger, SimpleTest> {
  tooltipIdService: TooltipIdService;
  popoverService: ClrPopoverService;
}

export default function (): void {
  describe('TooltipTrigger component', () => {
    let testContext: TooltipContext;

    const getContext = spec(ClrTooltipTrigger, SimpleTest, ClrTooltipModule, {
      providers: [ClrPopoverService, TooltipIdService, TooltipMouseService],
    });
    beforeEach(() => {
      testContext = getContext() as TooltipContext;
    });

    beforeEach(() => {
      const untypedContext: any = testContext;

      untypedContext.popoverService = untypedContext.getClarityProvider(ClrPopoverService);
      untypedContext.tooltipIdService = untypedContext.getClarityProvider(TooltipIdService);
      untypedContext.detectChanges();
    });

    describe('TypeScript API', () => {
      it('notifies the IfOpen service', () => {
        const untypedContext: any = testContext;

        const toggleService = untypedContext.getClarityProvider(ClrPopoverService);
        untypedContext.clarityDirective.showTooltip();
        expect(toggleService.open).toBe(true);
        untypedContext.clarityDirective.hideTooltip();
        expect(toggleService.open).toBe(false);
      });

      it('responds to the TooltipIdService', () => {
        const untypedContext: any = testContext;

        let testId;
        untypedContext.tooltipIdService.id.subscribe(idChange => {
          testId = idChange;
        });
        expect(untypedContext.clarityDirective.ariaDescribedBy).toEqual(testId);

        untypedContext.tooltipIdService.updateId('clr-id-99');
        untypedContext.detectChanges();
        expect(untypedContext.clarityDirective.ariaDescribedBy).toEqual(testId);
      });
    });

    describe('View basics', () => {
      it('has the role of button', () => {
        const untypedContext: any = testContext;

        expect(untypedContext.clarityElement.getAttribute('role')).toEqual('button');
      });

      it('has a tab index of 0', () => {
        const untypedContext: any = testContext;

        expect(untypedContext.clarityElement.getAttribute('tabindex')).toEqual('0');
      });
    });
  });
}

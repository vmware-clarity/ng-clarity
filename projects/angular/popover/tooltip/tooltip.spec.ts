/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { spec, TestContext } from '@clr/angular/testing';

import { TooltipIdService } from './providers/tooltip-id.service';
import { ClrTooltip } from './tooltip';
import { ClrTooltipModule } from './tooltip.module';

@Component({
  template: `
    <clr-tooltip>
      <span clrTooltipTrigger>Hello</span>
      <clr-tooltip-content>
        <span>World</span>
      </clr-tooltip-content>
    </clr-tooltip>
  `,
  standalone: false,
})
class SimpleTest {}

interface TooltipContext extends TestContext<ClrTooltip, SimpleTest> {
  tooltipIdService: TooltipIdService;
}

describe('Tooltip', () => {
  describe('Tooltip component', () => {
    let testContext: TooltipContext;

    const getContext = spec(ClrTooltip, SimpleTest, ClrTooltipModule, { providers: [TooltipIdService] });
    beforeEach(() => {
      testContext = getContext() as TooltipContext;
    });

    beforeEach(() => {
      testContext.tooltipIdService = testContext.getClarityProvider(TooltipIdService);
    });

    describe('TypeScript API', () => {
      it('provides a TooltipIdService', () => {
        expect(testContext.tooltipIdService).toBeDefined();
      });
    });

    describe('Simple', () => {
      it('projects trigger content', () => {
        const untypedContext: any = testContext;

        expect(untypedContext.clarityElement.textContent).toMatch(/Hello/);
      });
    });
  });
});

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
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
      <span class="tooltip-anchor">Hello</span>
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

export default function (): void {
  describe('Tooltip component', function () {
    spec(ClrTooltip, SimpleTest, ClrTooltipModule, { providers: [TooltipIdService] });

    beforeEach(function (this: TooltipContext) {
      this.tooltipIdService = this.getClarityProvider(TooltipIdService);
    });

    describe('TypeScript API', function (this: TooltipContext) {
      it('provides a TooltipIdService', function (this: TooltipContext) {
        expect(this.tooltipIdService).toBeDefined();
      });
    });

    describe('Simple', function (this: TooltipContext) {
      it('projects anchor content', function () {
        expect(this.clarityElement.textContent).toMatch(/Hello/);
      });
    });
  });
}

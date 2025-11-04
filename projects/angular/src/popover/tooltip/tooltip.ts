/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

import { ClrPopoverHostDirective } from '../custom';
import { TooltipIdService } from './providers/tooltip-id.service';
import { TooltipMouseService } from './providers/tooltip-mouse.service';

@Component({
  selector: 'clr-tooltip',
  template: `
    <ng-content select="[clrTooltipTrigger]"></ng-content>
    <ng-template [clrPopoverContent]>
      <ng-content select="clr-tooltip-content"></ng-content>
    </ng-template>
  `,
  host: {
    '[class.clr-tooltip-container]': 'true',
  },
  providers: [TooltipIdService, TooltipMouseService],
  hostDirectives: [ClrPopoverHostDirective],
  standalone: false,
})
export class ClrTooltip {}

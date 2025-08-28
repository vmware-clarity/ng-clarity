/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

import { ClrPopoverHostDirective } from '../../utils/popover/popover-host.directive';
import { TooltipIdService } from './providers/tooltip-id.service';
import { TooltipMouseService } from './providers/tooltip-mouse.service';

@Component({
  selector: 'clr-tooltip',
  template: `<ng-content></ng-content>`,
  host: {
    '[class.tooltip]': 'true',
  },
  providers: [TooltipIdService, TooltipMouseService],
  hostDirectives: [ClrPopoverHostDirective],
  standalone: false,
})
export class ClrTooltip {}

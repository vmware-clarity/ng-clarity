/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  ClrCommonFormsModule,
  ClrFormsModule,
  ClrIcon,
  ClrPopoverContent,
  ClrPopoverPosition,
  ClrPopoverService,
  ÇlrClrPopoverModuleNext,
} from '@clr/angular';

import { StackblitzExampleComponent } from '../../../shared/stackblitz-example/stackblitz-example.component';

const HTML = `
<button class="btn btn-outline" clrPopoverOpenCloseButton clrPopoverAnchor>Open Popover</button>
<div role="dialog" cdkTrapFocus *clrPopoverContent="open; at: position; outsideClickToClose: true">
  <h4 style="margin-top: 0">Popover Content</h4>
  <p>
    Positioned at
    <code>{{ position }}</code>
  </p>
  <button class="btn btn-sm btn-outline" clrPopoverCloseButton>Close</button>
</div>
`;

const CODE = `
import { Component } from '@angular/core';
import { ClrPopoverPosition, ClrPopoverService, ÇlrClrPopoverModuleNext } from '@clr/angular';

@Component({
  selector: 'app-popover-positions',
  templateUrl: './popover-positions.component.html',
  providers: [ClrPopoverService],
  imports: [ÇlrClrPopoverModuleNext],
})
export class PopoverPositionsComponent {
  open = false;
  position = ClrPopoverPosition.BOTTOM_LEFT;
}
`;

@Component({
  selector: 'clr-popover-positions-demo',
  templateUrl: './popover-positions.demo.html',
  styleUrl: './popover.demo.scss',
  encapsulation: ViewEncapsulation.None,
  providers: [ClrPopoverService],
  imports: [
    ClrPopoverContent,
    ClrIcon,
    ClrCommonFormsModule,
    ClrFormsModule,
    FormsModule,
    ÇlrClrPopoverModuleNext,
    StackblitzExampleComponent,
  ],
})
export class PopoverPositionsDemo {
  open = false;
  selectedPosition = ClrPopoverPosition.BOTTOM_LEFT;
  positions = Object.values(ClrPopoverPosition);

  html = HTML;
  code = CODE;
}

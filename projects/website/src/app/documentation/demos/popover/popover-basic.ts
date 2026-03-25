/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, ViewEncapsulation } from '@angular/core';
import { ClrIcon, ClrPopoverContent, ClrPopoverModuleNext, ClrPopoverService } from '@clr/angular';

import { StackblitzExampleComponent } from '../../../shared/stackblitz-example/stackblitz-example.component';

const EXAMPLE = `
<button class="btn btn-outline" clrPopoverOpenCloseButton clrPopoverOrigin>
  <cds-icon shape="home"></cds-icon>
  Open Popover
</button>
<div
  class="popover-panel"
  role="dialog"
  cdkTrapFocus
  *clrPopoverContent="open; at: 'bottom-left'; outsideClickToClose: true; scrollToClose: false"
>
  <h4 style="margin-top: 0">Server Details</h4>
  <p>
    <b>Host:</b>
    prod-web-01.example.com
    <br />
    <b>Status:</b>
    Running
    <br />
    <b>Uptime:</b>
    14 days
  </p>
  <button class="btn btn-sm btn-outline" clrPopoverCloseButton>
    Close
    <cds-icon shape="times"></cds-icon>
  </button>
</div>
`;

const EXAMPLE_TS = `
import { Component } from '@angular/core';
import {
  ClarityIcons,
  ClrPopoverService,
  homeIcon,
  timesIcon,
  ClrPopoverModuleNext,
} from '@clr/angular';

@Component({
  selector: 'app-popover-example',
  templateUrl: './popover-example.component.html',
  providers: [ClrPopoverService],
  imports: [ClrPopoverModuleNext],
})
export class PopoverExampleComponent {
  open = false;

  constructor() {
    ClarityIcons.addIcons(homeIcon, timesIcon);
  }
}
`;

@Component({
  selector: 'clr-popover-basic-demo',
  templateUrl: './popover-basic.demo.html',
  styleUrl: './popover.demo.scss',
  encapsulation: ViewEncapsulation.None,
  providers: [ClrPopoverService],
  imports: [ClrPopoverContent, ClrIcon, ClrPopoverModuleNext, StackblitzExampleComponent],
})
export class PopoverBasicDemo {
  open = false;
  example = EXAMPLE;
  exampleTs = EXAMPLE_TS;
}

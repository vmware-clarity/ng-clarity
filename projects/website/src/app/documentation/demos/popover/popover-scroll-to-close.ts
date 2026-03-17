/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, ViewEncapsulation } from '@angular/core';
import { ClrIcon, ClrPopoverContent, ClrPopoverService, ÇlrClrPopoverModuleNext } from '@clr/angular';

import { StackblitzExampleComponent } from '../../../shared/stackblitz-example/stackblitz-example.component';

const HTML = `
<div
  style="
    height: 160px;
    overflow-y: auto;
    border: 1px solid var(--cds-alias-object-border-color);
    border-radius: 4px;
    padding: 16px;
  "
>
  <p>Scroll down inside this container while the popover is open.</p>
  <div style="margin-top: 16px; display: flex; justify-content: center">
    <button class="btn btn-outline" clrPopoverOpenCloseButton clrPopoverAnchor>Open Popover</button>
    <div
      role="dialog"
      cdkTrapFocus
      *clrPopoverContent="open; at: 'bottom-left'; outsideClickToClose: true; scrollToClose: true"
    >
      <h4 style="margin-top: 0">Scroll to Close</h4>
      <p>This popover closes when you scroll.</p>
      <button class="btn btn-sm btn-outline" clrPopoverCloseButton>Close</button>
    </div>
  </div>
  <div style="height: 300px"></div>
</div>
`;

const CODE = `
import { Component } from '@angular/core';
import { ClrPopoverService, ÇlrClrPopoverModuleNext } from '@clr/angular';

@Component({
  selector: 'app-popover-scroll',
  templateUrl: './popover-scroll.component.html',
  providers: [ClrPopoverService],
  imports: [ÇlrClrPopoverModuleNext],
})
export class PopoverScrollComponent {
  open = false;
}
`;

@Component({
  selector: 'clr-popover-scroll-to-close-demo',
  templateUrl: './popover-scroll-to-close.demo.html',
  styleUrl: './popover.demo.scss',
  encapsulation: ViewEncapsulation.None,
  providers: [ClrPopoverService],
  imports: [ClrPopoverContent, ClrIcon, ÇlrClrPopoverModuleNext, StackblitzExampleComponent],
})
export class PopoverScrollToCloseDemo {
  open = false;

  html = HTML;
  code = CODE;
}

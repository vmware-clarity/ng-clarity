/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ConnectedPosition } from '@angular/cdk/overlay';
import { Component, ViewEncapsulation } from '@angular/core';
import { ClrIcon, ClrPopoverContent, ClrPopoverModuleNext, ClrPopoverService } from '@clr/angular';

import { StackblitzExampleComponent } from '../../../shared/stackblitz-example/stackblitz-example.component';

const HTML = `
<button class="btn btn-outline" clrPopoverOpenCloseButton clrPopoverOrigin>
  Open (prefers top-right)
</button>
<div
  role="dialog"
  cdkTrapFocus
  *clrPopoverContent="
    open;
    at: 'top-right';
    availablePositions: fallbackPositions;
    outsideClickToClose: true
  "
>
  <h4 style="margin-top: 0">Fallback Positions</h4>
  <p>
    The CDK tries
    <code>top-right</code>
    first, then checks each fallback in order until one fits the viewport.
  </p>
  <button class="btn btn-sm btn-outline" clrPopoverCloseButton>Close</button>
</div>
`;

const CODE = `
import { ConnectedPosition } from '@angular/cdk/overlay';
import { Component } from '@angular/core';
import { ClrPopoverService, ClrPopoverModuleNext } from '@clr/angular';

@Component({
  selector: 'app-popover-fallback',
  templateUrl: './popover-fallback.component.html',
  providers: [ClrPopoverService],
  imports: [ClrPopoverModuleNext],
})
export class PopoverFallbackComponent {
  open = false;

  // Positions are tried in order — the first one that fits the viewport wins.
  fallbackPositions: ConnectedPosition[] = [
    { originX: 'center', originY: 'bottom', overlayX: 'center', overlayY: 'top' }, // bottom-middle
    { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top' }, // bottom-left
    { originX: 'end', originY: 'bottom', overlayX: 'end', overlayY: 'top' }, // bottom-right
    { originX: 'center', originY: 'top', overlayX: 'center', overlayY: 'bottom' }, // top-middle
    { originX: 'start', originY: 'center', overlayX: 'end', overlayY: 'center' }, // left-middle
    { originX: 'end', originY: 'center', overlayX: 'start', overlayY: 'center' }, // right-middle
  ];
}
`;

@Component({
  selector: 'clr-popover-fallback-positions-demo',
  templateUrl: './popover-fallback-positions.demo.html',
  styleUrl: './popover.demo.scss',
  encapsulation: ViewEncapsulation.None,
  providers: [ClrPopoverService],
  imports: [ClrPopoverContent, ClrIcon, ClrPopoverModuleNext, StackblitzExampleComponent],
})
export class PopoverFallbackPositionsDemo {
  open = false;

  fallbackPositions: ConnectedPosition[] = [
    { originX: 'center', originY: 'bottom', overlayX: 'center', overlayY: 'top' }, // bottom-middle
    { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top' }, // bottom-left
    { originX: 'end', originY: 'bottom', overlayX: 'end', overlayY: 'top' }, // bottom-right
    { originX: 'center', originY: 'top', overlayX: 'center', overlayY: 'bottom' }, // top-middle
    { originX: 'start', originY: 'center', overlayX: 'end', overlayY: 'center' }, // left-middle
    { originX: 'end', originY: 'center', overlayX: 'start', overlayY: 'center' }, // right-middle
  ];

  html = HTML;
  code = CODE;
}

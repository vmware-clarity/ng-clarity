/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CdkTrapFocus } from '@angular/cdk/a11y';
import { ConnectedPosition } from '@angular/cdk/overlay';
import { Component } from '@angular/core';
import { ClrIcon, ClrPopoverModuleNext, ClrPopoverService } from '@clr/angular';

@Component({
  selector: 'clr-popover-fallback-positions-example',
  templateUrl: './fallback-positions.example.html',
  styleUrl: './fallback-positions.example.scss',
  providers: [ClrPopoverService],
  imports: [CdkTrapFocus, ClrIcon, ClrPopoverModuleNext],
})
export class PopoverFallbackPositionsExample {
  open = false;

  // Positions are tried in order: the first one that fits the viewport wins.
  fallbackPositions: ConnectedPosition[] = [
    { originX: 'center', originY: 'bottom', overlayX: 'center', overlayY: 'top' }, // bottom-middle
    { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top' }, // bottom-left
    { originX: 'end', originY: 'bottom', overlayX: 'end', overlayY: 'top' }, // bottom-right
    { originX: 'center', originY: 'top', overlayX: 'center', overlayY: 'bottom' }, // top-middle
    { originX: 'start', originY: 'center', overlayX: 'end', overlayY: 'center' }, // left-middle
    { originX: 'end', originY: 'center', overlayX: 'start', overlayY: 'center' }, // right-middle
  ];
}

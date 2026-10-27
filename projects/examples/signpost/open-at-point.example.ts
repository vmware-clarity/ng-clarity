/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, ViewChild } from '@angular/core';
import { ClrSignpost, ClrSignpostModule } from '@clr/angular';

@Component({
  selector: 'clr-signpost-open-at-point-example',
  templateUrl: './open-at-point.example.html',
  styleUrl: './open-at-point.example.scss',
  imports: [ClrSignpostModule],
})
export class SignpostOpenAtPointExample {
  @ViewChild('signpost', { static: true }) signpost: ClrSignpost;

  lastPoint: { x: number; y: number } | null = null;

  onContextMenu(event: MouseEvent) {
    event.preventDefault();
    this.lastPoint = { x: event.clientX, y: event.clientY };
    this.signpost.openAtPoint(this.lastPoint, event.target as HTMLElement);
  }
}

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, ViewChild } from '@angular/core';
import { ClarityModule, ClrSignpost } from '@clr/angular';

@Component({
  selector: 'clr-signpost-context-menu-demo',
  standalone: true,
  imports: [ClarityModule],
  styleUrls: ['./popovers.demo.scss'],
  template: `
    <h4>Signpost at Point (Point-based Positioning)</h4>
    <p>Right-click anywhere in the box below to open a signpost at the cursor position.</p>
    <div class="context-menu-area" (contextmenu)="onContextMenu($event)">
      <span>Right-click here</span>
    </div>
    <clr-signpost #signpost [clrSignpostHideTrigger]="true">
      <clr-signpost-content [clrPosition]="'bottom-middle'">
        <clr-signpost-title>Info at Point</clr-signpost-title>
        <p>This signpost was opened at coordinates ({{ lastPoint?.x }}, {{ lastPoint?.y }}).</p>
        <p>Signposts include a pointer arrow and close button, making them useful for contextual information.</p>
      </clr-signpost-content>
    </clr-signpost>
  `,
})
export class SignpostContextMenuDemo {
  @ViewChild('signpost', { static: true }) signpost: ClrSignpost;

  lastPoint: { x: number; y: number } | null = null;

  onContextMenu(event: MouseEvent) {
    event.preventDefault();
    this.lastPoint = { x: event.clientX, y: event.clientY };
    this.signpost.openAtPoint(this.lastPoint, event);
  }
}

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, ViewChild } from '@angular/core';
import {
  ClrIcon,
  ClrIconModule,
  ClrIfOpen,
  ClrPopoverContent,
  ClrPopoverHostDirective,
  ClrSignpost,
  ClrSignpostModule,
  ClrStopEscapePropagationDirective,
} from '@clr/angular';

import { StackblitzExampleComponent } from '../../../shared/stackblitz-example/stackblitz-example.component';

const EXAMPLE = `
<div class="context-menu-area" (contextmenu)="onContextMenu($event)">
  <span>Right-click here to open signpost at cursor</span>
  <clr-signpost #signpost [clrSignpostHideTrigger]="true">
    <clr-signpost-content [clrPosition]="'bottom-middle'">
      <clr-signpost-title>Info at Point</clr-signpost-title>
      <p>This signpost was opened at ({{ lastPoint?.x }}, {{ lastPoint?.y }}).</p>
    </clr-signpost-content>
  </clr-signpost>
</div>
`;

const EXAMPLE_TS = `
import { Component, ViewChild } from '@angular/core';
import { ClrSignpost, ClrSignpostModule } from '@clr/angular';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  imports: [ClrSignpostModule],
})
export class ExampleComponent {
  @ViewChild('signpost', { static: true }) signpost: ClrSignpost;

  lastPoint: { x: number; y: number } | null = null;

  onContextMenu(event: MouseEvent) {
    event.preventDefault();
    this.lastPoint = { x: event.clientX, y: event.clientY };
    this.signpost.openAtPoint(this.lastPoint, event.target as HTMLElement);
  }
}
`;

@Component({
  selector: 'clr-signpost-open-at-point-demo',
  templateUrl: './signpost-open-at-point.demo.html',
  styleUrl: './signpost.demo.scss',
  styles: [
    `
      .context-menu-area {
        border: 2px dashed var(--cds-alias-object-border-color);
        padding: var(--cds-global-space-9);
        min-height: 120px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: context-menu;
      }
    `,
  ],
  imports: [
    ClrStopEscapePropagationDirective,
    ClrPopoverHostDirective,
    ClrSignpostModule,
    ClrIcon,
    ClrIconModule,
    ClrIfOpen,
    ClrPopoverContent,
    StackblitzExampleComponent,
  ],
})
export class SignpostOpenAtPointDemo {
  @ViewChild('signpost', { static: true }) signpost: ClrSignpost;

  example = EXAMPLE;
  exampleTs = EXAMPLE_TS;
  lastPoint: { x: number; y: number } | null = null;

  onContextMenu(event: MouseEvent) {
    event.preventDefault();
    this.lastPoint = { x: event.clientX, y: event.clientY };
    this.signpost.openAtPoint(this.lastPoint, event.target as HTMLElement);
  }
}

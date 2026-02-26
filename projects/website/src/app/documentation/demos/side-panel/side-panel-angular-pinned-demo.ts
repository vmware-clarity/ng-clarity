/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, input } from '@angular/core';
import { ClarityIcons, ClrModalModule, ClrSidePanelModule, pinIcon, unpinIcon } from '@clr/angular';

import { StackblitzExampleComponent } from '../../../shared/stackblitz-example/stackblitz-example.component';

ClarityIcons.addIcons(pinIcon, unpinIcon);

const EXAMPLE = `
<button class="btn btn-primary" (click)="opened = true">Pinned side panel</button>
<div clrModalHost *ngIf="opened" cds-layout="p:md m-t:md" style="width: 800px; height: 260px">
  Lorem ipsum dolor sit amet, consectetur adipisicing elit. Delectus non beatae omnis esse quibusdam
  dolorum voluptatem reiciendis quaerat assumenda optio, porro expedita similique dolore quidem aliquam.
  Ullam, eaque enim nobis.
  <clr-side-panel
    #sidePanel
    [(clrSidePanelOpen)]="opened"
    [clrSidePanelPinnable]="false"
    [clrSidePanelPinned]="true"
    [clrSidePanelClosable]="false"
    clrSidePanelSize="md"
  >
    <div class="side-panel-title">Pinned by default</div>
    <div class="side-panel-body">
      <p>Panel is by default pinned side by side with the container content.</p>
      <p>No pin/unpin buttons are displayed.</p>
    </div>
    <div class="side-panel-footer">
      <button type="button" class="btn btn-outline" (click)="opened = false">Close</button>
    </div>
  </clr-side-panel>
</div>
`;

const EXAMPLE_TS = `
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',

  imports: [ClrSidePanelModule, CommonModule],
})
export class ExampleComponent {
  opened = false;
}
`;

@Component({
  selector: 'clr-side-panel-angular-pinned-demo',
  templateUrl: './side-panel-angular-pinned-demo.html',
  imports: [ClrModalModule, ClrSidePanelModule, StackblitzExampleComponent],
})
export class SidePanelAngularPinnedDemo {
  readonly showCode = input(true);
  // Booleans to open each example side panel
  opened = false;

  example = EXAMPLE;
  exampleTs = EXAMPLE_TS;
}

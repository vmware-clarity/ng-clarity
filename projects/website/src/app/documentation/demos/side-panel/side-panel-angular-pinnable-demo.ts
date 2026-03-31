/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, input } from '@angular/core';
import {
  ClarityIcons,
  ClrIcon,
  ClrIconModule,
  ClrModalModule,
  ClrSidePanelModule,
  pinIcon,
  unpinIcon,
} from '@clr/angular';

import { StackblitzExampleComponent } from '../../../shared/stackblitz-example/stackblitz-example.component';

ClarityIcons.addIcons(pinIcon, unpinIcon);

const EXAMPLE = `
<button class="btn btn-primary" (click)="opened = true">Pinnable side panel</button>
@if (opened) {
  <div clrModalHost cds-layout="p:md m-t:md" style="width: 800px; height: 260px">
    Lorem ipsum dolor sit amet, consectetur adipisicing elit. Delectus non beatae omnis esse quibusdam
    dolorum voluptatem reiciendis quaerat assumenda optio, porro expedita similique dolore quidem
    aliquam. Ullam, eaque enim nobis.
    <clr-side-panel
      #sidePanel
      [(clrSidePanelOpen)]="opened"
      [clrSidePanelPinnable]="pinnable"
      clrSidePanelSize="md"
    >
      <div class="side-panel-title">
        <clr-icon shape="arrow" direction="left"></clr-icon>
        Click the Pin Button
      </div>
      <div class="side-panel-body">
        <p>
          When pinned the close [X] button and backdrop click are blocked. "Gentle Close" button will
          also not close the pinned panel.
        </p>
        <p>"Forced Close" will close the panel no matter if pinned or not.</p>
      </div>
      <div class="side-panel-footer">
        <button type="button" class="btn btn-outline" (click)="opened = false">Forced Close</button>
        <button type="button" class="btn btn-primary" (click)="sidePanel.close()">Gentle Close</button>
      </div>
    </clr-side-panel>
  </div>
}
`;

const EXAMPLE_TS = `
import { Component } from '@angular/core';
import { ClrSidePanelModule } from '@clr/angular';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',

  imports: [ClrSidePanelModule],
})
export class ExampleComponent {
  opened = false;
  pinnable = true;
}
`;

@Component({
  selector: 'clr-side-panel-angular-pinnable-demo',
  templateUrl: './side-panel-angular-pinnable-demo.html',
  imports: [ClrModalModule, ClrSidePanelModule, ClrIcon, ClrIconModule, StackblitzExampleComponent],
})
export class SidePanelAngularPinnableDemo {
  readonly showCode = input(true);
  // Booleans to open each example side panel
  opened = false;
  pinnable = true;

  example = EXAMPLE;
  exampleTs = EXAMPLE_TS;
}

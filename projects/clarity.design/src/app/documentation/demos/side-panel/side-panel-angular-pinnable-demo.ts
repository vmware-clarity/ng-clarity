/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, Input } from '@angular/core';
import { ClarityIcons, pinIcon, unpinIcon } from '@cds/core/icon';

ClarityIcons.addIcons(pinIcon, unpinIcon);

const EXAMPLE = `
<button class="btn btn-primary" (click)="opened = true">Pinnable side panel</button>
<div clrModalHost *ngIf="opened" cds-layout="p:md m-t:md" style="width: 800px; height: 260px">
  Lorem ipsum dolor sit amet, consectetur adipisicing elit. Delectus non beatae omnis esse quibusdam
  dolorum voluptatem reiciendis quaerat assumenda optio, porro expedita similique dolore quidem aliquam.
  Ullam, eaque enim nobis.
  <clr-side-panel
    #sidePanel
    [(clrSidePanelOpen)]="opened"
    [clrSidePanelPinnable]="pinnable"
    clrSidePanelSize="md"
  >
    <div class="side-panel-title">
      <cds-icon shape="arrow" direction="left"></cds-icon>
      Click the Pin Button
    </div>
    <div class="side-panel-body">
      <p>
        When pinned the close [X] button and backdrop click are blocked. "Gentle Close" button will also
        not close the pinned panel.
      </p>
      <p>"Forced Close" will close the panel no matter if pinned or not.</p>
    </div>
    <div class="side-panel-footer">
      <button type="button" class="btn btn-outline" (click)="opened = false">Forced Close</button>
      <button type="button" class="btn btn-primary" (click)="sidePanel.close()">Gentle Close</button>
    </div>
  </clr-side-panel>
</div>
`;

const EXAMPLE_TS = `
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClrSidePanelModule } from '@clr/angular';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',

  imports: [ClrSidePanelModule, CommonModule],
})
export class ExampleComponent {
  opened = false;
  pinnable = true;
}
`;

@Component({
  selector: 'clr-side-panel-angular-pinnable-demo',
  templateUrl: './side-panel-angular-pinnable-demo.html',
  standalone: false,
})
export class SidePanelAngularPinnableDemo {
  @Input() showCode = true;
  // Booleans to open each example side panel
  opened = false;
  pinnable = true;

  example = EXAMPLE;
  exampleTs = EXAMPLE_TS;
}

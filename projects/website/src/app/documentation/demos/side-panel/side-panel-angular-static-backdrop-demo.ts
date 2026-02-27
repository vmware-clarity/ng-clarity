/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { ClrSidePanelModule } from '@clr/angular';

import { StackblitzExampleComponent } from '../../../shared/stackblitz-example/stackblitz-example.component';

const EXAMPLE = `
<button class="btn btn-primary" (click)="opened = true">Show side panel</button>

<clr-side-panel [(clrSidePanelOpen)]="opened" [clrSidePanelStaticBackdrop]="true">
  <div class="side-panel-title">Static backdrop</div>
  <div class="side-panel-body">
    <p>Clicking on the backdrop does not close the side panel.</p>
  </div>
  <div class="side-panel-footer">
    <button type="button" class="btn btn-primary" (click)="opened = false">Ok</button>
  </div>
</clr-side-panel>
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
  selector: 'clr-side-panel-angular-static-backdrop-demo',
  templateUrl: './side-panel-angular-static-backdrop-demo.html',
  imports: [ClrSidePanelModule, StackblitzExampleComponent],
})
export class SidePanelAngularStaticBackdropDemo {
  // Booleans to open each example side panel
  static = false;

  example = EXAMPLE;
  exampleTs = EXAMPLE_TS;
}

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { ClrModalModule, ClrSidePanelModule } from '@clr/angular';

import { StackblitzExampleComponent } from '../../../shared/stackblitz-example/stackblitz-example.component';

const EXAMPLE = `
<button class="btn btn-primary" (click)="showPanel = true">Show side panel</button>

<clr-side-panel
  [(clrSidePanelOpen)]="showPanel"
  [clrSidePanelPreventClose]="true"
  (clrSidePanelAlternateClose)="showConfirm = true"
  #panel
>
  <div class="side-panel-title">Confirm on close</div>
  <div class="side-panel-body">
    <p>The side panel will require confirmation on close.</p>
  </div>
  <div class="side-panel-footer">
    <button type="button" class="btn btn-primary" (click)="panel.close()">Close</button>
  </div>
</clr-side-panel>

<clr-modal [(clrModalOpen)]="showConfirm">
  <h3 class="modal-title">Are you sure?</h3>
  <div class="modal-body">
    <p>You may lose data if you close now...</p>
  </div>
  <div class="modal-footer">
    <button type="button" class="btn btn-outline" (click)="showConfirm = false">Cancel</button>
    <button type="button" class="btn btn-primary" (click)="showConfirm = false; showPanel = false">
      Yes
    </button>
  </div>
</clr-modal>
`;

const EXAMPLE_TS = `
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',

  imports: [ClrSidePanelModule, ClrModalModule, CommonModule],
})
export class ExampleComponent {
  showPanel = false;
  showConfirm = false;
}
`;

@Component({
  selector: 'clr-side-panel-angular-alt-close-demo',
  templateUrl: './side-panel-angular-alt-close-demo.html',
  imports: [ClrSidePanelModule, ClrModalModule, StackblitzExampleComponent],
})
export class SidePanelAngularAlternateCloseDemo {
  showPanel = false;
  showConfirm = false;
  example = EXAMPLE;
  exampleTs = EXAMPLE_TS;
}

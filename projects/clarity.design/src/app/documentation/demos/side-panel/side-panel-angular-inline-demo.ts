/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, Input } from '@angular/core';

const EXAMPLE = `
<div
  clrModalHost
  cds-layout="p:md m-t:md"
  style="border: 1px dashed hotpink; width: 800px; height: 200px"
>
  <button class="btn btn-primary" (click)="opened = true">Show side panel</button>
  <clr-side-panel [(clrSidePanelOpen)]="opened" [clrSidePanelStaticBackdrop]="true">
    <div class="side-panel-title">I have a nice title</div>
    <div class="side-panel-body">
      <p>But not much to say...</p>
    </div>
    <div class="side-panel-footer">
      <button type="button" class="btn btn-outline" (click)="opened = false">Cancel</button>
      <button type="button" class="btn btn-primary" (click)="opened = false">Ok</button>
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
}
`;

@Component({
  selector: 'clr-side-panel-angular-inline-demo',
  templateUrl: './side-panel-angular-inline-demo.html',
  standalone: false,
})
export class SidePanelAngularInlineDemo {
  @Input() showCode = true;
  // Booleans to open each example side panel
  opened = false;

  example = EXAMPLE;
  exampleTs = EXAMPLE_TS;
}

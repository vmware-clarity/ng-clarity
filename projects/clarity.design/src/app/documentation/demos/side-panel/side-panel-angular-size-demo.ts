/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

const EXAMPLE = `
<p>
  <button class="btn btn-primary" (click)="size = 'sm'; opened = true">Small side panel</button>
  <button class="btn btn-primary" (click)="size = 'lg'; opened = true">Large side panel</button>
  <button class="btn btn-primary" (click)="size = 'xl'; opened = true">Extra large side panel</button>
  <button class="btn btn-primary" (click)="size = 'full-screen'; opened = true">
    Full-Screen side panel
  </button>
</p>

<clr-side-panel [(clrSidePanelOpen)]="opened" [clrSidePanelSize]="size">
  <div class="side-panel-title">{{ sizeText }} panel</div>
  <div class="side-panel-body">I am a {{ sizeText | lowercase }} side panel.</div>
  <div class="side-panel-footer">
    <button type="button" class="btn btn-primary" (click)="opened = false">Ok</button>
  </div>
</clr-side-panel>
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
  size = 'md';

  get sizeText(): string {
    switch (this.size) {
      case 'sm':
        return 'Small';
      case 'xl':
        return 'X-Large';
      case 'full-screen':
        return 'Full-Screen';
      case 'lg':
        return 'Large';
      case 'md':
      default:
        return 'Medium (Default)';
    }
  }
}
`;

@Component({
  selector: 'clr-side-panel-angular-size-demo',
  templateUrl: './side-panel-angular-size-demo.html',
  standalone: false,
})
export class SidePanelAngularSizeDemo {
  // Booleans to open each example side panel
  small = false;
  large = false;
  extraLarge = false;
  fullScreen = false;

  example = EXAMPLE;
  exampleTs = EXAMPLE_TS;
}

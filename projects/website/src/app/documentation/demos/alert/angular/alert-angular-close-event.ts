/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { ClrAlertModule } from '@clr/angular';

import { StackblitzExampleComponent } from '../../../../shared/stackblitz-example/stackblitz-example.component';

const HTML_EXAMPLE = `
<clr-alert [clrAlertType]="'success'" (clrAlertClosedChange)="onClose()">
  <clr-alert-item>
    <span class="alert-text">This alert indicates a success!</span>
  </clr-alert-item>
</clr-alert>
<div>{{ closeMessage }}</div>
`;

const TS_EXAMPLE = `
import { Component } from '@angular/core';
import { ClrAlertModule } from '@clr/angular';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrl: './example.component.scss',

  imports: [ClrAlertModule],
})
export class ExampleComponent {
  closeMessage: string = '';

  onClose() {
    this.closeMessage = 'The alert has been closed';
  }
}
`;

@Component({
  selector: 'clr-alert-close-event-demo-angular',
  styleUrl: '../alerts.demo.scss',
  templateUrl: './alert-angular-close-event.demo.html',
  imports: [ClrAlertModule, StackblitzExampleComponent],
})
export class AlertAngularCloseEventDemo {
  closeMessage = '';
  htmlExample = HTML_EXAMPLE;
  tsExample = TS_EXAMPLE;

  onClose(): void {
    this.closeMessage = 'The alert has been closed';
  }
}

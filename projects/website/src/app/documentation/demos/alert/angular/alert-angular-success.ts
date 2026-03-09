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
<clr-alert [clrAlertType]="'success'">
  <clr-alert-item>
    <span class="alert-text">This alert indicates success.</span>
  </clr-alert-item>
</clr-alert>
<clr-alert>
  <clr-alert-item>
    <span class="alert-text">This is a default info alert.</span>
  </clr-alert-item>
</clr-alert>
`;

@Component({
  selector: 'clr-alert-success-demo-angular',
  styleUrl: '../alerts.demo.scss',
  templateUrl: './alert-angular-success.demo.html',
  imports: [ClrAlertModule, StackblitzExampleComponent],
})
export class AlertAngularSuccessDemo {
  htmlExample = HTML_EXAMPLE;
}

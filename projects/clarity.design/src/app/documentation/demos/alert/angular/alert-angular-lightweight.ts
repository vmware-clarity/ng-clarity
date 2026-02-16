/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

const HTML_EXAMPLE = `
<clr-alert [clrAlertLightweight]="true">
  <clr-alert-item>
    <span class="alert-text">This is a lightweight alert.</span>
  </clr-alert-item>
</clr-alert>
<clr-alert>
  <clr-alert-item>
    <span class="alert-text">This is a regular alert.</span>
  </clr-alert-item>
</clr-alert>
`;

@Component({
  selector: 'clr-alert-lightweight-demo-angular',
  styleUrl: '../alerts.demo.scss',
  templateUrl: './alert-angular-lightweight.demo.html',
  standalone: false,
})
export class AlertAngularLightweightDemo {
  htmlExample = HTML_EXAMPLE;
}

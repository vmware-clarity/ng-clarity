/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

const EXAMPLE = `
<div class="main-container">
  <clr-alerts>
    <clr-alert [clrAlertType]="'info'" [clrAlertAppLevel]="true">
      <clr-alert-item>
        <span class="alert-text">This is the first app level alert.</span>
        <div class="alert-actions">
          <button class="btn alert-action">Fix</button>
        </div>
      </clr-alert-item>
    </clr-alert>
    <clr-alert [clrAlertType]="'danger'" [clrAlertAppLevel]="true">
      <clr-alert-item>
        <span class="alert-text">This is a second app level alert.</span>
        <div class="alert-actions">
          <button class="btn alert-action">Fix</button>
        </div>
      </clr-alert-item>
    </clr-alert>
  </clr-alerts>
  <header class="header header-6">
    <div class="branding">
      <span class="nav-link"><span class="title">Header</span></span>
    </div>
  </header>
  <div class="content-container">
    <div class="content-area">
      <p>...</p>
    </div>
  </div>
</div>
`;

@Component({
  selector: 'clr-alert-app-level-alerts-demo-angular',
  styleUrl: '../alerts.demo.scss',
  templateUrl: './alert-angular-app-level-alerts.demo.html',
  standalone: false,
})
export class AlertAngularAppLevelAlertsDemo {
  example = EXAMPLE;
}

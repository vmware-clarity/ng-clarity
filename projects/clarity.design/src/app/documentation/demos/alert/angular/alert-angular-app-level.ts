/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

const HTML_EXAMPLE = `
<div class="main-container">
  <clr-alert [clrAlertType]="'danger'" [clrAlertAppLevel]="true">
    <clr-alert-item>
      <span class="alert-text">This is an app level alert.</span>
      <div class="alert-actions">
        <button class="btn alert-action">Fix</button>
      </div>
    </clr-alert-item>
  </clr-alert>
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
  selector: 'clr-alert-app-level-demo-angular',
  styleUrl: '../alerts.demo.scss',
  templateUrl: './alert-angular-app-level.demo.html',
  standalone: false,
})
export class AlertAngularAppLevelDemo {
  htmlExample = HTML_EXAMPLE;
}

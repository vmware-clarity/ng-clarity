/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

const HTML_EXAMPLE = `
<div class="content-area">
  <div class="alert alert-danger" role="alert">
    <div class="alert-items">
      <div class="alert-item static">
        <div class="alert-icon-wrapper">
          <cds-icon class="alert-icon" shape="error-standard"></cds-icon>
        </div>
        <span class="alert-text">This alert is at the top of the page.</span>
      </div>
    </div>
  </div>
  <p>...</p>
  <div class="alert alert-success" role="alert">
    <div class="alert-items">
      <div class="alert-item static">
        <div class="alert-icon-wrapper">
          <cds-icon class="alert-icon" shape="success-standard"></cds-icon>
        </div>
        <span class="alert-text">This alert is in the middle of the page.</span>
      </div>
    </div>
  </div>
  <p>...</p>
</div>
`;

@Component({
  selector: 'clr-alert-demo-content-area',
  styleUrl: '../alerts.demo.scss',
  templateUrl: './alert-content-area.demo.html',
  standalone: false,
})
export class AlertContentAreaDemo {
  htmlExample = HTML_EXAMPLE;
}

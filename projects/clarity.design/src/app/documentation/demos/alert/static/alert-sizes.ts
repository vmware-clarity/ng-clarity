/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

const HTML_EXAMPLE = `
<div class="alert alert-danger">
  <div class="alert-items">
    <div class="alert-item static" role="alert">
      <div class="alert-icon-wrapper">
        <cds-icon class="alert-icon" shape="error-standard"></cds-icon>
      </div>
      <span class="alert-text">This is an alert with 36px height.</span>
    </div>
  </div>
  <button type="button" class="close" aria-label="Close">
    <cds-icon aria-hidden="true" shape="times"></cds-icon>
  </button>
</div>
<div class="alert alert-success alert-sm" role="alert">
  <div class="alert-items">
    <div class="alert-item static">
      <div class="alert-icon-wrapper">
        <cds-icon class="alert-icon" shape="success-standard"></cds-icon>
      </div>
      <span class="alert-text">This is an alert with 24px height.</span>
    </div>
  </div>
  <button type="button" class="close" aria-label="Close">
    <cds-icon aria-hidden="true" shape="times"></cds-icon>
  </button>
</div>
<div class="alert alert-success alert-lightweight" role="alert">
  <div class="alert-items">
    <div class="alert-item static">
      <div class="alert-icon-wrapper">
        <cds-icon class="alert-icon" shape="success-standard"></cds-icon>
      </div>
      <span class="alert-text">This is a lightweight alert.</span>
    </div>
  </div>
  <button type="button" class="close" aria-label="Close">
    <cds-icon aria-hidden="true" shape="times"></cds-icon>
  </button>
</div>
<div class="alert alert-success alert-lightweight alert-sm" role="alert">
  <div class="alert-items">
    <div class="alert-item static">
      <div class="alert-icon-wrapper">
        <cds-icon class="alert-icon" shape="success-standard"></cds-icon>
      </div>
      <span class="alert-text">This is a compact lightweight alert.</span>
    </div>
  </div>
  <button type="button" class="close" aria-label="Close">
    <cds-icon aria-hidden="true" shape="times"></cds-icon>
  </button>
</div>
`;

@Component({
  selector: 'clr-alert-demo-sizes',
  styleUrl: '../alerts.demo.scss',
  templateUrl: './alert-sizes.demo.html',
  standalone: false,
})
export class AlertSizesDemo {
  htmlExample = HTML_EXAMPLE;
}

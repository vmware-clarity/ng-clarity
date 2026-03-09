/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { ClrAlertModule, ClrIcon, ClrIconModule } from '@clr/angular';

import { StackblitzExampleComponent } from '../../../../shared/stackblitz-example/stackblitz-example.component';

const HTML_EXAMPLE = `
<div class="alert alert-danger">
  <div class="alert-items">
    <div class="alert-item static" role="alert">
      <div class="alert-icon-wrapper">
        <clr-icon class="alert-icon" shape="error-standard"></clr-icon>
      </div>
      <span class="alert-text">This is an alert with 36px height.</span>
    </div>
  </div>
  <button type="button" class="close" aria-label="Close">
    <clr-icon aria-hidden="true" shape="times"></clr-icon>
  </button>
</div>
<div class="alert alert-success alert-sm" role="alert">
  <div class="alert-items">
    <div class="alert-item static">
      <div class="alert-icon-wrapper">
        <clr-icon class="alert-icon" shape="success-standard"></clr-icon>
      </div>
      <span class="alert-text">This is an alert with 24px height.</span>
    </div>
  </div>
  <button type="button" class="close" aria-label="Close">
    <clr-icon aria-hidden="true" shape="times"></clr-icon>
  </button>
</div>
<div class="alert alert-success alert-lightweight" role="alert">
  <div class="alert-items">
    <div class="alert-item static">
      <div class="alert-icon-wrapper">
        <clr-icon class="alert-icon" shape="success-standard"></clr-icon>
      </div>
      <span class="alert-text">This is a lightweight alert.</span>
    </div>
  </div>
  <button type="button" class="close" aria-label="Close">
    <clr-icon aria-hidden="true" shape="times"></clr-icon>
  </button>
</div>
<div class="alert alert-success alert-lightweight alert-sm" role="alert">
  <div class="alert-items">
    <div class="alert-item static">
      <div class="alert-icon-wrapper">
        <clr-icon class="alert-icon" shape="success-standard"></clr-icon>
      </div>
      <span class="alert-text">This is a compact lightweight alert.</span>
    </div>
  </div>
  <button type="button" class="close" aria-label="Close">
    <clr-icon aria-hidden="true" shape="times"></clr-icon>
  </button>
</div>
`;

@Component({
  selector: 'clr-alert-demo-sizes',
  styleUrl: '../alerts.demo.scss',
  templateUrl: './alert-sizes.demo.html',
  imports: [ClrIcon, ClrIconModule, ClrAlertModule, StackblitzExampleComponent],
})
export class AlertSizesDemo {
  htmlExample = HTML_EXAMPLE;
}

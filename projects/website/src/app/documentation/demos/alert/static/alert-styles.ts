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
<div class="alert alert-danger" role="alert">
  <div class="alert-items">
    <div class="alert-item static">
      <div class="alert-icon-wrapper">
        <clr-icon class="alert-icon" shape="error-standard"></clr-icon>
      </div>
      <span class="alert-text">...</span>
      <div class="alert-actions">
        <div class="alert-action dropdown bottom-right">
          <button class="dropdown-toggle">
            Actions
            <clr-icon shape="angle" direction="down"></clr-icon>
          </button>
          <div class="dropdown-menu" role="menu">
            <a class="dropdown-item" role="menuitem" href="...">Shutdown</a>
            <a class="dropdown-item" role="menuitem" href="...">Suspend</a>
            <a class="dropdown-item" role="menuitem" href="...">Reboot</a>
          </div>
        </div>
      </div>
    </div>
    <div class="alert-item static">
      <div class="alert-icon-wrapper">
        <clr-icon class="alert-icon" shape="error-standard"></clr-icon>
      </div>
      <span class="alert-text">...</span>
      <div class="alert-actions">
        <div class="alert-action dropdown bottom-right">
          <button class="dropdown-toggle">
            Actions
            <clr-icon shape="angle" direction="down"></clr-icon>
          </button>
          <div class="dropdown-menu" role="menu">
            <a class="dropdown-item" role="menuitem" href="...">Shutdown</a>
            <a class="dropdown-item" role="menuitem" href="...">Suspend</a>
            <a class="dropdown-item" role="menuitem" href="...">Reboot</a>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
<div class="alert alert-warning" role="alert">
  <div class="alert-items">
    <div class="alert-item static">
      <div class="alert-icon-wrapper">
        <clr-icon class="alert-icon" shape="warning-standard"></clr-icon>
      </div>
      <span class="alert-text">...</span>
      <div class="alert-actions">
        <div class="alert-action dropdown bottom-right open">
          <button class="dropdown-toggle">
            Actions
            <clr-icon shape="angle" direction="down"></clr-icon>
          </button>
          <div class="dropdown-menu" role="menu">
            <a class="dropdown-item" role="menuitem" href="...">Shutdown</a>
            <a class="dropdown-item" role="menuitem" href="...">Suspend</a>
            <a class="dropdown-item" role="menuitem" href="...">Reboot</a>
          </div>
        </div>
      </div>
    </div>
  </div>
  <button type="button" class="close" aria-label="Close">
    <clr-icon aria-hidden="true" shape="times"></clr-icon>
  </button>
</div>
<div class="alert alert-info" role="alert">
  <div class="alert-items">
    <div class="alert-item static">
      <div class="alert-icon-wrapper">
        <clr-icon class="alert-icon" shape="info-standard"></clr-icon>
      </div>
      <span class="alert-text">...</span>
      <div class="alert-actions">
        <a href="..." class="alert-action">Acknowledge</a>
        <a href="..." class="alert-action">Reset to green</a>
      </div>
    </div>
  </div>
  <button type="button" class="close" aria-label="Close">
    <clr-icon aria-hidden="true" shape="times"></clr-icon>
  </button>
</div>
<div class="alert alert-success" role="alert">
  <div class="alert-items">
    <div class="alert-item static">
      <div class="alert-icon-wrapper">
        <clr-icon class="alert-icon" shape="success-standard"></clr-icon>
      </div>
      <span class="alert-text">...</span>
    </div>
  </div>
</div>
`;

@Component({
  selector: 'clr-alert-demo-styles',
  styleUrl: '../alerts.demo.scss',
  templateUrl: './alert-styles.demo.html',
  imports: [ClrIcon, ClrIconModule, ClrAlertModule, StackblitzExampleComponent],
})
export class AlertStylesDemo {
  htmlExample = HTML_EXAMPLE;
}

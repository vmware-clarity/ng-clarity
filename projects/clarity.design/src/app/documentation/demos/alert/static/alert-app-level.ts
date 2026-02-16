/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import {
  ClarityIcons,
  downloadIcon,
  exclamationCircleIcon,
  exclamationTriangleIcon,
  infoCircleIcon,
} from '@cds/core/icon';

const HTML_EXAMPLE_1 = `
<div class="main-container">
  <div class="alert alert-app-level alert-danger" style="margin-bottom: 24px" role="alert">
    <div class="alert-items">
      <div class="alert-item static">
        <div class="alert-icon-wrapper">
          <cds-icon class="alert-icon" shape="error-standard"></cds-icon>
        </div>
        <div class="alert-text">Alert Type: Danger</div>
        <div class="alert-actions">
          <button class="btn alert-action">Action</button>
        </div>
      </div>
    </div>
    <button type="button" class="close" aria-label="Close">
      <cds-icon aria-hidden="true" shape="times"></cds-icon>
    </button>
  </div>
  <div class="alert alert-app-level alert-warning" style="margin-bottom: 24px" role="alert">
    <div class="alert-items">
      <div class="alert-item static">
        <div class="alert-icon-wrapper">
          <cds-icon class="alert-icon" shape="warning-standard"></cds-icon>
        </div>
        <div class="alert-text">Alert Type: Warning</div>
        <div class="alert-actions">
          <button class="btn alert-action">Action</button>
        </div>
      </div>
    </div>
    <button type="button" class="close" aria-label="Close">
      <cds-icon aria-hidden="true" shape="times"></cds-icon>
    </button>
  </div>
  <div class="alert alert-app-level alert-info" role="alert">
    <div class="alert-items">
      <div class="alert-item static">
        <div class="alert-icon-wrapper">
          <cds-icon class="alert-icon" shape="info-standard"></cds-icon>
        </div>
        <div class="alert-text">Alert Type: Info</div>
        <div class="alert-actions">
          <button class="btn alert-action">Action</button>
        </div>
      </div>
    </div>
    <button type="button" class="close" aria-label="Close">
      <cds-icon aria-hidden="true" shape="times"></cds-icon>
    </button>
  </div>
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

const HTML_EXAMPLE_2 = `
<div class="main-container">
  <div class="alert alert-app-level alert-info" role="alert">
    <div class="alert-items">
      <div class="alert-item static">
        <div class="alert-icon-wrapper">
          <cds-icon class="alert-icon" shape="info-standard"></cds-icon>
        </div>
        <div class="alert-text">A new update is now available. Upgrade to v.1234.</div>
        <div class="alert-actions">
          <button class="btn alert-action">Install Update</button>
        </div>
      </div>
    </div>
    <button type="button" class="close" aria-label="Close">
      <cds-icon aria-hidden="true" shape="times"></cds-icon>
    </button>
  </div>
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

const HTML_EXAMPLE_3 = `
<div class="main-container">
  <div class="alert alert-app-level alert-warning" role="alert">
    <div class="alert-items">
      <div class="alert-item static">
        <div class="alert-icon-wrapper">
          <cds-icon class="alert-icon" shape="download"></cds-icon>
        </div>
        <div class="alert-text">A new update is now available. Upgrade to v.1234.</div>
        <div class="alert-actions">
          <button class="btn alert-action">Install Update</button>
        </div>
      </div>
    </div>
    <button type="button" class="close" aria-label="Close">
      <cds-icon aria-hidden="true" shape="times"></cds-icon>
    </button>
  </div>
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
  selector: 'clr-alert-demo-app-level',
  styleUrl: '../alerts.demo.scss',
  templateUrl: './alert-app-level.demo.html',
  standalone: false,
})
export class AlertAppLevelDemo {
  htmlExample1 = HTML_EXAMPLE_1;
  htmlExample2 = HTML_EXAMPLE_2;
  htmlExample3 = HTML_EXAMPLE_3;

  constructor() {
    ClarityIcons.addIcons(infoCircleIcon, downloadIcon, exclamationTriangleIcon, exclamationCircleIcon);
  }
}

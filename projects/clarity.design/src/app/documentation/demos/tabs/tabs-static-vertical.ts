/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

const EXAMPLE = `
<div class="tabs-vertical">
  <ul class="nav" role="tablist">
    <li role="presentation" class="nav-item">
      <button
        id="tabDashboardStaticVertical"
        class="btn btn-link nav-link active"
        aria-controls="panelDashboardStaticVertical"
        aria-selected="true"
        type="button"
        role="tab"
      >
        Dashboard
      </button>
    </li>
    <li role="presentation" class="nav-item">
      <button
        id="tabManagementStaticVertical"
        class="btn btn-link nav-link"
        aria-controls="panelManagementStaticVertical"
        aria-selected="false"
        type="button"
        role="tab"
      >
        Management
      </button>
    </li>
    <li role="presentation" class="nav-item">
      <button
        id="tabCloudStaticVertical"
        class="btn btn-link nav-link"
        aria-controls="panelCloudStaticVertical"
        aria-selected="false"
        type="button"
        role="tab"
      >
        Cloud
      </button>
    </li>
  </ul>
  <section
    id="panelDashboardStaticVertical"
    role="tabpanel"
    aria-labelledby="tabDashboardStaticVertical"
  >
    You cannot switch between tabs in this static demo because it does not contain the JavaScript to
    handle this behavior. The demo is here to show the look of tabs and the DOM structure.
  </section>
  <section
    id="panelManagementStaticVertical"
    role="tabpanel"
    aria-labelledby="tabManagementStaticVertical"
    aria-hidden="true"
  >
    Content 2
  </section>
  <section
    id="panelCloudStaticVertical"
    role="tabpanel"
    aria-labelledby="tabCloudStaticVertical"
    aria-hidden="true"
  >
    Content 3
  </section>
</div>
`;

@Component({
  selector: 'clr-tabs-vertical-demo-static',
  templateUrl: './tabs-static-vertical.demo.html',
  standalone: false,
})
export class TabsStaticVerticalDemo {
  example = EXAMPLE;
}

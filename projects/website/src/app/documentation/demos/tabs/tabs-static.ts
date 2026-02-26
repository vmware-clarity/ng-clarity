/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

import { StackblitzExampleComponent } from '../../../shared/stackblitz-example/stackblitz-example.component';

const EXAMPLE = `
<ul class="nav" role="tablist">
  <li role="presentation" class="nav-item">
    <button
      id="tabDashboardStatic"
      class="btn btn-link nav-link active"
      aria-controls="panelDashboardStatic"
      aria-selected="true"
      type="button"
      role="tab"
    >
      Dashboard
    </button>
  </li>
  <li role="presentation" class="nav-item">
    <button
      id="tabManagementStatic"
      class="btn btn-link nav-link"
      aria-controls="panelManagementStatic"
      aria-selected="false"
      type="button"
      role="tab"
    >
      Management
    </button>
  </li>
  <li role="presentation" class="nav-item">
    <button
      id="tabCloudStatic"
      class="btn btn-link nav-link"
      aria-controls="panelCloudStatic"
      aria-selected="false"
      type="button"
      role="tab"
    >
      Cloud
    </button>
  </li>
</ul>
<section id="panelDashboardStatic" role="tabpanel" aria-labelledby="tabDashboardStatic">
  <p cds-text="body" cds-layout="m-t:md">
    You cannot switch between tabs in this static demo because it does not contain the JavaScript to
    handle this behavior. The demo is here to show the look of tabs and the DOM structure.
  </p>
</section>
<section
  id="panelManagementStatic"
  role="tabpanel"
  aria-labelledby="tabManagementStatic"
  aria-hidden="true"
>
  <p>Content 2</p>
</section>
<section id="panelCloudStatic" role="tabpanel" aria-labelledby="tabCloudStatic" aria-hidden="true">
  <p>Content 3</p>
</section>
`;

@Component({
  selector: 'clr-tabs-demo-static',
  templateUrl: './tabs-static.demo.html',
  imports: [StackblitzExampleComponent],
})
export class TabsStaticDemo {
  example = EXAMPLE;
}

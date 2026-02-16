/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

const EXAMPLE = `
<clr-tabs clrLayout="vertical">
  <clr-tab>
    <button clrTabLink>Dashboard</button>
    <clr-tab-content *clrIfActive>
      Content for Dashboard tab. Here is a
      <a href="javascript://">link</a>
      that can be accessed via clicking or through keyboard via tabbing.
    </clr-tab-content>
  </clr-tab>
  <clr-tab>
    <button clrTabLink>Management</button>
    <clr-tab-content *clrIfActive>Content for Management tab.</clr-tab-content>
  </clr-tab>
  <clr-tab>
    <button clrTabLink>Cloud</button>
    <clr-tab-content *clrIfActive>Content for Cloud tab.</clr-tab-content>
  </clr-tab>
</clr-tabs>
`;

@Component({
  selector: 'clr-tabs-angular-vertical',
  templateUrl: './tabs-angular-vertical.demo.html',
  standalone: false,
})
export class TabsAngularVerticalDemo {
  example = EXAMPLE;
}

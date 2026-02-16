/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

const EXAMPLE = `
<clr-tabs>
  <clr-tab>
    <button clrTabLink>Dashboard</button>
    <clr-tab-content *clrIfActive>
      <p cds-text="body" cds-layout="m-t:md">
        Content for Dashboard tab. Here is a
        <a href="javascript://">link</a>
        that can be accessed via clicking or through keyboard via tabbing.
      </p>
    </clr-tab-content>
  </clr-tab>
  <clr-tab>
    <button clrTabLink>Management</button>
    <clr-tab-content *clrIfActive>
      <p cds-text="body" cds-layout="m-t:md">Content for Management tab.</p>
    </clr-tab-content>
  </clr-tab>
  <clr-tab>
    <button clrTabLink [clrTabLinkInOverflow]="true">Cloud</button>
    <clr-tab-content *clrIfActive>
      <p cds-text="body" cds-layout="m-t:md">Content for Cloud tab.</p>
    </clr-tab-content>
  </clr-tab>
  <clr-tab>
    <button clrTabLink [clrTabLinkInOverflow]="true">Settings</button>
    <clr-tab-content *clrIfActive>
      <p cds-text="body" cds-layout="m-t:md">Content for Settings tab.</p>
    </clr-tab-content>
  </clr-tab>
</clr-tabs>
`;

@Component({
  selector: 'clr-modal-tabs-angular-overflow',
  templateUrl: './tabs-angular-overflow.demo.html',
  standalone: false,
})
export class TabsAngularOverflowDemo {
  example = EXAMPLE;
  inOverflow = true;
}

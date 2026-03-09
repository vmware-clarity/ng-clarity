/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { ClrIfActive, ClrPopoverHostDirective, ClrStopEscapePropagationDirective, ClrTabsModule } from '@clr/angular';

import { StackblitzExampleComponent } from '../../../shared/stackblitz-example/stackblitz-example.component';

const EXAMPLE = `
<clr-tabs>
  <clr-tab>
    <button clrTabLink>Dashboard</button>
    <clr-tab-content *clrIfActive>
      <p cds-text="body" cds-layout="m-t:md">Content for Dashboard tab.</p>
    </clr-tab-content>
  </clr-tab>
  <clr-tab>
    <button clrTabLink>Management</button>
    <clr-tab-content *clrIfActive="true">
      <p cds-text="body" cds-layout="m-t:md">Content for Management tab.</p>
    </clr-tab-content>
  </clr-tab>
  <clr-tab>
    <button clrTabLink>Cloud</button>
    <clr-tab-content *clrIfActive>
      <p cds-text="body" cds-layout="m-t:md">Content for Cloud tab.</p>
    </clr-tab-content>
  </clr-tab>
</clr-tabs>
`;

@Component({
  selector: 'tabs-angular-dynamic-selection',
  templateUrl: './tabs-angular-dynamic-selection.demo.html',
  imports: [
    ClrStopEscapePropagationDirective,
    ClrPopoverHostDirective,
    ClrTabsModule,
    ClrIfActive,
    StackblitzExampleComponent,
  ],
})
export class TabsAngularDynamicSelectionDemo {
  example = EXAMPLE;
}

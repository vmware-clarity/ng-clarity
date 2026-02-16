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
    <ng-template [(clrIfActive)]="dashboardActive">
      <clr-tab-content>
        <p>
          Content for Dashboard tab. Here is a
          <a href="javascript://">link</a>
          that can be accessed via clicking or through keyboard via tabbing.
        </p>
      </clr-tab-content>
    </ng-template>
  </clr-tab>

  <clr-tab>
    <button clrTabLink>Management</button>
    <ng-template [(clrIfActive)]="managementActive">
      <clr-tab-content>
        <p>Content for Management tab.</p>
      </clr-tab-content>
    </ng-template>
  </clr-tab>

  <clr-tab>
    <button clrTabLink>Cloud</button>
    <ng-template [(clrIfActive)]="cloudActive">
      <clr-tab-content>
        <p>Content for Cloud tab.</p>
      </clr-tab-content>
    </ng-template>
  </clr-tab>

  <clr-tab>
    <button clrTabLink>Infrastructure</button>
    <ng-template [(clrIfActive)]="infrastructureActive">
      <clr-tab-content>
        <p>Content for Infrastructure tab.</p>
      </clr-tab-content>
    </ng-template>
  </clr-tab>
</clr-tabs>
`;

const CODE = `
import { Component } from '@angular/core';
import { ClrTabsModule } from '@clr/angular';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrl: './example.component.scss',

  imports: [ClrTabsModule],
})
export class ExampleComponent {
  dashboardActive = true;
  managementActive = false;
  cloudActive = false;
  infrastructureActive = false;
}
`;

@Component({
  selector: 'clr-modal-tabs-angular',
  templateUrl: './tabs-angular.demo.html',
  standalone: false,
})
export class TabsAngularDemo {
  example = EXAMPLE;
  code = CODE;
  dashboardActive = true;
  managementActive = false;
  cloudActive = false;
  infrastructureActive = false;
}

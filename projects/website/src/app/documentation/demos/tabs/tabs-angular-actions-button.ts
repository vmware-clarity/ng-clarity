/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import {
  ClarityIcons,
  ClrIcon,
  ClrIconModule,
  ClrPopoverHostDirective,
  ClrStopEscapePropagationDirective,
  ClrTabsModule,
  plusIcon,
  trashIcon,
} from '@clr/angular';

import { StackblitzExampleComponent } from '../../../shared/stackblitz-example/stackblitz-example.component';

const EXAMPLE = `
<clr-tabs>
  <clr-tabs-actions position="left">
    <div class="btn btn-icon btn-link" (click)="addNewTab()" clrTabAction>
      <clr-icon shape="plus"></clr-icon>
    </div>
  </clr-tabs-actions>
  @for (tab of tabs; track $index; let i = $index) {
    <clr-tab>
      <button clrTabLink>{{ tab.title }}</button>
      <clr-tab-content>
        <p>{{ tab.content }}</p>
        <button class="btn btn-icon btn-link" (click)="removeTab(i)">
          <clr-icon shape="trash"></clr-icon>
          Remove tab
        </button>
      </clr-tab-content>
    </clr-tab>
  }
</clr-tabs>
`;

const EXAMPLE_TS = `
import { Component } from '@angular/core';

@Component({
  selector: 'app-example',
  templateUrl: './example.component.html',
  styleUrl: './example.component.scss',

  imports: [ClarityModule],
})
export class ExampleComponent {
  layout = 'vertical';
  tabs = [
    {
      title: 'Dashboard',
      content: 'Content for Dashboard tab.',
    },
    {
      title: 'Management',
      content: 'Content for Management tab.',
    },
  ];

  addNewTab() {
    this.tabs.push({
      title: 'Custom Tab ',
      content: 'Content for Custom Tab',
    });
  }

  removeTab(index: any) {
    this.tabs.splice(index, 1);
  }
}
`;

@Component({
  selector: 'clr-tabs-angular-actions-button',
  templateUrl: './tabs-angular-actions-button.demo.html',
  imports: [
    ClrStopEscapePropagationDirective,
    ClrPopoverHostDirective,
    ClrTabsModule,
    ClrIcon,
    ClrIconModule,
    StackblitzExampleComponent,
  ],
})
export class TabsAngularActionsButtonDemo {
  example = EXAMPLE;
  exampleTs = EXAMPLE_TS;
  layout = 'vertical';
  tabs = [
    {
      title: 'Dashboard',
      content: 'Content for Dashboard tab.',
    },
    {
      title: 'Management',
      content: 'Content for Management tab.',
    },
  ];

  constructor() {
    ClarityIcons.addIcons(plusIcon, trashIcon);
  }

  addNewTab() {
    this.tabs.push({
      title: `Custom Tab ${this.tabs.length + 1}`,
      content: `Content for Custom Tab ${this.tabs.length + 1}`,
    });
  }

  removeTab(index: any) {
    this.tabs.splice(index, 1);
  }
}

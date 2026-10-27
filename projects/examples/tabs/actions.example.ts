/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { ClarityIcons, ClrIcon, ClrTabsModule, plusIcon, trashIcon } from '@clr/angular';

@Component({
  selector: 'clr-tabs-actions-example',
  templateUrl: './actions.example.html',
  imports: [ClrIcon, ClrTabsModule],
})
export class TabsActionsExample {
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

  removeTab(index: number) {
    this.tabs.splice(index, 1);
  }
}

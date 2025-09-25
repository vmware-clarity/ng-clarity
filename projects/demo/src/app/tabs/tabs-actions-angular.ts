/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';

@Component({
  selector: 'clr-modal-tabs-actions-angular',
  styleUrls: ['./tabs.demo.scss'],
  templateUrl: './tabs-actions-angular.demo.html',
  standalone: false,
})
export class TabsActionsAngularDemo {
  layout = 'vertical';
  inOverflow = false;
  tabs = [
    {
      title: 'Dashboard',
      content: `Content for Dashboard tab. Here is a <a href="javascript://">link</a> that can be accessed via clicking or
          through keyboard via tabbing.`,
    },
    {
      title: 'Management',
      content: 'Content for Management tab.',
    },
  ];

  addTab() {
    this.tabs.push({
      title: `Inserted Tab ${this.tabs.length + 1}`,
      content: `Content for Inserted Tab ${this.tabs.length + 1}`,
    });
  }

  removeTab(index) {
    this.tabs.splice(index, 1);
  }
}

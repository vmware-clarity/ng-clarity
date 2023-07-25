/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Injectable, ViewContainerRef } from '@angular/core';

import { TabsLayout } from '../enums/tabs-layout.enum';
import { ClrTab } from '../tab';

@Injectable()
export class TabsService {
  layout: TabsLayout | string = TabsLayout.HORIZONTAL;
  tabContentViewContainer: ViewContainerRef;

  private _children: ClrTab[] = [];

  get children() {
    return this._children;
  }

  get activeTab() {
    return this.children.find((tab: ClrTab) => {
      return tab.active;
    });
  }

  get overflowTabs() {
    if (this.layout === TabsLayout.VERTICAL) {
      return [];
    } else {
      return this.children.filter((tab: ClrTab) => tab.tabLink.inOverflow === true);
    }
  }

  register(tab: ClrTab) {
    this._children.push(tab);
  }

  unregister(tab: ClrTab) {
    const index = this.children.indexOf(tab);
    if (index > -1) {
      this.children.splice(index, 1);
    }
  }
}

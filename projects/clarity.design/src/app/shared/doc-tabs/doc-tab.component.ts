/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, Input, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';

import { DocTabsComponent } from './doc-tabs.component';

@Component({
  selector: 'app-doc-tab',
  template: `
    <ng-template #content>
      <ng-content></ng-content>
    </ng-template>
  `,
  host: {
    role: 'article',
  },
})
export class DocTabComponent implements OnInit, OnDestroy {
  @Input() tab:
    | 'overview'
    | 'themes'
    | 'density'
    | 'usage'
    | 'colors'
    | 'shapes'
    | 'code'
    | 'api'
    | 'accessibility'
    | 'design'
    | undefined;

  @ViewChild('content') templateRef: TemplateRef<any> | undefined;

  constructor(private readonly tabs: DocTabsComponent) {}

  ngOnInit() {
    if (this.tab) {
      this.tabs.availableTabs[this.tab] = true;
    }
  }

  ngOnDestroy() {
    if (this.tab) {
      this.tabs.availableTabs[this.tab] = false;
    }
  }
}

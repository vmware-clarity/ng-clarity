/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, input, OnDestroy, OnInit, TemplateRef, viewChild } from '@angular/core';

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
  readonly tab = input<
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
    | undefined
  >(undefined);

  readonly templateRef = viewChild<TemplateRef<any>>('content');

  constructor(private readonly tabs: DocTabsComponent) {}

  ngOnInit() {
    const tab = this.tab();
    if (tab) {
      this.tabs.availableTabs[tab] = true;
    }
  }

  ngOnDestroy() {
    const tab = this.tab();
    if (tab) {
      this.tabs.availableTabs[tab] = false;
    }
  }
}

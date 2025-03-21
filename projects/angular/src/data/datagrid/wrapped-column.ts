/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { AfterViewInit, Component, EmbeddedViewRef, OnDestroy, TemplateRef, ViewChild } from '@angular/core';

@Component({
  selector: 'dg-wrapped-column',
  template: `
    <ng-template #columnPortal>
      <ng-content></ng-content>
    </ng-template>
  `,
})
export class WrappedColumn implements AfterViewInit, OnDestroy {
  @ViewChild('columnPortal') templateRef: TemplateRef<void>;
  columnView: EmbeddedViewRef<void>; // the columns projected view (in memory)

  ngAfterViewInit() {
    // Create the cells view in memory, not the DOM.
    this.columnView = this.templateRef.createEmbeddedView(null);
  }

  ngOnDestroy() {
    this.columnView.destroy();
  }
}

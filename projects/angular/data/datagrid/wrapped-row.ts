/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { AfterViewInit, Component, EmbeddedViewRef, OnDestroy, TemplateRef, ViewChild } from '@angular/core';

@Component({
  selector: 'dg-wrapped-row',
  template: `
    <ng-template #rowPortal>
      <ng-content></ng-content>
    </ng-template>
  `,
  standalone: false,
})
export class WrappedRow implements AfterViewInit, OnDestroy {
  @ViewChild('rowPortal') templateRef: TemplateRef<void>;
  rowView: EmbeddedViewRef<void>; // the rows projected view (in memory)

  ngAfterViewInit() {
    // Create the cells view in memory, not the DOM.
    this.rowView = this.templateRef.createEmbeddedView(null);
  }

  ngOnDestroy() {
    this.rowView.destroy();
  }
}

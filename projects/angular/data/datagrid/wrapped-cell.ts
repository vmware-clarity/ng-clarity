/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { AfterViewInit, Component, EmbeddedViewRef, OnDestroy, TemplateRef, ViewChild } from '@angular/core';

@Component({
  selector: 'dg-wrapped-cell',
  template: `
    <ng-template #cellPortal>
      <ng-content></ng-content>
    </ng-template>
  `,
  standalone: false,
})
export class WrappedCell implements AfterViewInit, OnDestroy {
  @ViewChild('cellPortal') templateRef: TemplateRef<void>;
  cellView: EmbeddedViewRef<void>; // the cells projected view

  ngAfterViewInit() {
    this.cellView = this.templateRef.createEmbeddedView(null);
  }

  ngOnDestroy() {
    this.cellView.destroy();
  }
}

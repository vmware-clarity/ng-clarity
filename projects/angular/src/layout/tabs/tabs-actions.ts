/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, ContentChildren, ElementRef, HostBinding, Input, QueryList } from '@angular/core';

import { ClrTabAction } from './tab-action.directive';

export type ClrTabsActionsPosition = 'left' | 'right';

@Component({
  selector: 'clr-tabs-actions',
  template: `
    <div class="tabs-actions-wrapper">
      <ng-content></ng-content>
    </div>
  `,
  host: {
    '[class.tabs-actions]': 'true',
  },
})
export class ClrTabsActions {
  @Input()
  @HostBinding('attr.position')
  position: ClrTabsActionsPosition = 'right';

  @ContentChildren(ClrTabAction, { read: ElementRef }) actions: QueryList<ElementRef>;
}

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, HostBinding, Input } from '@angular/core';

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
  standalone: false,
})
export class ClrTabsActions {
  @Input()
  @HostBinding('attr.position')
  position: ClrTabsActionsPosition = 'right';
}

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { booleanAttribute, ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'clr-card-media-block',
  template: `<ng-content></ng-content>`,
  host: {
    '[class.card-media-block]': 'true',
    '[class.clr-card-media-block]': 'true',
    '[class.wrap]': 'clrCardMediaWrap',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class ClrCardMediaBlock {
  @Input({ alias: 'clrCardMediaWrap', transform: booleanAttribute }) clrCardMediaWrap = false;
}

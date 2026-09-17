/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'clr-card-footer',
  template: `<ng-content></ng-content>`,
  host: { '[class.card-footer]': 'true', '[class.clr-card-footer]': 'true' },
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class ClrCardFooter {}

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Directive, HostBinding, Optional } from '@angular/core';

import { ZoomLevel } from './zoom-level.model';
import { ZoomLevelService } from './zoom-level.service';

@Directive({ selector: '[zoomLevelIndicator]', standalone: false })
export class ZoomLevelIndicatorDirective {
  constructor(@Optional() private zoomLevelService: ZoomLevelService) {}

  @HostBinding('class')
  get zoomLevel(): ZoomLevel | undefined {
    return this.zoomLevelService?.level();
  }
}

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Directive, HostBinding, OnDestroy, OnInit, Optional, signal } from '@angular/core';

import { ZoomLevel } from './zoom-level.model';
import { ZoomLevelService } from './zoom-level.service';

@Directive({ selector: '[zoomLevelIndicator]', standalone: false })
export class ZoomLevelIndicatorDirective implements OnInit, OnDestroy {
  private readonly assignedZoomLevel = signal<ZoomLevel | undefined>(undefined);

  constructor(@Optional() private zoomLevelService: ZoomLevelService) {}

  @HostBinding('class')
  get zoomLevel(): ZoomLevel | undefined {
    // A zoom level assigned from code wins. `level?.()` tolerates test doubles of ZoomLevelService without `level`.
    return this.assignedZoomLevel() ?? this.zoomLevelService?.level?.();
  }

  set zoomLevel(zoomLevel: ZoomLevel | undefined) {
    this.assignedZoomLevel.set(zoomLevel);
  }

  /** @deprecated The directive no longer needs initialization. Kept so that `super.ngOnInit()` calls compile. */
  ngOnInit(): void {
    // Intentionally empty.
  }

  /** @deprecated The directive holds no subscription anymore. Kept so that `super.ngOnDestroy()` calls compile. */
  ngOnDestroy(): void {
    // Intentionally empty.
  }
}

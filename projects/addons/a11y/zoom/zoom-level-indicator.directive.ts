/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectorRef, Directive, HostBinding, inject, OnDestroy, OnInit, Optional } from '@angular/core';
import { Subscription } from 'rxjs';

import { ZoomLevel } from './zoom-level.model';
import { ZoomLevelService } from './zoom-level.service';

@Directive({ selector: '[zoomLevelIndicator]', standalone: false })
export class ZoomLevelIndicatorDirective implements OnInit, OnDestroy {
  @HostBinding('class') zoomLevel: ZoomLevel;

  private subscription: Subscription;
  private readonly changeDetectorRef = inject(ChangeDetectorRef);

  constructor(@Optional() private zoomLevelService: ZoomLevelService) {}

  ngOnInit() {
    if (this.zoomLevelService) {
      this.subscription = this.zoomLevelService.onChange.subscribe(v => {
        this.zoomLevel = v;
        // The service emits from a ResizeObserver callback, which does not schedule change detection.
        this.changeDetectorRef.markForCheck();
      });
    }
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}

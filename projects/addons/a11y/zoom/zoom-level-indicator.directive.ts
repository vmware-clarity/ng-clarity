/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Directive, HostBinding, OnDestroy, OnInit, Optional } from '@angular/core';
import { Subscription } from 'rxjs';

import { ZoomLevel } from './zoom-level.model';
import { ZoomLevelService } from './zoom-level.service';

@Directive({ selector: '[zoomLevelIndicator]', standalone: false })
export class ZoomLevelIndicatorDirective implements OnInit, OnDestroy {
  @HostBinding('class') zoomLevel: ZoomLevel;

  private subscription: Subscription;

  constructor(@Optional() private zoomLevelService: ZoomLevelService) {}

  ngOnInit() {
    if (this.zoomLevelService) {
      this.subscription = this.zoomLevelService.onChange.subscribe(v => {
        this.zoomLevel = v;
      });
    }
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}

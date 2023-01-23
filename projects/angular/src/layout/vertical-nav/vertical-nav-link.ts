/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectorRef, Component, ElementRef, Inject, OnDestroy, Optional } from '@angular/core';
import { fromEvent, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { VerticalNavGroupService } from './providers/vertical-nav-group.service';

@Component({
  selector: '[clrVerticalNavLink]',
  template: `
    <ng-content select="[clrVerticalNavIcon]"></ng-content>
    <span class="nav-text">
      <ng-content></ng-content>
    </span>
  `,
  host: { class: 'nav-link' },
})
export class ClrVerticalNavLink implements OnDestroy {
  private destroy$ = new Subject<void>();

  constructor(
    host: ElementRef<HTMLElement>,
    ref: ChangeDetectorRef,
    @Optional() @Inject(VerticalNavGroupService) navGroupService: VerticalNavGroupService | null
  ) {
    // Note: since the `VerticalNavGroupService` is an optional provider, we'll setup the event
    // listener only when the `[clrVerticalLink]` is located within the `clr-vertical-nav-group`.
    navGroupService &&
      fromEvent(host.nativeElement, 'click')
        .pipe(takeUntil(this.destroy$))
        .subscribe(() => {
          navGroupService.expand();
          ref.markForCheck();
        });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
  }
}

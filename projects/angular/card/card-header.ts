/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, Optional } from '@angular/core';
import { ClrCommonStringsService } from '@clr/angular/utils';
import { Subscription } from 'rxjs';

import { ClrCard } from './card';

@Component({
  selector: 'clr-card-header',
  templateUrl: './card-header.html',
  host: {
    '[class.card-header]': 'true',
    '[class.clr-card-header]': 'true',
    '[attr.id]': 'card?.headerId',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: false,
})
export class ClrCardHeader implements OnInit, OnDestroy {
  private subscription: Subscription;

  constructor(
    @Optional() public card: ClrCard,
    public commonStrings: ClrCommonStringsService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    // The card's expand state lives on a service owned by the parent ClrCard. Mutating that
    // service from this component's own click handler doesn't automatically mark the parent
    // (or its content-projected siblings) dirty, so we subscribe here to explicitly refresh
    // this component whenever the expand state changes, regardless of what triggered it.
    this.subscription = this.card?.expandService.expandChange.subscribe(() => this.cdr.markForCheck());
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}

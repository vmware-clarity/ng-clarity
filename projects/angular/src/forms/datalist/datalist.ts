/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { AfterContentInit, Directive, Input, Optional } from '@angular/core';
import { Subscription } from 'rxjs';

import { DatalistIdService } from './providers/datalist-id.service';

@Directive({
  selector: 'datalist',
  host: {
    '[id]': 'datalistId',
  },
})
export class ClrDatalist implements AfterContentInit {
  datalistId: string;

  private subscriptions: Subscription[] = [];

  constructor(@Optional() private datalistIdService: DatalistIdService) {}

  @Input()
  set id(idValue: string) {
    if (!!idValue && this.datalistIdService) {
      this.datalistId = idValue;
      this.datalistIdService.id = idValue;
    } else if (idValue) {
      this.datalistId = idValue;
    }
  }

  ngAfterContentInit() {
    if (!this.datalistIdService) {
      return;
    }
    this.subscriptions.push(this.datalistIdService.idChange.subscribe(id => (this.datalistId = id)));
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}

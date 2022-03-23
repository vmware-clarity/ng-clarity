/*
 * Copyright (c) 2016-2022 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Input, Directive, AfterContentInit, Optional } from '@angular/core';
import { takeUntil } from 'rxjs/operators';

import { ClrDestroyService } from '../../utils/destroy';
import { DatalistIdService } from './providers/datalist-id.service';

@Directive({
  selector: 'datalist',
  host: {
    '[id]': 'datalistId',
  },
  providers: [ClrDestroyService],
})
export class ClrDatalist implements AfterContentInit {
  constructor(@Optional() private datalistIdService: DatalistIdService, private destroy$: ClrDestroyService) {}

  datalistId: string;

  ngAfterContentInit() {
    if (!this.datalistIdService) {
      return;
    }

    this.datalistIdService.idChange.pipe(takeUntil(this.destroy$)).subscribe(id => (this.datalistId = id));
  }

  @Input()
  set id(idValue: string) {
    if (!!idValue && this.datalistIdService) {
      this.datalistId = idValue;
      this.datalistIdService.id = idValue;
    } else if (idValue) {
      this.datalistId = idValue;
    }
  }
}

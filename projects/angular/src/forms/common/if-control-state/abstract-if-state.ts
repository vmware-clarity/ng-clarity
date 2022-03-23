/*
 * Copyright (c) 2016-2022 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Directive, Optional } from '@angular/core';
import { NgControl } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';

import { ClrDestroyService } from '../../../utils/destroy';
import { NgControlService } from '../providers/ng-control.service';
import { IfControlStateService, CONTROL_STATE } from './if-control-state.service';

@Directive()
export abstract class AbstractIfState {
  protected displayedContent = false;
  protected control: NgControl;

  constructor(
    @Optional() protected ifControlStateService: IfControlStateService,
    @Optional() protected ngControlService: NgControlService,
    destroy$: ClrDestroyService
  ) {
    if (ngControlService) {
      this.ngControlService.controlChanges.pipe(takeUntil(destroy$)).subscribe(control => {
        this.control = control;
      });
    }

    if (ifControlStateService) {
      this.ifControlStateService.statusChanges.pipe(takeUntil(destroy$)).subscribe((state: CONTROL_STATE) => {
        this.handleState(state);
      });
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  protected handleState(state: CONTROL_STATE): void {
    /* overwrite in implementation to handle status change */
  }
}

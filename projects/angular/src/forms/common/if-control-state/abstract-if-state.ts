/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Directive, Optional } from '@angular/core';
import { NgControl } from '@angular/forms';
import { Subscription } from 'rxjs';

import { NgControlService } from '../providers/ng-control.service';
import { CONTROL_STATE, IfControlStateService } from './if-control-state.service';

@Directive()
export abstract class AbstractIfState {
  protected subscriptions: Subscription[] = [];
  protected displayedContent = false;
  protected control: NgControl;
  protected secondaryControl: NgControl;

  constructor(
    @Optional() protected ifControlStateService: IfControlStateService,
    @Optional() protected ngControlService: NgControlService
  ) {
    if (ngControlService) {
      this.subscriptions.push(
        this.ngControlService.controlChanges.subscribe(control => {
          this.control = control;
        }),
        this.ngControlService.secondaryControlChanges.subscribe(control => {
          this.secondaryControl = control;
        })
      );
    }

    if (ifControlStateService) {
      this.subscriptions.push(
        this.ifControlStateService.statusChanges.subscribe((state: CONTROL_STATE) => {
          this.handleState(state);
        })
      );
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  protected handleState(_state: CONTROL_STATE): void {
    /* overwrite in implementation to handle status change */
  }
}

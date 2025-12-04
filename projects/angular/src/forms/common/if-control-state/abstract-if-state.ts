/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Directive, Optional } from '@angular/core';
import { NgControl } from '@angular/forms';
import { Subscription } from 'rxjs';

import { NgControlService } from '../providers/ng-control.service';

@Directive()
export abstract class AbstractIfState {
  protected subscriptions: Subscription[] = [];
  protected displayedContent = false;
  protected control: NgControl;
  protected additionalControls: NgControl[];

  protected constructor(@Optional() protected ngControlService: NgControlService) {
    if (ngControlService) {
      this.subscriptions.push(
        ngControlService.controlChanges.subscribe(control => {
          this.control = control;
          this.handleState(control.status);
          this.subscriptions.push(
            control.statusChanges.subscribe(status => {
              this.handleState(status);
            })
          );
        }),
        ngControlService.additionalControlsChanges.subscribe(controls => {
          this.additionalControls = controls;

          this.additionalControls.forEach(control => {
            this.handleState(control.status);
            this.subscriptions.push(
              control.statusChanges.subscribe(status => {
                this.handleState(status);
              })
            );
          });
        })
      );
    }
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  protected handleState(_state: any): void {
    /* overwrite in implementation to handle status change */
  }
}

/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Injectable, OnDestroy } from '@angular/core';
import { NgControl } from '@angular/forms';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';

import { NgControlService } from '../providers/ng-control.service';

export enum CONTROL_STATE {
  NONE = 'NONE',
  VALID = 'VALID',
  INVALID = 'INVALID',
}

@Injectable()
export class IfControlStateService implements OnDestroy {
  private subscriptions: Subscription[] = [];
  private control: NgControl;
  private additionalControls: NgControl[] = [];

  // Implement our own status changes observable, since Angular controls don't
  private _statusChanges = new BehaviorSubject(CONTROL_STATE.NONE);

  constructor(private ngControlService: NgControlService) {
    // Wait for the control to be available
    this.subscriptions.push(
      this.ngControlService.controlChanges.subscribe(control => {
        if (control) {
          this.control = control;
          console.log('🚀 ~ IfControlStateService ~ constructor ~ control:', control);
          // Subscribe to the status change events, only after touched
          // and emit the control
          this.subscriptions.push(
            this.control.statusChanges?.subscribe(() => {
              this.triggerStatusChange();
            })
          );
        }
      }),

      this.ngControlService.controlsChanges.subscribe((controls: NgControl[]) => {
        if (controls) {
          this.additionalControls = controls;
          console.log('🚀 ~ IfControlStateService ~ constructor ~ control:', controls);
          // Subscribe to the status change events, only after touched
          // and emit the control
          this.additionalControls.forEach((control: NgControl) => {
            this.subscriptions.push(
              control.statusChanges?.subscribe(() => {
                this.triggerStatusChange();
              })
            );
          });
        }
      })
    );
  }

  get statusChanges(): Observable<CONTROL_STATE> {
    return this._statusChanges.asObservable();
  }

  ngOnDestroy() {
    console.log('🚀 ~ IfControlStateService ~ ngOnDestroy ~ ngOnDestroy:');
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  triggerStatusChange() {
    /* Check if control is defined and run the code only then */
    const addtionalControlsStatus = this.additionalControls.map((control: NgControl) => control.status);
    if (this.control) {
      // These status values are mutually exclusive, so a control
      // cannot be both valid AND invalid or invalid AND disabled.
      let finalStatus = CONTROL_STATE.NONE;
      const combinedStatus = [...addtionalControlsStatus, this.control.status];
      console.log('🚀 ~ IfControlStateService ~ triggerStatusChange ~ addtionalControlsStatus:', combinedStatus);
      for (let index = 0; index < combinedStatus.length; index++) {
        const status = combinedStatus[index];
        if (status === CONTROL_STATE.INVALID) {
          finalStatus = CONTROL_STATE.INVALID;
          break;
        } else if (status === CONTROL_STATE.VALID) {
          finalStatus = CONTROL_STATE.VALID;
        } else {
          finalStatus = CONTROL_STATE.NONE;
        }
      }
      console.log('🚀 ~ IfControlStateService ~ triggerStatusChange ~ finalStatus:', finalStatus);
      this._statusChanges.next(finalStatus);
      // combinedStatus.findIndex((status) => status === CONTROL_STATE.INVALID) > -1 ? CONTROL_STATE.INVALID
      // this._statusChanges.next(['VALID', 'INVALID'].includes(status) ? status : CONTROL_STATE.NONE);
    }
  }
}

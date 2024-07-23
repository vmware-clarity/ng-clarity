/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Injectable, OnDestroy } from '@angular/core';
import { NgControl } from '@angular/forms';
import { BehaviorSubject, Observable, Subject, Subscription, takeUntil } from 'rxjs';

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
  private additionalControls: NgControl[];
  private unSubscribeAdditionalControls: Subject<boolean> = new Subject();

  // Implement our own status changes observable, since Angular controls don't
  private _statusChanges = new BehaviorSubject(CONTROL_STATE.NONE);

  constructor(private ngControlService: NgControlService) {
    // Wait for the control to be available
    this.subscriptions.push(
      this.ngControlService.controlChanges.subscribe(control => {
        if (control) {
          this.control = control;
          // Subscribe to the status change events, only after touched
          // and emit the control
          this.subscriptions.push(
            this.control.statusChanges?.subscribe(() => {
              this.triggerStatusChange();
            })
          );
        }
      }),

      this.ngControlService.additionalControlChanges.subscribe((controls: NgControl[]) => {
        if (controls) {
          this.additionalControls = controls;
          this.unSubscribeAdditionalControls.next(true);
          // Subscribe to the status change events, only after touched
          // and emit the control
          this.additionalControls?.forEach((control: NgControl) => {
            control?.statusChanges?.pipe(takeUntil(this.unSubscribeAdditionalControls)).subscribe(() => {
              this.triggerStatusChange();
            });
          });
        }
      })
    );
  }

  get statusChanges(): Observable<CONTROL_STATE> {
    return this._statusChanges.asObservable();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
    this.unSubscribeAdditionalControls.next(true);
  }

  triggerStatusChange() {
    /* Check if control is defined and run the code only then */
    if (this.control) {
      // These status values are mutually exclusive, so a control
      // cannot be both valid AND invalid or invalid AND disabled.
      let finalStatus = CONTROL_STATE.NONE;
      const additionalControlsStatus = this.additionalControls?.map(control => control.status) || [];
      const combinedStatus = [this.control.status, ...additionalControlsStatus];
      if (combinedStatus.includes(CONTROL_STATE.INVALID)) {
        finalStatus = CONTROL_STATE.INVALID;
      } else if (combinedStatus.includes(CONTROL_STATE.VALID)) {
        finalStatus = CONTROL_STATE.VALID;
      }
      this._statusChanges.next(finalStatus);
    }
  }
}

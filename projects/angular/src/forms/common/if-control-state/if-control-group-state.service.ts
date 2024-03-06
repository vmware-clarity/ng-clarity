/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Injectable, OnDestroy } from '@angular/core';
import { NgControl } from '@angular/forms';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';

import { NgControlGroupService } from '../providers/ng-control-group.service';

export enum CONTROL_STATE {
  NONE = 'NONE',
  VALID = 'VALID',
  INVALID = 'INVALID',
}

// TODO: Better name for the service would be IfValid(Group)StateService or (GroupContainer)Validity(Status)ChangeService
@Injectable()
export class IfControlGroupStateService implements OnDestroy {
  private subscriptions: Subscription[] = [];

  // TODO: Do we need this if we save controls in the other service - NgControlGroupStateService
  private controls: NgControl[] = [];

  // Implement our own status changes observable, since Angular controls don't
  private _statusChanges = new BehaviorSubject(CONTROL_STATE.NONE);

  constructor(private ngControlService: NgControlGroupService) {
    // Wait for the control to be available
    this.subscriptions.push(
      this.ngControlService.controlChanges.subscribe(controls => {
        this.controls = controls;
        // Subscribe to the status change events, only after touched
        // and emit the control
        if (this.controls?.length > 0) {
          this.controls.map(control => {
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
    this.subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  triggerStatusChange() {
    /* Check if control is defined and run the code only then */ // TODO: Maybe obsolete
    // if (this.controls.length > 0) {
    // These status values are mutually exclusive, so a control
    // cannot be both valid AND invalid or invalid AND disabled.

    let status = CONTROL_STATE[this.controls[0].status];
    // TODO: Check also whether they are required (if not required - disregard)
    const invalidControls = this.controls.find(control => {
      return control?.control?.status === 'INVALID'; // TODO: Required?
    });
    if (invalidControls) {
      status = 'INVALID';
    } else {
      status = 'VALID';
    }

    this._statusChanges.next(['VALID', 'INVALID'].includes(status) ? status : CONTROL_STATE.NONE);
    // }
  }
}

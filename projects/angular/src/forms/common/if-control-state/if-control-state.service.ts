/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Injectable } from '@angular/core';
import { NgControl } from '@angular/forms';
import { combineLatest, EMPTY, map, merge, Observable, shareReplay, startWith, Subject, switchMap } from 'rxjs';

import { NgControlService } from '../providers/ng-control.service';

export enum CONTROL_STATE {
  NONE = 'NONE',
  VALID = 'VALID',
  INVALID = 'INVALID',
}

@Injectable()
export class IfControlStateService {
  readonly statusChanges: Observable<CONTROL_STATE>;

  private readonly triggerStatusChangeSubject = new Subject<void>();

  constructor(ngControlService: NgControlService) {
    this.statusChanges = this.getStatusChanges(ngControlService).pipe(shareReplay(1));
  }

  triggerStatusChange() {
    this.triggerStatusChangeSubject.next();
  }

  private getStatusChanges(ngControlService: NgControlService) {
    return combineLatest([
      ngControlService.controlChanges,
      ngControlService.additionalControlsChanges.pipe(startWith<NgControl[]>([])),
    ]).pipe(
      switchMap(([control, additionalControls]) => {
        if (control) {
          const controls = [control, ...additionalControls];

          return merge(
            combineLatest(controls.map(control => control.statusChanges)),
            this.triggerStatusChangeSubject.pipe(map(() => controls.map(control => control.status)))
          );
        } else {
          return EMPTY;
        }
      }),
      map(controlStatuses => {
        // These status values are mutually exclusive, so a control
        // cannot be both valid AND invalid or invalid AND disabled.
        if (controlStatuses.includes(CONTROL_STATE.INVALID)) {
          return CONTROL_STATE.INVALID;
        } else if (controlStatuses.includes(CONTROL_STATE.VALID)) {
          return CONTROL_STATE.VALID;
        } else {
          return CONTROL_STATE.NONE;
        }
      }),
      startWith(CONTROL_STATE.NONE)
    );
  }
}

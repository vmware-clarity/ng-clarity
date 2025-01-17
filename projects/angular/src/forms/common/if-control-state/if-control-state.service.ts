/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Injectable } from '@angular/core';
import { EMPTY, map, merge, Observable, shareReplay, startWith, Subject, switchMap } from 'rxjs';

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
    return ngControlService.controlChanges.pipe(
      switchMap(control =>
        control ? merge(control.statusChanges, this.triggerStatusChangeSubject.pipe(map(() => control.status))) : EMPTY
      ),
      map(controlStatus => {
        // These status values are mutually exclusive, so a control
        // cannot be both valid AND invalid or invalid AND disabled.
        const status = CONTROL_STATE[controlStatus];
        return [CONTROL_STATE.VALID, CONTROL_STATE.INVALID].includes(status) ? status : CONTROL_STATE.NONE;
      }),
      startWith(CONTROL_STATE.NONE)
    );
  }
}

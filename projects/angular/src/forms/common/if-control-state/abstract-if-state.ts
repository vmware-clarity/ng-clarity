/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Directive, Optional } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgControl } from '@angular/forms';
import { merge, tap } from 'rxjs';
import { startWith, switchMap } from 'rxjs/operators';

import { NgControlService } from '../providers/ng-control.service';

@Directive()
export abstract class AbstractIfState {
  protected displayedContent = false;
  protected control: NgControl;
  protected additionalControls: NgControl[];

  protected constructor(@Optional() protected ngControlService: NgControlService) {
    if (ngControlService) {
      ngControlService.controlChanges
        .pipe(
          tap(control => (this.control = control)),
          switchMap(control => control.statusChanges.pipe(startWith(control.status), takeUntilDestroyed())),
          takeUntilDestroyed()
        )
        .subscribe(status => {
          this.handleState(status);
        });

      ngControlService.additionalControlsChanges
        .pipe(
          tap(controls => (this.additionalControls = controls)),
          switchMap(controls => {
            if (!controls || controls.length === 0) {
              return [];
            }

            const statusStreams = controls.map(c => c.statusChanges.pipe(startWith(c.status), takeUntilDestroyed()));

            return merge(...statusStreams);
          }),
          takeUntilDestroyed()
        )
        .subscribe(status => {
          this.handleState(status);
        });
    }
  }

  protected handleState(_state: any): void {
    /* overwrite in implementation to handle status change */
  }
}

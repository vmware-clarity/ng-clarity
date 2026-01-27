/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Directive, Optional } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NgControl } from '@angular/forms';
import { merge, of, tap } from 'rxjs';
import { startWith, switchMap } from 'rxjs/operators';

import { NgControlService } from '../providers/ng-control.service';

@Directive()
export abstract class AbstractIfState {
  protected displayedContent = false;
  protected controls: NgControl[];

  protected constructor(@Optional() protected ngControlService: NgControlService) {
    if (ngControlService) {
      ngControlService.controlsChanges
        .pipe(
          tap(controls => {
            this.controls = controls;
          }),
          switchMap(controls => {
            if (!controls || controls.length === 0) {
              return [];
            }

            const statusStreams = controls.map(c => this.getControlStatusChangesObservable(c));

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

  private getControlStatusChangesObservable(control: NgControl) {
    if (!control.statusChanges) {
      return of(null);
    }

    return control.statusChanges.pipe(startWith(control.status));
  }
}

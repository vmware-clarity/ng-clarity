/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Directive, Optional } from '@angular/core';
import { NgControl } from '@angular/forms';
import { merge, Subject, tap } from 'rxjs';
import { startWith, switchMap, takeUntil } from 'rxjs/operators';

import { NgControlService } from '../providers/ng-control.service';

@Directive()
export abstract class AbstractIfState {
  protected displayedContent = false;
  protected control: NgControl;
  protected additionalControls: NgControl[];

  private destroyed = new Subject<void>();
  private controlDestroyed = new Subject<void>();
  private additionalControlsDestroyed = new Subject<void>();

  protected constructor(@Optional() protected ngControlService: NgControlService) {
    if (ngControlService) {
      ngControlService.controlChanges
        .pipe(
          tap(control => {
            this.controlDestroyed.next();
            this.controlDestroyed.complete();

            this.control = control;
          }),
          switchMap(control => control.statusChanges.pipe(startWith(control.status), takeUntil(this.controlDestroyed))),
          takeUntil(this.destroyed)
        )
        .subscribe(status => {
          this.handleState(status);
        });

      ngControlService.additionalControlsChanges
        .pipe(
          tap(controls => {
            this.additionalControlsDestroyed.next();
            this.additionalControlsDestroyed.complete();

            this.additionalControls = controls;
          }),
          switchMap(controls => {
            if (!controls || controls.length === 0) {
              return [];
            }

            const statusStreams = controls.map(c =>
              c.statusChanges.pipe(startWith(c.status), takeUntil(this.additionalControlsDestroyed))
            );

            return merge(...statusStreams);
          }),
          takeUntil(this.destroyed)
        )
        .subscribe(status => {
          this.handleState(status);
        });
    }
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
    this.controlDestroyed.next();
    this.controlDestroyed.complete();
    this.additionalControlsDestroyed.next();
    this.additionalControlsDestroyed.complete();
  }

  protected handleState(_state: any): void {
    /* overwrite in implementation to handle status change */
  }
}

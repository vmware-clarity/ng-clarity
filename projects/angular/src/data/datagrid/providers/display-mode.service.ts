/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';

import { DatagridDisplayMode } from '../enums/display-mode.enum';
import { DatagridRenderStep } from '../enums/render-step.enum';
import { DatagridRenderOrganizer } from '../render/render-organizer';

@Injectable()
export class DisplayModeService implements OnDestroy {
  protected _view = new BehaviorSubject(DatagridDisplayMode.DISPLAY);

  private subscriptions: Subscription[] = [];

  constructor(renderOrganizer: DatagridRenderOrganizer) {
    this.subscriptions.push(
      renderOrganizer
        .filterRenderSteps(DatagridRenderStep.CALCULATE_MODE_ON)
        .subscribe(() => this._view.next(DatagridDisplayMode.CALCULATE))
    );

    this.subscriptions.push(
      renderOrganizer
        .filterRenderSteps(DatagridRenderStep.CALCULATE_MODE_OFF)
        .subscribe(() => this._view.next(DatagridDisplayMode.DISPLAY))
    );
  }

  get view(): Observable<DatagridDisplayMode> {
    return this._view.asObservable();
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
}

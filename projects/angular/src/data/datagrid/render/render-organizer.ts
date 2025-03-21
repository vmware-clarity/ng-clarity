/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { filter } from 'rxjs/operators';

import { DatagridRenderStep } from '../enums/render-step.enum';

@Injectable()
export class DatagridRenderOrganizer {
  protected _renderStep = new Subject<DatagridRenderStep>();

  private alreadySized = false;

  get renderStep(): Observable<DatagridRenderStep> {
    return this._renderStep.asObservable();
  }

  filterRenderSteps(step: DatagridRenderStep) {
    return this.renderStep.pipe(filter(testStep => step === testStep));
  }

  resize() {
    this._renderStep.next(DatagridRenderStep.CALCULATE_MODE_ON);
    if (this.alreadySized) {
      this._renderStep.next(DatagridRenderStep.CLEAR_WIDTHS);
    }
    this._renderStep.next(DatagridRenderStep.COMPUTE_COLUMN_WIDTHS);
    this._renderStep.next(DatagridRenderStep.ALIGN_COLUMNS); // NOT USED
    this.alreadySized = true;
    this._renderStep.next(DatagridRenderStep.CALCULATE_MODE_OFF);
  }
}

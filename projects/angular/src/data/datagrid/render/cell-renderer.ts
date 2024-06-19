/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Directive, ElementRef, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { DatagridRenderStep } from '../enums/render-step.enum';
import { ColumnState } from '../interfaces/column-state.interface';
import { CellState } from '../utils/set-cell-state';
import { STRICT_WIDTH_CLASS } from './constants';
import { DatagridRenderOrganizer } from './render-organizer';

@Directive({
  selector: 'clr-dg-cell',
})
export class DatagridCellRenderer implements OnDestroy {
  private stateSubscription: Subscription;
  private subscriptions: Subscription[] = [];
  private cellState = new CellState();

  constructor(private el: ElementRef, organizer: DatagridRenderOrganizer) {
    this.subscriptions.push(
      organizer.filterRenderSteps(DatagridRenderStep.CLEAR_WIDTHS).subscribe(() => this.clearWidth())
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    if (this.stateSubscription) {
      this.stateSubscription.unsubscribe();
    }
  }

  resetState(state: ColumnState) {
    this.setWidth(state);
    this.setHidden(state);
  }

  setWidth(state: ColumnState) {
    this.cellState.setWidth(state, this.el.nativeElement);
  }

  setHidden(state: ColumnState) {
    this.cellState.setHidden(state, this.el.nativeElement);
  }

  private clearWidth() {
    this.el.nativeElement.classList.remove(STRICT_WIDTH_CLASS);
    this.el.nativeElement.style.width = null;
  }
}

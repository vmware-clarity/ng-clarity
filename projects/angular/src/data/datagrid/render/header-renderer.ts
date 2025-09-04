/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Directive, ElementRef, EventEmitter, Inject, OnDestroy, Output, Renderer2 } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';

import { HIDDEN_COLUMN_CLASS, STRICT_WIDTH_CLASS } from './constants';
import { DatagridRenderOrganizer } from './render-organizer';
import { DomAdapter } from '../../../utils/dom-adapter/dom-adapter';
import { DatagridRenderStep } from '../enums/render-step.enum';
import { ColumnState } from '../interfaces/column-state.interface';
import { ColumnResizerService } from '../providers/column-resizer.service';
import { COLUMN_STATE, COLUMN_STATE_PROVIDER } from '../providers/column-state.provider';
import { ColumnsService } from '../providers/columns.service';

@Directive({
  selector: 'clr-dg-column',
  providers: [ColumnResizerService, COLUMN_STATE_PROVIDER],
  standalone: false,
})
export class DatagridHeaderRenderer implements OnDestroy {
  @Output('clrDgColumnResize') resizeEmitter = new EventEmitter<number>();

  /**
   * Indicates if the column has a strict width, so it doesn't shrink or expand based on the content.
   */
  private widthSet = false;
  private autoSet = false;
  private subscriptions: Subscription[] = [];

  constructor(
    private el: ElementRef<HTMLElement>,
    private renderer: Renderer2,
    organizer: DatagridRenderOrganizer,
    private domAdapter: DomAdapter,
    private columnResizerService: ColumnResizerService,
    private columnsService: ColumnsService,
    @Inject(COLUMN_STATE) private columnState: BehaviorSubject<ColumnState>
  ) {
    this.subscriptions.push(
      organizer.filterRenderSteps(DatagridRenderStep.CLEAR_WIDTHS).subscribe(() => this.clearWidth())
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  getColumnWidthState(): Partial<ColumnState> {
    const strictWidth = this.detectStrictWidth();
    return {
      width: this.computeWidth(strictWidth),
      strictWidth: strictWidth,
    };
  }

  setColumnState(index: number) {
    this.columnsService.columns[index] = this.columnState;
  }

  setWidth(state: ColumnState) {
    if (state.strictWidth) {
      if (this.columnResizerService.resizedBy) {
        this.resizeEmitter.emit(state.width);
        this.renderer.setStyle(this.el.nativeElement, 'width', state.width + 'px');
        this.widthSet = false;
      }
      // Don't set width if there is a user-defined one. Just add the strict width class.
      this.renderer.addClass(this.el.nativeElement, STRICT_WIDTH_CLASS);
      this.autoSet = false;
    } else {
      this.renderer.removeClass(this.el.nativeElement, STRICT_WIDTH_CLASS);
      this.renderer.setStyle(this.el.nativeElement, 'width', state.width + 'px');
      this.widthSet = true;
      this.autoSet = true;
    }
  }

  setHidden(state: ColumnState) {
    if (state.hidden) {
      this.renderer.addClass(this.el.nativeElement, HIDDEN_COLUMN_CLASS);
    } else {
      this.renderer.removeClass(this.el.nativeElement, HIDDEN_COLUMN_CLASS);
    }
  }

  private clearWidth() {
    // remove the width only if we set it, and it is not changed by dragging.
    if (this.widthSet && !this.columnResizerService.resizedBy) {
      this.renderer.setStyle(this.el.nativeElement, 'width', null);
    }
    if (this.autoSet) {
      this.renderer.removeClass(this.el.nativeElement, STRICT_WIDTH_CLASS);
    }
  }

  private detectStrictWidth(): number {
    if (this.columnResizerService.resizedBy) {
      return this.columnResizerService.widthAfterResize;
    } else if (this.autoSet) {
      return 0;
    } else {
      return this.domAdapter.userDefinedWidth(this.el.nativeElement);
    }
  }

  private computeWidth(strictWidth: number): number {
    let width: number = strictWidth;
    if (!width) {
      width = this.domAdapter.scrollWidth(this.el.nativeElement);
    }
    return width;
  }
}

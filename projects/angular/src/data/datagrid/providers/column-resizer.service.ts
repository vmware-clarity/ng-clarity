/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ElementRef, Injectable } from '@angular/core';

import { DomAdapter } from '../../../utils/dom-adapter/dom-adapter';
import { DatagridRenderOrganizer } from '../render/render-organizer';

const MIN_COLUMN_WIDTH = 96;

// This service allows DatagridHeaderRenderer and ClrDatagridColumnSeparator
// to share column resize data with each other.

@Injectable()
export class ColumnResizerService {
  // is it within the maximum resize range to the left
  isWithinMaxResizeRange: boolean;

  private widthBeforeResize: number;
  private _resizedBy = 0;

  constructor(
    private el: ElementRef<HTMLElement>,
    private domAdapter: DomAdapter,
    private organizer: DatagridRenderOrganizer
  ) {}

  get resizedBy() {
    return this._resizedBy;
  }

  get minColumnWidth() {
    return this.domAdapter.minWidth(this.el.nativeElement) || MIN_COLUMN_WIDTH;
  }

  get maxResizeRange() {
    return this.widthBeforeResize - this.minColumnWidth;
  }

  get widthAfterResize(): number {
    return this.widthBeforeResize + this._resizedBy;
  }

  startResize(): void {
    this._resizedBy = 0;
    this.isWithinMaxResizeRange = true;
    this.widthBeforeResize = this.domAdapter.clientRect(this.el.nativeElement).width;
  }

  endResize(): void {
    this.organizer.resize();
  }

  calculateResize(resizedBy: number): void {
    // calculates the resize amount within the allowed range
    if (resizedBy < -this.maxResizeRange) {
      this._resizedBy = -this.maxResizeRange;
      this.isWithinMaxResizeRange = false;
    } else {
      this._resizedBy = resizedBy;
      this.isWithinMaxResizeRange = true;
    }
  }
}

/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
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
  constructor(private el: ElementRef, private domAdapter: DomAdapter, private organizer: DatagridRenderOrganizer) {}

  private widthBeforeResize: number;

  private _resizedBy = 0;

  get resizedBy() {
    return this._resizedBy;
  }

  // is it within the maximum resize range to the left
  isWithinMaxResizeRange: boolean;

  get minColumnWidth() {
    return this.domAdapter.minWidth(this.el.nativeElement) || MIN_COLUMN_WIDTH;
  }

  get maxResizeRange() {
    return this.widthBeforeResize - this.minColumnWidth;
  }

  startResize(): void {
    this._resizedBy = 0;
    this.isWithinMaxResizeRange = true;
    this.widthBeforeResize = this.domAdapter.clientRect(this.el.nativeElement).width;
  }

  endResize(): void {
    this.organizer.resize();
  }

  get widthAfterResize(): number {
    return this.widthBeforeResize + this._resizedBy;
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

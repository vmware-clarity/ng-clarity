/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Injectable } from '@angular/core';

export enum ClrFormLayout {
  VERTICAL = 'vertical',
  HORIZONTAL = 'horizontal',
  COMPACT = 'compact',
}

@Injectable()
export class LayoutService {
  readonly minLabelSize = 1;
  readonly maxLabelSize = 12;

  layout: ClrFormLayout | string = ClrFormLayout.HORIZONTAL;

  private layoutValues: string[] = Object.values(ClrFormLayout);
  private _labelSize = 2;

  get labelSize(): number {
    return this._labelSize;
  }
  set labelSize(size: number) {
    if (this.labelSizeIsValid(size)) {
      this._labelSize = size;
    }
  }

  get layoutClass(): string {
    return `clr-form-${this.layout}`;
  }

  isVertical(): boolean {
    return this.layout === ClrFormLayout.VERTICAL;
  }

  isHorizontal(): boolean {
    return this.layout === ClrFormLayout.HORIZONTAL;
  }

  isCompact(): boolean {
    return this.layout === ClrFormLayout.COMPACT;
  }

  isValid(layout: string): boolean {
    return this.layoutValues.indexOf(layout) > -1;
  }

  labelSizeIsValid(labelSize: number): boolean {
    return Number.isInteger(labelSize) && labelSize >= this.minLabelSize && labelSize <= this.maxLabelSize;
  }
}

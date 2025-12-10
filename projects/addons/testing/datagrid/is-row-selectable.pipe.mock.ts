/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'isRowSelectable', standalone: false })
export class MockIsRowSelectablePipe implements PipeTransform {
  transform(rowItem: any, isLocked?: (rowItem: any) => boolean, disabled?: boolean): boolean {
    return !isLocked?.(rowItem) || !!disabled;
  }
}

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Pipe, PipeTransform } from '@angular/core';

/**
 * Used to determine whether the datagrid row is locked (disabled) or not, by
 * returning boolean result. If the disabled state is provided and is true the row
 * is consider as not selectable. If  isLocked function is provided the return
 * boolean result from it is used to be determine whether the row is selectable.
 * If  isLocked function is not provided the pipe returns null, row is consider
 * selectable.
 *
 * Usage:
 *    rowItem | isRowSelectable: isLockedFunction : disabled
 */
@Pipe({ name: 'isRowSelectable', standalone: false })
export class IsRowSelectablePipe implements PipeTransform {
  transform(rowItem: any, isLocked?: (rowItem: any) => boolean, disabled?: boolean): boolean {
    if (disabled) {
      return false;
    }
    if (isLocked) {
      return !isLocked(rowItem);
    }

    return true;
  }
}

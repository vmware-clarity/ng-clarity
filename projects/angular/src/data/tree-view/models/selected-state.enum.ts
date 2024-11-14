/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

// TODO: I'd like this to be a CheckedState enum for the checkboxes in the future.
export enum ClrSelectedState {
  // WARNING! Unselected has the value 0,
  // so it's actually the only one that will evaluate to false if cast to a boolean.
  // Don't mess with the order!
  UNSELECTED = 0,
  SELECTED,
  INDETERMINATE,
}

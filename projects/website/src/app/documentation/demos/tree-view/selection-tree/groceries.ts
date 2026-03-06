/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrSelectedState } from '@clr/angular';

export const groceries = [
  {
    name: 'Dairy',
    selected: ClrSelectedState.INDETERMINATE,
    items: [
      {
        name: 'Milk',
        selected: ClrSelectedState.UNSELECTED,
      },
      {
        name: 'Cheese',
        selected: ClrSelectedState.SELECTED,
      },
    ],
  },
  {
    name: 'Vegetables',
    selected: ClrSelectedState.UNSELECTED,
    items: [
      {
        name: 'Carrots',
        selected: ClrSelectedState.UNSELECTED,
      },
      {
        name: 'Potatoes',
        selected: ClrSelectedState.UNSELECTED,
      },
      {
        name: 'Beans',
        selected: ClrSelectedState.UNSELECTED,
      },
    ],
  },
];

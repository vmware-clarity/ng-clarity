/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrSelectedState } from '@clr/angular';

export interface Permissions {
  type: string;
  expanded: boolean;
  rights: { name: string; enable: boolean | ClrSelectedState }[];
}

export const permissions: Permissions[] = [
  {
    type: 'Authenticated Users',
    expanded: false,
    rights: [
      {
        name: 'Read',
        enable: true,
      },
      {
        name: 'Modify',
        enable: true,
      },
      {
        name: 'Create',
        enable: false,
      },
      {
        name: 'Delete',
        enable: false,
      },
    ],
  },
  {
    type: 'Owners',
    expanded: false,
    rights: [
      {
        name: 'Read',
        enable: true,
      },
      {
        name: 'Modify',
        enable: true,
      },
      {
        name: 'Create',
        enable: true,
      },
      {
        name: 'Delete',
        enable: true,
      },
    ],
  },
  {
    type: 'Public',
    expanded: false,
    rights: [
      {
        name: 'Read',
        enable: true,
      },
      {
        name: 'Modify',
        enable: false,
      },
      {
        name: 'Create',
        enable: false,
      },
      {
        name: 'Delete',
        enable: false,
      },
    ],
  },
];

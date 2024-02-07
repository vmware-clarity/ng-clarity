/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrSelectedState } from '@clr/angular';

export interface File {
  name: string;
  disabled?: boolean;
  expanded?: boolean;
  selected?: ClrSelectedState;
  files?: File[];
}

export const filesRoot: File[] = [
  {
    name: 'src',
    expanded: true,
    selected: ClrSelectedState.SELECTED,
    files: [
      {
        name: 'app',
        disabled: true,
        selected: ClrSelectedState.UNSELECTED,
        files: [
          {
            name: 'app.component.html',
          },
          {
            name: 'app.component.ts',
          },
          {
            name: 'app.module.ts',
          },
          {
            name: 'app.routing.ts',
          },
        ],
      },
      {
        name: 'environments',
        disabled: true,
        expanded: true,
        selected: ClrSelectedState.SELECTED,
        files: [
          {
            selected: ClrSelectedState.SELECTED,
            name: 'environments.prod.ts',
          },
          {
            selected: ClrSelectedState.SELECTED,
            name: 'environment.ts',
          },
        ],
      },
      {
        name: 'styles',
        files: [
          {
            name: 'main.scss',
          },
        ],
      },
      {
        name: 'index.html',
      },
      {
        name: 'main.ts',
      },
    ],
  },
  {
    disabled: true,
    selected: ClrSelectedState.UNSELECTED,
    name: 'package.json',
  },
  {
    name: 'tsconfig.json',
  },
];

export function getFileTreeNodeMarkup(files: File[] = filesRoot, useSelected?: boolean) {
  return files
    .map(file => {
      let selected = '';
      if (useSelected !== undefined && file.selected !== undefined) {
        selected = `[clrSelected]="${file.selected}"`;
      }

      return (
        `<clr-tree-node ` +
        selected +
        `[clrDisabled]="${file.disabled}" [clrExpanded]="${file.expanded}">${file.name}${
          file.files ? getFileTreeNodeMarkup(file.files, useSelected) : ''
        }</clr-tree-node>`
      );
    })
    .join('');
}

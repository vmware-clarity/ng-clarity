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
    files: [
      {
        name: 'app',
        disabled: true,
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
        selected: ClrSelectedState.INDETERMINATE,
        files: [
          {
            selected: ClrSelectedState.SELECTED,
            name: 'environments.prod.ts',
          },
          {
            selected: ClrSelectedState.UNSELECTED,
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
    name: 'package.json',
  },
  {
    name: 'tsconfig.json',
  },
];

export function getFileTreeNodeMarkup(
  files: File[] = filesRoot,
  args: { asLink?: boolean; clrSelected?: boolean; hasIcon?: boolean } = {}
) {
  return files
    .map(
      file => `
        <clr-tree-node
          [clrDisabled]="${file.disabled}"
          [clrExpanded]="${file.expanded}"
          ${args.clrSelected !== undefined && file.selected !== undefined ? `[clrSelected]="${file.selected}"` : ''}
        >
          ${args.hasIcon ? `<cds-icon [attr.shape]="'${file.files ? 'folder' : 'file'}'"></cds-icon>` : ''}
          ${args.asLink ? `<a href="javascript:;" class="clr-treenode-link">${file.name}</a>` : file.name}
          ${file.files ? getFileTreeNodeMarkup(file.files, args) : ''}
        </clr-tree-node>`
    )
    .join('');
}

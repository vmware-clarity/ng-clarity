/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

export interface File {
  name: string;
  disabled?: boolean;
  expanded?: boolean;
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
        files: [
          {
            name: 'environments.prod.ts',
          },
          {
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

export function getFileTreeNodeMarkup(files: File[] = filesRoot) {
  return files
    .map(
      file => `
        <clr-tree-node [clrDisabled]="${file.disabled}" [clrExpanded]="${file.expanded}">
          ${file.name}
          ${file.files ? getFileTreeNodeMarkup(file.files) : ''}
        </clr-tree-node>`
    )
    .join('');
}

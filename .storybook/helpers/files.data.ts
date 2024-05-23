/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

export interface File {
  name: string;
  files?: File[];
}

export const filesRoot: File[] = [
  {
    name: 'src',
    files: [
      {
        name: 'app',
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
        name: 'index.html',
      },
      {
        name: 'main.ts',
      },
    ],
  },
  {
    name: 'package.json',
  },
  {
    name: 'tsconfig.json',
  },
];

export function getFileTreeNodeMarkup(files: File[] = filesRoot) {
  return files
    .map(file => `<clr-tree-node>${file.name}${file.files ? getFileTreeNodeMarkup(file.files) : ''}</clr-tree-node>`)
    .join('');
}

import { ClrSelectedState } from '@clr/angular';

export interface File {
  name: string;
  isFolder: boolean;
  disabled?: boolean;
  expanded?: boolean;
  selected?: ClrSelectedState;
  files?: File[];
}

export const files: File[] = [
  {
    name: 'src',
    isFolder: true,
    expanded: true,
    files: [
      {
        name: 'app',
        isFolder: true,
        disabled: true,
        selected: ClrSelectedState.SELECTED,
        files: [
          {
            name: 'app.component.html',
            isFolder: false,
            selected: ClrSelectedState.SELECTED,
          },
          {
            name: 'app.component.ts',
            isFolder: false,
            selected: ClrSelectedState.SELECTED,
          },
          {
            name: 'app.module.ts',
            isFolder: false,
            selected: ClrSelectedState.SELECTED,
          },
          {
            name: 'app.routing.ts',
            isFolder: false,
            selected: ClrSelectedState.SELECTED,
          },
        ],
      },
      {
        name: 'environments',
        isFolder: true,
        disabled: true,
        expanded: true,
        selected: ClrSelectedState.INDETERMINATE,
        files: [
          {
            name: 'environments.prod.ts',
            isFolder: false,
            selected: ClrSelectedState.SELECTED,
          },
          {
            name: 'environment.ts',
            isFolder: false,
            selected: ClrSelectedState.UNSELECTED,
          },
        ],
      },
      {
        name: 'styles',
        isFolder: true,
        files: [
          {
            name: 'main.scss',
            isFolder: false,
            selected: ClrSelectedState.SELECTED,
          },
        ],
      },
      {
        name: 'index.html',
        isFolder: false,
      },
      {
        name: 'main.ts',
        isFolder: false,
        selected: ClrSelectedState.SELECTED,
      },
    ],
  },
  {
    name: 'package.json',
    isFolder: false,
    disabled: true,
    selected: ClrSelectedState.UNSELECTED,
  },
  {
    name: 'tsconfig.json',
    isFolder: false,
    selected: ClrSelectedState.UNSELECTED,
  },
];

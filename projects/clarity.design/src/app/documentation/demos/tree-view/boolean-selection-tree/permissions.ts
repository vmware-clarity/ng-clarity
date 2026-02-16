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

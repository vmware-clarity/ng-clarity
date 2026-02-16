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

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { type Meta, type StoryObj } from '@storybook/angular';
import { hideControls } from '@storybook-helpers/arg-types';
import { type Element, elements } from '@storybook-helpers/elements.data';

/** Plain table markup with no component and no story wrapper, so the args are declared standalone. */
type TableArgs = {
  elements: Element[];
  rowCount: number;
  leftAligned: boolean;
  bordered: boolean;
  compact: boolean;
  vertical: boolean;
};

const meta: Meta<TableArgs> = {
  title: 'Components/Data/Table',
  argTypes: {
    // story helpers
    ...hideControls('elements'),
    rowCount: { control: { type: 'number', min: 0, max: elements.length } },
  },
  args: {
    // story helpers
    elements,
    rowCount: 10,
    leftAligned: false,
    bordered: false,
    compact: false,
    vertical: false,
  },
  render: args => ({
    template: `
      <table
        class="table"
        [ngClass]="{ 'table-noborder': !bordered, 'table-compact': compact, 'table-vertical': vertical }"
      >
        <thead>
          <tr>
            <th [ngClass]="{ left: leftAligned }">Element Name</th>
            <th [ngClass]="{ left: leftAligned }">Symbol</th>
            <th [ngClass]="{ left: leftAligned }">Atomic Number</th>
            <th [ngClass]="{ left: leftAligned }">Electronegativity (χ)</th>
          </tr>
        </thead>
        <tbody>
          @for (element of elements; track element; let i = $index) {
            @if (i < rowCount) {
              <tr>
                <td [ngClass]="{ left: leftAligned }">{{ element.name }}</td>
                <td [ngClass]="{ left: leftAligned }">{{ element.symbol }}</td>
                <td [ngClass]="{ left: leftAligned }">{{ element.number }}</td>
                <td [ngClass]="{ left: leftAligned }">{{ element.electronegativity }}</td>
              </tr>
            }
          }
        </tbody>
      </table>
    `,
    props: { ...args },
  }),
};

export default meta;

type Story = StoryObj<TableArgs>;

export const Basic: Story = {
  args: {
    leftAligned: false,
    bordered: true,
    compact: false,
    vertical: false,
  },
};

export const Compact: Story = {
  args: {
    leftAligned: false,
    bordered: true,
    compact: true,
    vertical: false,
  },
};

export const NonBordered: Story = {
  args: {
    leftAligned: false,
    bordered: false,
    compact: false,
    vertical: false,
  },
};

export const LeftAligned: Story = {
  args: {
    leftAligned: true,
    bordered: true,
    compact: false,
    vertical: false,
  },
};

export const Vertical: Story = {
  args: {
    leftAligned: false,
    bordered: true,
    compact: false,
    vertical: true,
  },
};

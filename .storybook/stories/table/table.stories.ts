/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { StoryFn, StoryObj } from '@storybook/angular';

import { elements } from '../../helpers/elements.data';

export default {
  title: 'Table/Table',
  argTypes: {
    // story helpers
    elements: { control: { disable: true }, table: { disable: true } },
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
};

const TableTemplate: StoryFn = args => ({
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
        <ng-container *ngFor="let element of elements; let i = index">
          <tr *ngIf="i < rowCount">
            <td [ngClass]="{ left: leftAligned }">{{ element.name }}</td>
            <td [ngClass]="{ left: leftAligned }">{{ element.symbol }}</td>
            <td [ngClass]="{ left: leftAligned }">{{ element.number }}</td>
            <td [ngClass]="{ left: leftAligned }">{{ element.electronegativity }}</td>
          </tr>
        </ng-container>
      </tbody>
    </table>
  `,
  props: { ...args },
});

export const Basic: StoryObj = {
  render: TableTemplate,
  args: {
    leftAligned: false,
    bordered: true,
    compact: false,
    vertical: false,
  },
};

export const Compact: StoryObj = {
  render: TableTemplate,
  args: {
    leftAligned: false,
    bordered: true,
    compact: true,
    vertical: false,
  },
};

export const NonBordered: StoryObj = {
  render: TableTemplate,
  args: {
    leftAligned: false,
    bordered: false,
    compact: false,
    vertical: false,
  },
};

export const LeftAligned: StoryObj = {
  render: TableTemplate,
  args: {
    leftAligned: true,
    bordered: true,
    compact: false,
    vertical: false,
  },
};

export const Vertical: StoryObj = {
  render: TableTemplate,
  args: {
    leftAligned: false,
    bordered: true,
    compact: false,
    vertical: true,
  },
};

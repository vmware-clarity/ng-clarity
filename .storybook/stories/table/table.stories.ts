/*
 * Copyright (c) 2016-2022 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Parameters } from '@storybook/addons';
import { Story } from '@storybook/angular';

import { elements } from '../../helpers/elements.data';
import { setupStorybook } from '../../helpers/setup-storybook.helpers';

const defaultStory: Story = args => ({
  template: `
    <table class="table" [ngClass]="{ 'table-noborder': !bordered, 'table-compact': compact, 'table-vertical': vertical }">
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
            <td [ngClass]="{ left: leftAligned }">{{element.name}}</td>
            <td [ngClass]="{ left: leftAligned }">{{element.symbol}}</td>
            <td [ngClass]="{ left: leftAligned }">{{element.number}}</td>
            <td [ngClass]="{ left: leftAligned }">{{element.electronegativity}}</td>
          </tr>
        </ng-container>
      </tbody>
    </table>
  `,
  props: { ...args },
});

const defaultParameters: Parameters = {
  title: 'Table/Table',
  argTypes: {
    // story helpers
    elements: { control: { disable: true }, table: { disable: true } },
    rowCount: { control: { type: 'number', min: 0, max: elements.length } },
  },
  args: {
    // story helpers
    elements,
    rowCount: elements.length,
    leftAligned: false,
    bordered: true,
    compact: false,
    vertical: false,
  },
};

const variants: Parameters[] = [
  {
    rowCount: 10,
    leftAligned: false,
    bordered: false,
    compact: false,
    vertical: false,
  },
  {
    rowCount: 10,
    leftAligned: true,
    bordered: true,
    compact: false,
    vertical: false,
  },
  {
    rowCount: 10,
    leftAligned: false,
    bordered: true,
    compact: true,
    vertical: false,
  },
  {
    rowCount: 10,
    leftAligned: true,
    bordered: true,
    compact: true,
    vertical: false,
  },
  {
    rowCount: 10,
    leftAligned: false,
    bordered: true,
    compact: false,
    vertical: true,
  },
];

setupStorybook([], defaultStory, defaultParameters, variants);

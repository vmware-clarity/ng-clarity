/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { type Meta, type StoryObj } from '@storybook/angular';
import { hideControls } from '@storybook-helpers/arg-types';

/**
 * Plain markup with no component and no story wrapper, so the args are declared standalone.
 * `createArray` stays an arg: the meta template calls it through `props: args`.
 */
type ListArgs = {
  createArray: (n: number) => unknown[];
  itemCount: number;
  unstyled: boolean;
};

const meta: Meta<ListArgs> = {
  title: 'List/List',
  argTypes: {
    // story helpers
    ...hideControls('createArray'),
  },
  args: {
    // story helpers
    createArray: n => new Array(n),
    itemCount: 4,
    unstyled: false,
  },
  render: args => ({
    template: `
      <div>
        Unordered List
        <ul [ngClass]="{ list: !unstyled, 'list-unstyled': unstyled }">
          @for (_ of createArray(itemCount); track $index; let i = $index) {
            <li>Item {{ i + 1 }}</li>
          }
        </ul>
      </div>

      <div style="margin-top: 20px">
        Ordered List
        <ol [ngClass]="{ list: !unstyled, 'list-unstyled': unstyled }">
          @for (_ of createArray(itemCount); track $index; let i = $index) {
            <li>Item {{ i + 1 }}</li>
          }
        </ol>
      </div>
    `,
    props: args,
  }),
};

export default meta;

type Story = StoryObj<ListArgs>;

export const List: Story = {};

export const UnstyledList: Story = {
  args: {
    unstyled: true,
  },
};

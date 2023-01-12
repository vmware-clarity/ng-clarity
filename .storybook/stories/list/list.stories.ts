/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Parameters } from '@storybook/addons';
import { Story } from '@storybook/angular';

import { setupStorybook } from '../../helpers/setup-storybook.helpers';

const defaultStory: Story = args => ({
  template: `
    <div>
      Unordered List
      <ul [ngClass]="{ 'list': !unstyled, 'list-unstyled': unstyled, compact }">
        <li *ngFor="let _ of createArray(itemCount); let i = index">
          Item {{i + 1}}
        </li>
      </ul>
    </div>

    <div style="margin-top: 20px;">
      Ordered List
      <ol [ngClass]="{ 'list': !unstyled, 'list-unstyled': unstyled, compact }">
        <li *ngFor="let _ of createArray(itemCount); let i = index">
          Item {{i + 1}}
        </li>
      </ol>
    </div>
  `,
  props: { ...args },
});

const defaultParameters: Parameters = {
  title: 'List/List',
  argTypes: {
    // story helpers
    createArray: { control: { disable: true }, table: { disable: true } },
  },
  args: {
    // story helpers
    createArray: n => new Array(n),
    itemCount: 4,
    unstyled: false,
    compact: false,
  },
};

const variants: Parameters[] = [
  {
    unstyled: false,
    compact: false,
  },
  {
    unstyled: false,
    compact: true,
  },
  {
    unstyled: true,
    compact: false,
  },
  {
    unstyled: true,
    compact: true,
  },
];

setupStorybook([], defaultStory, defaultParameters, variants);

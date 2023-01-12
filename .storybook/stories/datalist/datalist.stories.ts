/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrDatalist, ClrDatalistModule } from '@clr/angular';
import { Parameters } from '@storybook/addons';
import { Story } from '@storybook/angular';

import { elements } from '../../helpers/elements.data';
import { setupStorybook } from '../../helpers/setup-storybook.helpers';

const defaultStory: Story = args => ({
  template: `
    <clr-datalist-container>
      <input clrDatalistInput [disabled]="disabled" placeholder="Options" />
      <datalist>
        <ng-container *ngFor="let element of elements; let i = index">
          <option *ngIf="i < optionCount" [value]="element.symbol">{{element.name}}</option>
        </ng-container>
      </datalist>
    </clr-datalist-container>
  `,
  props: { ...args },
});

const defaultParameters: Parameters = {
  title: 'Datalist/Datalist',
  component: ClrDatalist,
  argTypes: {
    // story helpers
    elements: { control: { disable: true }, table: { disable: true } },
    optionCount: { control: { type: 'number', min: 1, max: elements.length } },
  },
  args: {
    // story helpers
    elements,
    optionCount: elements.length,
    content: 'Option',
    disabled: false,
  },
};

const variants: Parameters[] = [
  {
    disabled: false,
  },
  {
    disabled: true,
  },
];

setupStorybook(ClrDatalistModule, defaultStory, defaultParameters, variants);

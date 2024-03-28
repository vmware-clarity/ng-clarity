/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrDatalist, ClrDatalistModule, ClrFormsModule } from '@clr/angular';
import { moduleMetadata, StoryFn, StoryObj } from '@storybook/angular';
import { CommonModules } from 'helpers/common';

import { CommonModules } from '../../helpers/common';
import { elements } from '../../helpers/elements.data';

export default {
  title: 'Datalist/Datalist',
  decorators: [
    moduleMetadata({
      imports: [...CommonModules, ClrDatalistModule, ClrFormsModule],
    }),
  ],
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
    placeholder: 'Options',
    disabled: false,
  },
};

const DatalistTemplate: StoryFn = args => ({
  template: `
    <clr-datalist-container>
      <input clrDatalistInput [disabled]="disabled" [placeholder]="placeholder" />
      <datalist>
        <ng-container *ngFor="let element of elements; let i = index">
          <option *ngIf="i < optionCount" [value]="element.symbol">{{ element.name }}</option>
        </ng-container>
      </datalist>
      <clr-control-helper>Helper text</clr-control-helper>
      <clr-control-error>There was an error</clr-control-error>
    </clr-datalist-container>
  `,
  props: args,
});

export const Datalist: StoryObj = {
  render: DatalistTemplate,
};

export const Disabled: StoryObj = {
  render: DatalistTemplate,
  args: { disabled: true },
};

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrDatalist, ClrDatalistModule, ClrFormsModule } from '@clr/angular';
import { type Meta, moduleMetadata, type StoryObj } from '@storybook/angular';
import { hideControls } from '@storybook-helpers/arg-types';
import { CommonModules } from '@storybook-helpers/common';
import { type Element, elements } from '@storybook-helpers/elements.data';

/**
 * The template binds a plain `<input clrDatalistInput>`, not `ClrDatalist` itself, so the args are
 * the story-only props the template reads plus the two input attributes it forwards.
 */
type DatalistArgs = {
  elements: Element[];
  optionCount: number;
  placeholder: string;
  disabled: boolean;
};

const meta: Meta<DatalistArgs> = {
  title: 'Datalist/Datalist',
  decorators: [
    moduleMetadata({
      imports: [...CommonModules, ClrDatalistModule, ClrFormsModule],
    }),
  ],
  component: ClrDatalist,
  argTypes: {
    // story helpers
    ...hideControls('elements'),
    optionCount: { control: { type: 'number', min: 1, max: elements.length } },
  },
  args: {
    // story helpers
    elements,
    optionCount: elements.length,
    placeholder: 'Options',
    disabled: false,
  },
  render: args => ({
    template: `
      <clr-datalist-container>
        <label>Element</label>
        <input clrDatalistInput [disabled]="disabled" [placeholder]="placeholder" />
        <datalist>
          @for (element of elements; track element; let i = $index) {
            @if (i < optionCount) {
              <option [value]="element.symbol">{{ element.name }}</option>
            }
          }
        </datalist>
        <clr-control-helper>Helper text</clr-control-helper>
        <clr-control-error>There was an error</clr-control-error>
      </clr-datalist-container>
    `,
    props: args,
  }),
};

export default meta;

type Story = StoryObj<DatalistArgs>;

export const Datalist: Story = {};

export const Disabled: Story = {
  args: { disabled: true },
};

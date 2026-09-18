/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrSelect, ClrSelectModule } from '@clr/angular';
import { type Meta, moduleMetadata, type StoryObj } from '@storybook/angular';
import { hideControls } from '@storybook-helpers/arg-types';

/**
 * The template binds a plain `<select clrSelect>` rather than `ClrSelect` itself, so the args are declared
 * standalone. `createArray` stays an arg because the meta template calls it through `props`.
 */
type SelectArgs = {
  id: string;
  createArray: (n: number) => unknown[];
  optionCount: number;
};

const meta: Meta<SelectArgs> = {
  title: 'Components/Forms/Select',
  component: ClrSelect,
  decorators: [
    moduleMetadata({
      imports: [ClrSelectModule],
    }),
  ],
  argTypes: {
    // methods
    ...hideControls('getProviderFromContainer', 'triggerValidation'),
    // story helpers
    ...hideControls('createArray'),
  },
  args: {
    // inputs
    id: '',
    // story helpers
    createArray: n => new Array(n),
    optionCount: 3,
  },
  render: args => ({
    template: `
      <clr-select-container>
        <label>Options</label>
        <select clrSelect>
          @for (_ of createArray(optionCount); track $index; let i = $index) {
            <option [value]="i + 1" [disabled]="i === 0">Option {{ i + 1 }}</option>
          }
        </select>
      </clr-select-container>
    `,
    props: { ...args },
  }),
};

export default meta;

type Story = StoryObj<SelectArgs>;

export const Select: Story = {};

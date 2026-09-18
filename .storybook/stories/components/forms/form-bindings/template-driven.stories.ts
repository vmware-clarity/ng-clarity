/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrFormLayout, ClrFormsModule, ClrLayoutModule } from '@clr/angular';
import { type Meta, moduleMetadata, type StoryObj } from '@storybook/angular';
import { hideControls } from '@storybook-helpers/arg-types';
import { CommonModules } from '@storybook-helpers/common';
import { type Element, elements } from '@storybook-helpers/elements.data';

/**
 * The template is raw `clrForm` markup -- there is no Clarity component and no story wrapper to base the
 * args on -- so the args are declared explicitly. `data` holds the mapping key, not the model object:
 * Storybook swaps it for the real object through the `mapping` in `argTypes`. `namePlaceholder` is set by
 * two stories but never read by this template; it is declared so those `args` keep type-checking.
 */
type FormsTemplateDrivenArgs = {
  clrLabelSize: number;
  elements: Element[];
  patterns: { alphaNumeric: RegExp; letters: RegExp; numbers: RegExp };
  clrLayout: ClrFormLayout;
  screenReaderContent: string;
  data: string;
  namePlaceholder: string;
};

const formMappingKey = 'form-mapping-key';
const patterns = {
  alphaNumeric: /^[a-z\d]+$/i,
  letters: /[a-z]/i,
  numbers: /\d/i,
};

function getForm() {
  return {
    name: '',
    age: null,
    password: '',
    description: '',
  };
}

const meta: Meta<FormsTemplateDrivenArgs> = {
  title: 'Components/Forms/Form Bindings/Template Driven',
  decorators: [
    moduleMetadata({
      imports: [...CommonModules, ClrLayoutModule, ClrFormsModule],
    }),
  ],
  argTypes: {
    // inputs
    clrLabelSize: { control: { type: 'number', min: 1, max: 12 } },
    // story helpers
    ...hideControls('patterns'),
    data: { control: { disable: true }, table: { disable: true }, mapping: { [formMappingKey]: getForm() } },
    clrLayout: {
      control: { type: 'radio' },
      options: Object.values(ClrFormLayout).filter(value => typeof value === 'string'),
    },
  },
  args: {
    // inputs
    clrLabelSize: 2,
    // story helpers
    elements,
    patterns,
    clrLayout: ClrFormLayout.HORIZONTAL,
    screenReaderContent: 'Please fill out the form',
    data: formMappingKey,
  },
  render: args => ({
    template: `
      <form clrForm [clrLayout]="clrLayout" [clrLabelSize]="clrLabelSize">
        <span class="clr-sr-only">{{ screenReaderContent }}</span>
        <clr-input-container>
          <label>Name</label>
          <input clrInput [(ngModel)]="data.name" required name="name" />
          <clr-control-helper>Helper text that shows while it is pristine and valid</clr-control-helper>
          <clr-control-success>Name is valid</clr-control-success>
          <clr-control-error *clrIfError="'required'">Name is required</clr-control-error>
          <clr-control-error *clrIfError="'minlength'">Must be at least 5 characters</clr-control-error>
          <clr-control-error *clrIfError="'pattern'">Must contain only alpha-numeric characters</clr-control-error>
        </clr-input-container>
        <clr-number-input-container>
          <label>Age</label>
          <input clrNumberInput [(ngModel)]="data.age" type="number" min="0" required name="age" />
          <clr-control-helper>Helper text that shows while it is pristine and valid</clr-control-helper>
          <clr-control-success>Age is valid</clr-control-success>
          <clr-control-error *clrIfError="'required'">Age is required</clr-control-error>
          <clr-control-error *clrIfError="'min'">Must be at least 5 years old</clr-control-error>
          <clr-control-error *clrIfError="'max'">Must be less than 100 years old</clr-control-error>
        </clr-number-input-container>
        <clr-datalist-container>
          <label>Element</label>
          <input clrDatalistInput name="element" [(ngModel)]="data.element" />
          <datalist>
            @for (element of elements; track element) {
              <option [value]="element.symbol">{{ element.name }}</option>
            }
          </datalist>
          <clr-control-helper>Helper text that shows while it is pristine and valid</clr-control-helper>
        </clr-datalist-container>
        <clr-password-container>
          <label>Password</label>
          <input clrPassword autocomplete="current-password" [(ngModel)]="data.password" required name="password" />
          <clr-control-helper>Helper text that shows while it is pristine and valid</clr-control-helper>
          <clr-control-success>Password is valid</clr-control-success>
          <clr-control-error *clrIfError="'required'">Password is required</clr-control-error>
          <clr-control-error *clrIfError="'minlength'">Must be at least 8 characters</clr-control-error>
          <clr-control-error *clrIfError="'pattern'; error as error">
            @switch (error.requiredPattern) {
              @case (patterns.alphaNumeric.toString()) {
                Must contain only letters and numbers
              }
              @case (patterns.letters.toString()) {
                Must contain at least one letter
              }
              @case (patterns.numbers.toString()) {
                Must contain at least one number
              }
            }
          </clr-control-error>
        </clr-password-container>
        <clr-textarea-container>
          <label>Description</label>
          <textarea clrTextarea [(ngModel)]="data.description" required name="description"></textarea>
          <clr-control-helper>Helper text that shows while it is pristine and valid</clr-control-helper>
          <clr-control-success>Description is valid</clr-control-success>
          <clr-control-error *clrIfError="'required'">Description is required</clr-control-error>
          <clr-control-error *clrIfError="'minlength'">Must be at least 5 characters</clr-control-error>
          <clr-control-error *clrIfError="'pattern'">Must contain only alpha-numeric characters</clr-control-error>
        </clr-textarea-container>
      </form>
    `,
    props: args,
  }),
};

export default meta;

type Story = StoryObj<FormsTemplateDrivenArgs>;

export const HorizontalLayout: Story = {};

export const HorizontalLayoutLabelSize6: Story = {
  args: { clrLabelSize: 6 },
};

export const VerticalLayout: Story = {
  args: { namePlaceholder: 'Test placeholder', clrLayout: ClrFormLayout.VERTICAL },
};

export const CompactLayout: Story = {
  args: { namePlaceholder: 'Test placeholder', clrLayout: ClrFormLayout.COMPACT },
};

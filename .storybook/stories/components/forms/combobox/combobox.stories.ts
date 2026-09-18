/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { argsToTemplate, type Meta, moduleMetadata, type StoryObj } from '@storybook/angular';
import { hideControls } from '@storybook-helpers/arg-types';
import { CommonModules } from '@storybook-helpers/common';
import { elements } from '@storybook-helpers/elements.data';

import { StorybookComboboxComponent } from './combobox.storybook.component';

/** Either an option symbol or the whole element object, depending on the `objectValues` arg. */
type ComboboxModel = string | { name: string; symbol: string; number: number; electronegativity: number };

/**
 * The args drive `<storybook-combobox>`, so the args type is that wrapper, with the two models widened
 * because the object-value stories swap a symbol string for the element object. `optionCount` and
 * `updateOn` are declared only in `argTypes` -- they are neither inputs nor args -- so they are named here
 * to keep `argTypes` type-checked.
 */
type ComboboxArgs = Omit<StorybookComboboxComponent, 'singleModel' | 'multiModel'> & {
  singleModel: ComboboxModel;
  multiModel: ComboboxModel[];
  optionCount: number;
  updateOn: 'change' | 'blur' | 'submit';
};

const meta: Meta<ComboboxArgs> = {
  title: 'Components/Forms/Combobox',
  component: StorybookComboboxComponent,
  decorators: [
    moduleMetadata({
      imports: [CommonModules, StorybookComboboxComponent],
    }),
  ],
  argTypes: {
    // outputs
    clrInputChange: { control: { disable: true } },
    clrOpenChange: { control: { disable: true } },
    clrSelectionChange: { control: { disable: true } },
    // methods
    ...hideControls(
      'focusFirstActive',
      'focusInput',
      'getActiveDescendant',
      'getSelectionAriaLabel',
      'inputId',
      'loadingStateChange',
      'onBlur',
      'onFocus',
      'onKeyUp',
      'registerOnChange',
      'registerOnTouched',
      'setDisabledState',
      'unselect',
      'writeValue',
      'getProviderFromContainer',
      'triggerValidation'
    ),
    // story helpers
    useGroups: { control: { type: 'boolean' } },
    ...hideControls('elements', 'optionGroups'),
    optionCount: { control: { type: 'number', min: 1, max: elements.length } },
    updateOn: { control: { type: 'radio' }, options: ['change', 'blur', 'submit'] },
    useIdentityFn: { control: { type: 'boolean' } },
  },
  args: {
    clrEditable: false,
    clrMulti: false,
    showSelectAll: false,
    placeholder: 'Placeholder text',
    id: '',
    label: 'Combobox',
    clrLoading: false,
    controlDisabled: false,
    controlRequired: false,
    controlHelper: false,
    helperText: 'Helper text',
    useGroups: false,
    objectValues: false,
    useIdentityFn: false,
    elements: elements,
    singleModel: 'Am',
    multiModel: ['Am', 'As', 'Ba'],
    multiLineItems: false,
  },
};

export default meta;

type Story = StoryObj<ComboboxArgs>;

export const SingleSelection: Story = {};

export const SingleSelection_Preselected: Story = {
  args: {
    singleModel: 'Ba',
  },
};

export const SingleSelectionWithGroups: Story = {
  args: {
    useGroups: true,
  },
};

export const SingleSelectionDisabled: Story = {
  args: {
    controlDisabled: true,
  },
};

export const SingleSelectionEditable: Story = {
  args: {
    clrEditable: true,
  },
};

export const SingleSelectionEditableWithObjectValues: Story = {
  args: {
    clrEditable: true,
    objectValues: true,
  },
  // render-override: this story swaps the single model for the whole element object before rendering, which the docs-generated component template cannot express
  render: args => {
    const transformedArgs = args;
    transformedArgs.singleModel = transformedArgs.objectValues
      ? { name: 'Americium', symbol: 'Am', number: 95, electronegativity: 1.3 }
      : ('Am' as any);
    return {
      props: {
        ...args,
      },
      template: `
        <storybook-combobox ${argsToTemplate(args)}></storybook-combobox>
      `,
    };
  },
};

export const SingleSelectionEditableWithIdentityFnAndResolver: Story = {
  args: {
    clrEditable: true,
    objectValues: true,
    useIdentityFn: true,
  },
  // render-override: this story swaps the single model for the whole element object before rendering, which the docs-generated component template cannot express
  render: args => {
    const transformedArgs = args;
    transformedArgs.singleModel = transformedArgs.objectValues
      ? { name: 'Americium', symbol: 'Am', number: 95, electronegativity: 1.3 }
      : ('Am' as any);
    return {
      props: transformedArgs,
      template: `
        <storybook-combobox ${argsToTemplate(transformedArgs)}></storybook-combobox>
      `,
    };
  },
};

export const SingleSelectionWithIdentityFn: Story = {
  args: {
    objectValues: true,
    useIdentityFn: true,
  },
  // render-override: this story swaps the single model for the whole element object before rendering, which the docs-generated component template cannot express
  render: args => {
    const transformedArgs = args;
    transformedArgs.singleModel = transformedArgs.objectValues
      ? { name: 'Americium', symbol: 'Am', number: 95, electronegativity: 1.3 }
      : ('Am' as any);
    return {
      props: transformedArgs,
      template: `
        <storybook-combobox ${argsToTemplate(transformedArgs)}></storybook-combobox>
      `,
    };
  },
};

export const MultiSelection: Story = {
  args: {
    clrMulti: true,
  },
};

export const MultiSelection_MultiLine: Story = {
  args: {
    clrMulti: true,
    multiModel: elements.map(element => element.symbol), // all elements
  },
};

export const MultiSelectionWithGroups: Story = {
  args: {
    clrMulti: true,
    useGroups: true,
  },
};

export const MultiSelectionDisabled: Story = {
  args: {
    clrMulti: true,
    controlDisabled: true,
  },
};

export const MultiSelectionEditable: Story = {
  args: {
    clrMulti: true,
    clrEditable: true,
  },
};

export const MultiSelectionEditableWithObjectValues: Story = {
  args: {
    clrMulti: true,
    clrEditable: true,
    objectValues: true,
  },
  // render-override: this story swaps the multi model for whole element objects before rendering, which the docs-generated component template cannot express
  render: args => {
    const transformedArgs = args;
    transformedArgs.multiModel = transformedArgs.objectValues
      ? [
          { name: 'Americium', symbol: 'Am', number: 95, electronegativity: 1.3 },
          { name: 'Berkelium', symbol: 'Bk', number: 97, electronegativity: 1.3 },
          { name: 'Chlorine', symbol: 'Cl', number: 17, electronegativity: 3.16 },
        ]
      : (['Am', 'As', 'Ba'] as any);
    return {
      props: {
        ...args,
      },
      template: `
        <storybook-combobox ${argsToTemplate(args)}></storybook-combobox>
      `,
    };
  },
};

export const MultiSelectionEditableWithIdentityFnAndResolver: Story = {
  args: {
    clrMulti: true,
    clrEditable: true,
    objectValues: true,
    useIdentityFn: true,
    multiModel: [
      { name: 'Americium', symbol: 'Am', number: 95, electronegativity: 1.3 },
      { name: 'Berkelium', symbol: 'Bk', number: 97, electronegativity: 1.3 },
    ],
  },
  // render-override: this story swaps the multi model for whole element objects before rendering, which the docs-generated component template cannot express
  render: args => {
    const transformedArgs = args;
    transformedArgs.multiModel = transformedArgs.objectValues
      ? [
          { name: 'Americium', symbol: 'Am', number: 95, electronegativity: 1.3 },
          { name: 'Berkelium', symbol: 'Bk', number: 97, electronegativity: 1.3 },
          { name: 'Chlorine', symbol: 'Cl', number: 17, electronegativity: 3.16 },
        ]
      : (['Am', 'As', 'Ba'] as any);
    return {
      props: transformedArgs,
      template: `
        <storybook-combobox ${argsToTemplate(transformedArgs)}></storybook-combobox>
      `,
    };
  },
};

export const MultiSelectionWithIdentityFn: Story = {
  args: {
    clrMulti: true,
    objectValues: true,
    useIdentityFn: true,
    multiModel: [
      { name: 'Americium', symbol: 'Am', number: 95, electronegativity: 1.3 },
      { name: 'Berkelium', symbol: 'Bk', number: 97, electronegativity: 1.3 },
    ],
  },
  // render-override: this story swaps the multi model for whole element objects before rendering, which the docs-generated component template cannot express
  render: args => {
    const transformedArgs = args;
    transformedArgs.multiModel = transformedArgs.objectValues
      ? [
          { name: 'Americium', symbol: 'Am', number: 95, electronegativity: 1.3 },
          { name: 'Berkelium', symbol: 'Bk', number: 97, electronegativity: 1.3 },
          { name: 'Chlorine', symbol: 'Cl', number: 17, electronegativity: 3.16 },
        ]
      : (['Am', 'As', 'Ba'] as any);
    return {
      props: transformedArgs,
      template: `
        <storybook-combobox ${argsToTemplate(transformedArgs)}></storybook-combobox>
      `,
    };
  },
};

export const MultiSelectionWithSelectAll: Story = {
  args: {
    clrMulti: true,
    showSelectAll: true,
  },
};

export const MultiSelectionWithSelectAll_Opened: Story = {
  args: {
    clrMulti: true,
    showSelectAll: true,
  },
  play({ canvasElement }) {
    (canvasElement.querySelector('.clr-combobox-trigger') as HTMLElement).click();
  },
};

export const MultiSelectionWithSelectAllAndIdentityFn: Story = {
  args: {
    clrMulti: true,
    showSelectAll: true,
    objectValues: true,
    useIdentityFn: true,
    multiModel: [
      { name: 'Americium', symbol: 'Am', number: 95, electronegativity: 1.3 },
      { name: 'Berkelium', symbol: 'Bk', number: 97, electronegativity: 1.3 },
    ],
  },
};

export const SingleSelectionRequired: Story = {
  args: {
    singleModel: '',
    controlHelper: true,
    controlRequired: true,
  },
};

export const MultiSelectionRequired: Story = {
  args: {
    multiModel: [],
    clrMulti: true,
    controlHelper: true,
    controlRequired: true,
  },
};

export const Loading: Story = {
  args: {
    clrLoading: true,
    elements: [],
  },
  play({ canvasElement }) {
    (canvasElement.querySelector('.clr-combobox-trigger') as HTMLElement).click();
  },
};

export const Opened: Story = {
  play({ canvasElement }) {
    (canvasElement.querySelector('.clr-combobox-trigger') as HTMLElement).click();
  },
};

export const OpenedMultiLineItems: Story = {
  args: {
    multiLineItems: true,
  },
  play({ canvasElement }) {
    (canvasElement.querySelector('.clr-combobox-trigger') as HTMLElement).click();
  },
};

export const NoResults: Story = {
  play({ canvasElement }) {
    (canvasElement.querySelector('.clr-combobox-trigger') as HTMLElement).click();
    (canvasElement.querySelector('.clr-combobox-input') as HTMLInputElement).value = 'Lapis philosophorum';
    canvasElement.querySelector('.clr-combobox-input').dispatchEvent(new Event('input', { bubbles: true }));
  },
};

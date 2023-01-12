/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrCheckbox, ClrCheckboxModule } from '@clr/angular';
import { Parameters } from '@storybook/addons';
import { Story } from '@storybook/angular';

import { setupStorybook } from '../../helpers/setup-storybook.helpers';

enum CheckboxType {
  Checkbox = 'checkbox',
  Toggle = 'toggle',
}

const defaultStory: Story = args => {
  const containerSelector = args.type === CheckboxType.Checkbox ? 'clr-checkbox-container' : 'clr-toggle-container';
  const wrapperSelector = args.type === CheckboxType.Checkbox ? 'clr-checkbox-wrapper' : 'clr-toggle-wrapper';
  const directive = args.type === CheckboxType.Checkbox ? 'clrCheckbox' : 'clrToggle';

  return {
    template: `
      <${containerSelector}> <!-- The container is required in this story so that the disabled state works correctly. -->
        <${wrapperSelector}>
          <input type="checkbox" ${directive} [ngModel]="checked" [disabled]="disabled" />
          <label>{{label}}</label>
        </${wrapperSelector}>
      </${containerSelector}>
    `,
    props: { ...args },
  };
};

const defaultParameters: Parameters = {
  title: 'Checkbox or Toggle/Checkbox or Toggle',
  component: ClrCheckbox,
  argTypes: {
    // inputs
    id: { defaultValue: '' },
    // methods
    getProviderFromContainer: { control: { disable: true }, table: { disable: true } },
    triggerValidation: { control: { disable: true }, table: { disable: true } },
    // story helpers
    type: {
      defaultValue: CheckboxType.Checkbox,
      control: { type: 'inline-radio', options: CheckboxType },
    },
  },
  args: {
    // story helpers
    label: 'Option',
    checked: false,
    disabled: false,
  },
};

setupStorybook(ClrCheckboxModule, defaultStory, defaultParameters, generateVariants());

function generateVariants() {
  const variants: Parameters[] = [];

  for (const type of [CheckboxType.Checkbox, CheckboxType.Toggle]) {
    for (const disabled of [false, true]) {
      for (const checked of [false, true]) {
        variants.push({
          type,
          disabled,
          checked,
        });
      }
    }
  }

  return variants;
}

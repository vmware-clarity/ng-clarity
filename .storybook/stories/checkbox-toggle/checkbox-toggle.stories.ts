/*
 * Copyright (c) 2016-2022 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrCheckboxContainer, ClrCheckboxModule } from '@clr/angular';
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
      <${containerSelector} [clrInline]="clrInline">
        <${wrapperSelector} *ngFor="let _ of createArray(optionCount); let i = index">
          <input type="checkbox" ${directive} [ngModel]="checked" [disabled]="disabled" />
          <label>{{label}} {{i + 1}}</label>
        </${wrapperSelector}>
      </${containerSelector}>
    `,
    props: { ...args },
  };
};

const defaultParameters: Parameters = {
  title: 'Checkbox or Toggle/Checkbox or Toggle',
  component: ClrCheckboxContainer,
  argTypes: {
    // inputs
    clrInline: { defaultValue: false, control: { type: 'boolean' } },
    // methods
    addGrid: { control: { disable: true }, table: { disable: true } },
    controlClass: { control: { disable: true }, table: { disable: true } },
    // story helpers
    type: {
      defaultValue: CheckboxType.Checkbox,
      control: { type: 'inline-radio', options: CheckboxType },
    },
    createArray: { control: { disable: true }, table: { disable: true } },
    optionCount: { control: { type: 'number', min: 1, max: 100 } },
  },
  args: {
    // story helpers
    createArray: n => new Array(n),
    optionCount: 4,
    label: 'Option',
    checked: false,
    disabled: false,
  },
};

setupStorybook(ClrCheckboxModule, defaultStory, defaultParameters, generateVariants());

function generateVariants() {
  const variants: Parameters[] = [];

  for (const type of [CheckboxType.Checkbox, CheckboxType.Toggle]) {
    for (const clrInline of [false, true]) {
      for (const disabled of [false, true]) {
        for (const checked of [false, true]) {
          variants.push({
            clrInline,
            type,
            disabled,
            checked,
          });
        }
      }
    }
  }

  return variants;
}

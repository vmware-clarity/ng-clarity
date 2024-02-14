/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrButton, ClrButtonGroupModule } from '@clr/angular';
import { action } from '@storybook/addon-actions';
import { Parameters } from '@storybook/addons';
import { Story } from '@storybook/angular';

import { setupStorybook } from '../../helpers/setup-storybook.helpers';

const buttonTypes = ['primary', 'success', 'warning', 'danger', 'neutral'];
const buttonStyles = ['outline', 'solid', 'flat'];

const defaultStory: Story = args => ({
  template: `
    <clr-button-group>
      <clr-button
        class="btn ${
          args.buttonStyle === 'flat'
            ? `btn-link-${args.buttonType}`
            : args.buttonStyle === 'solid'
            ? `btn-${args.buttonType}`
            : `btn-${args.buttonType}-outline`
        }"
        [clrInMenu]="clrInMenu"
        [disabled]="disabled"
        (click)="click($event)"
      >
        <cds-icon *ngIf="iconShape" shape="{{iconShape}}"></cds-icon>
        {{content}}
      </clr-button>
    </clr-button-group>
  `,
  props: { ...args },
});

const defaultParameters: Parameters = {
  title: 'Button/Button',
  component: ClrButton,
  argTypes: {
    // inputs
    class: { control: { disable: true } },
    clrInMenu: { defaultValue: false },
    disabled: { defaultValue: false, control: { type: 'boolean' } },
    // outputs
    click: { control: { disable: true } },
    // methods
    emitClick: { control: { disable: true }, table: { disable: true } },
    loadingStateChange: { control: { disable: true }, table: { disable: true } },
    buttonStyle: {
      defaultValue: 'outline',
      control: { type: 'radio', options: buttonStyles },
    },
    buttonType: {
      defaultValue: 'primary',
      control: { type: 'radio', options: buttonTypes },
    },
  },
  args: {
    // outputs
    click: action('click'),
    // story helpers
    iconShape: '',
    content: 'Hello World!',
  },
};

setupStorybook(ClrButtonGroupModule, defaultStory, defaultParameters, generateVariants());

function generateVariants() {
  const variants: Parameters[] = [];

  for (const buttonType of buttonTypes) {
    for (const buttonStyle of buttonStyles) {
      for (const disabled of [false, true]) {
        for (const iconShape of [null, 'home']) {
          variants.push({
            buttonType,
            buttonStyle,
            disabled,
            iconShape,
          });
        }
      }
    }
  }

  return variants;
}

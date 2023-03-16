/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CLR_MENU_POSITIONS, ClrButtonGroup, ClrButtonGroupModule, ClrCommonStringsService } from '@clr/angular';
import { Parameters } from '@storybook/addons';
import { Story } from '@storybook/angular';

import { setupStorybook } from '../../helpers/setup-storybook.helpers';

const defaultStory: Story = args => ({
  template: `
    <div style="margin-top: 200px; text-align: center;">
      <clr-button-group [clrMenuPosition]="clrMenuPosition" [clrToggleButtonAriaLabel]="clrToggleButtonAriaLabel">
        <clr-button
          *ngFor="let _ of createArray(buttonCount); let i = index"
          [clrInMenu]="false"
        >
          {{content}} {{i + 1}}
        </clr-button>
        <clr-button
          *ngFor="let _ of createArray(inMenuButtonCount); let i = index"
          [clrInMenu]="true"
        >
          {{content}} {{buttonCount + i + 1}}
        </clr-button>
      </clr-button-group>
    </div>
  `,
  props: { ...args },
});

const commonStringsService = new ClrCommonStringsService();

const defaultParameters: Parameters = {
  title: 'Button/Button Group',
  component: ClrButtonGroup,
  argTypes: {
    // inputs
    clrMenuPosition: { defaultValue: 'bottom-left', control: { type: 'radio', options: CLR_MENU_POSITIONS } },
    // methods
    getMoveIndex: { control: { disable: true }, table: { disable: true } },
    initializeButtons: { control: { disable: true }, table: { disable: true } },
    rearrangeButton: { control: { disable: true }, table: { disable: true } },
    // story helpers
    inMenuIndices: { control: { disable: true }, table: { disable: true } },
    createArray: { control: { disable: true }, table: { disable: true } },
    buttonCount: { control: { type: 'number', min: 1, max: 100 } },
    inMenuButtonCount: { control: { type: 'number', min: 1, max: 100 } },
    // aria
    clrToggleButtonAriaLabel: { defaultValue: commonStringsService.keys.rowActions },
  },
  args: {
    // story helpers
    inMenuIndices: [true, false, false, true],
    createArray: n => new Array(n),
    content: 'Hello World!',
    buttonCount: 3,
    inMenuButtonCount: 3,
  },
};

const variants: Parameters[] = [];

setupStorybook(ClrButtonGroupModule, defaultStory, defaultParameters, variants);

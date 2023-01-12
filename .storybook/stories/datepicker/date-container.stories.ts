/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CLR_MENU_POSITIONS, ClrDateContainer, ClrDatepickerModule } from '@clr/angular';
import { Parameters } from '@storybook/addons';
import { Story } from '@storybook/angular';

import { setupStorybook } from '../../helpers/setup-storybook.helpers';

const defaultStory: Story = args => ({
  template: `
    <div style="margin-top: 300px; text-align: center;">
      <clr-date-container style="display: inline-block;" [clrPosition]="clrPosition">
        <label>Date</label>
        <input type="date" clrDate>
      </clr-date-container>
    </div>
  `,
  props: { ...args },
});

const defaultParameters: Parameters = {
  title: 'Datepicker/DateContainer',
  component: ClrDateContainer,
  argTypes: {
    // inputs
    clrPosition: { defaultValue: 'bottom-left', control: { type: 'radio', options: CLR_MENU_POSITIONS } },
    // methods
    addGrid: { control: { disable: true }, table: { disable: true } },
    controlClass: { control: { disable: true }, table: { disable: true } },
  },
};

const variants: Parameters[] = [];

setupStorybook(ClrDatepickerModule, defaultStory, defaultParameters, variants);

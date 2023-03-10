/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Parameters } from '@storybook/addons';
import { Story } from '@storybook/angular';

import { ClrTooltipContent, ClrTooltipModule } from '../../../projects/angular/src';
import { setupStorybook } from '../../helpers/setup-storybook.helpers';

const defaultStory: Story = args => ({
  template: `
    <div style="margin-top: 200px; text-align: center;">
      <clr-tooltip>
        <cds-icon clrTooltipTrigger shape="info-circle" size="24"></cds-icon>
        <clr-tooltip-content [clrPosition]="clrPosition" [clrSize]="clrSize">{{content}}</clr-tooltip-content>
      </clr-tooltip>
    </div>
  `,
  props: { ...args },
});

const tooltipPositions = ['bottom-left', 'bottom-right', 'top-left', 'top-right', 'right', 'left'];
const tooltipSizes = ['xs', 'sm', 'md', 'lg'];

const defaultParameters: Parameters = {
  title: 'Tooltip/Tooltip',
  component: ClrTooltipContent,
  argTypes: {
    // inputs
    clrPosition: { defaultValue: 'right', control: { type: 'inline-radio', options: tooltipPositions } },
    clrSize: { defaultValue: 'sm', control: { type: 'inline-radio', options: tooltipSizes } },
    // methods
    anchor: { control: { disable: true }, table: { disable: true } },
    release: { control: { disable: true }, table: { disable: true } },
  },
  args: {
    // story helpers
    content: 'This is the tooltip content.',
  },
};

const variants: Parameters[] = [];

setupStorybook(ClrTooltipModule, defaultStory, defaultParameters, variants);

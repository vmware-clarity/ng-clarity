/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrTooltipContent, ClrTooltipModule } from '@clr/angular';
import { type Meta, moduleMetadata, type StoryObj } from '@storybook/angular';
import { hideControls } from '@storybook-helpers/arg-types';

const tooltipPositions = ['bottom-left', 'bottom-right', 'top-left', 'top-right', 'right', 'left'];
const tooltipSizes = ['xs', 'sm', 'md', 'lg'];

/**
 * `ClrTooltipContent` aliases its inputs, so the component class cannot be the args type; the args are the
 * `clr*` names the template binds plus the story-only `content` string.
 */
type TooltipArgs = {
  clrPosition: string;
  clrSize: string;
  content: string;
};

const meta: Meta<TooltipArgs> = {
  title: 'Tooltip/Tooltip',
  decorators: [
    moduleMetadata({
      imports: [ClrTooltipModule],
    }),
  ],
  component: ClrTooltipContent,
  argTypes: {
    // inputs
    clrPosition: { control: { type: 'inline-radio' }, options: tooltipPositions },
    clrSize: { control: { type: 'inline-radio' }, options: tooltipSizes },
    // methods
    ...hideControls('anchor', 'release'),
  },
  args: {
    // inputs
    clrPosition: 'right',
    clrSize: 'sm',
    // story helpers
    content: 'This is the tooltip content.',
  },
  render: args => ({
    template: `
      <div style="margin-top: 200px; text-align: center">
        <clr-tooltip>
          <cds-icon clrTooltipTrigger shape="info-circle" size="24"></cds-icon>
          <clr-tooltip-content [clrPosition]="clrPosition" [clrSize]="clrSize">{{ content }}</clr-tooltip-content>
        </clr-tooltip>
      </div>
    `,
    props: args,
  }),
};

export default meta;

type Story = StoryObj<TooltipArgs>;

export const Tooltip: Story = {};

/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrSignpostContent, ClrSignpostModule } from '@clr/angular';
import { Parameters } from '@storybook/addons';
import { Story } from '@storybook/angular';

import { setupStorybook } from '../../helpers/setup-storybook.helpers';

const positions: string[] = [
  'top-left',
  'top-middle',
  'top-right',
  'right-top',
  'right-middle',
  'right-bottom',
  'bottom-right',
  'bottom-middle',
  'bottom-left',
  'left-bottom',
  'left-middle',
  'left-top',
];

const defaultStory: Story = args => ({
  template: ` 
    <div style="margin-top: 100px; text-align: center;">
      <clr-signpost>
        <clr-signpost-content [clrPosition]="clrPosition">
          {{content}}
        </clr-signpost-content>
      </clr-signpost>
    </div>
  `,
  props: { ...args },
});

const defaultParameters: Parameters = {
  title: 'Signpost/Signpost',
  component: ClrSignpostContent,
  argTypes: {
    // inputs
    clrPosition: { defaultValue: 'right-middle', control: { type: 'radio', options: positions } },
    // methods
    close: { control: { disable: true }, table: { disable: true } },
    anchor: { control: { disable: true }, table: { disable: true } },
    release: { control: { disable: true }, table: { disable: true } },
  },
  args: {
    // story helpers
    content: 'Hello World!',
  },
};

const variants: Parameters[] = [];

setupStorybook(ClrSignpostModule, defaultStory, defaultParameters, variants);

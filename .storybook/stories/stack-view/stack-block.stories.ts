/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { action } from '@storybook/addon-actions';
import { Parameters } from '@storybook/addons';
import { Story } from '@storybook/angular';

import { ClrStackBlock, ClrStackViewModule } from '../../../projects/angular/src';
import { setupStorybook } from '../../helpers/setup-storybook.helpers';

const defaultStory: Story = args => ({
  template: `
    <clr-stack-view>
      <clr-stack-block
        ${args.clrSbExpandable === undefined ? '' : '[clrSbExpandable]="clrSbExpandable"'}
        [clrSbExpanded]="clrSbExpanded"
        [clrStackViewLevel]="clrStackViewLevel"
        (clrSbExpandedChange)="clrSbExpandedChange($event)"
      >
        <clr-stack-label>{{ label }}</clr-stack-label>
        <clr-stack-content>{{ content }}</clr-stack-content>
        <clr-stack-block>
          <clr-stack-label>{{ subLabel }}</clr-stack-label>
          <clr-stack-content>{{ subContent }}</clr-stack-content>
        </clr-stack-block>
      </clr-stack-block>
    </clr-stack-view>
  `,
  props: { ...args },
});

const defaultParameters: Parameters = {
  title: 'Stack View/Stack Block',
  component: ClrStackBlock,
  argTypes: {
    // outputs
    clrSbExpandedChange: { control: { disable: true }, table: { disable: true } },
    // methods
    addChild: { control: { disable: true }, table: { disable: true } },
    getStackChildrenId: { control: { disable: true }, table: { disable: true } },
    toggleExpand: { control: { disable: true }, table: { disable: true } },
  },
  args: {
    // inputs
    clrSbExpandable: undefined,
    // outputs
    clrSbExpandedChange: action('clrSbExpandedChange'),
    // story helpers
    label: 'Block',
    content: 'Block content',
    subLabel: 'Sub-block',
    subContent: 'Sub-block content',
  },
};

const variants: Parameters[] = [{ clrSbExpandable: false }, { clrSbExpanded: false }, { clrSbExpanded: true }];

setupStorybook(ClrStackViewModule, defaultStory, defaultParameters, variants);

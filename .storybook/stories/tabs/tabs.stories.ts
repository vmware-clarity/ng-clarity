/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrTabs, ClrTabsModule } from '@clr/angular';
import { Parameters } from '@storybook/addons';
import { Story } from '@storybook/angular';

import { TabsLayout } from '../../../projects/angular/src/layout/tabs/enums/tabs-layout.enum';
import { setupStorybook } from '../../helpers/setup-storybook.helpers';

const defaultStory: Story = args => ({
  template: `
    <clr-tabs [clrLayout]="clrLayout">
      <clr-tab *ngFor="let _ of createArray(tabCount); let i = index">
        <button clrTabLink>{{title}} {{i + 1}}</button>
        <clr-tab-content *clrIfActive="activeTab === (i + 1)">
          <p>
            {{content}} {{i + 1}}
          </p>
        </clr-tab-content>
      </clr-tab>
    </clr-tabs>
  `,
  props: { ...args },
});

const defaultParameters: Parameters = {
  title: 'Tabs/Tabs',
  component: ClrTabs,
  argTypes: {
    // inputs
    clrLayout: { defaultValue: TabsLayout.HORIZONTAL, control: { type: 'inline-radio', options: TabsLayout } },
    // methods
    closeOnEscapeKey: { control: { disable: true }, table: { disable: true } },
    closeOnFocusOut: { control: { disable: true }, table: { disable: true } },
    closeOnOutsideClick: { control: { disable: true }, table: { disable: true } },
    openOverflowOnFocus: { control: { disable: true }, table: { disable: true } },
    resetKeyFocusCurrentToActive: { control: { disable: true }, table: { disable: true } },
    toggleOverflowOnClick: { control: { disable: true }, table: { disable: true } },
    toggleOverflowOnPosition: { control: { disable: true }, table: { disable: true } },
    // story helpers
    createArray: { control: { disable: true }, table: { disable: true } },
    tabCount: { control: { type: 'number', min: 1, max: 100 } },
    activeTab: { control: { type: 'number', min: 1, max: 100 } },
  },
  args: {
    // story helpers
    createArray: n => new Array(n),
    tabCount: 4,
    activeTab: 1,
    title: 'Tab',
    content: 'Tab Content',
  },
};

setupStorybook(ClrTabsModule, defaultStory, defaultParameters, generateVariants());

function generateVariants() {
  const variants: Parameters[] = [];

  for (const clrLayout of [TabsLayout.HORIZONTAL, TabsLayout.VERTICAL]) {
    for (const activeTab of [1, 2, 3, 4]) {
      variants.push({
        clrLayout,
        activeTab,
        tabCount: 4,
      });
    }
  }

  return variants;
}

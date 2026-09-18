/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrIcon, ClrTabs, ClrTabsModule } from '@clr/angular';
import { type Meta, moduleMetadata, type StoryObj } from '@storybook/angular';
import { hideControls } from '@storybook-helpers/arg-types';

import { TabsLayout } from '../../../projects/angular/layout/tabs/enums/tabs-layout.enum';

/**
 * `ClrTabs` aliases its input (`@Input('clrLayout')`), so the component class cannot be the args type; the
 * args are the names the template binds. `createArray` and `clickTabAction` stay args because the template
 * calls them through `props`.
 */
type TabsActionsArgs = {
  clrLayout: TabsLayout;
  tabsActionsPosition: 'left' | 'right';
  createArray: (n: number) => unknown[];
  clickTabAction: () => void;
  tabCount: number;
  activeTab: number;
  title: string;
  content: string;
};

const meta: Meta<TabsActionsArgs> = {
  title: 'Tabs/Tabs Actions',
  decorators: [
    moduleMetadata({
      imports: [ClrTabsModule, ClrIcon],
    }),
  ],
  component: ClrTabs,
  argTypes: {
    // inputs
    clrLayout: { control: { type: 'inline-radio' }, options: Object.values(TabsLayout) },
    tabsActionsPosition: { control: { type: 'inline-radio' }, options: ['left', 'right'] },
    // methods
    ...hideControls(
      'closeOnEscapeKey',
      'closeOnFocusOut',
      'closeOnOutsideClick',
      'openOverflowOnFocus',
      'resetKeyFocusCurrentToActive',
      'toggleOverflowOnClick',
      'toggleOverflowOnPosition'
    ),
    // story helpers
    ...hideControls('createArray', 'clickTabAction'),
    tabCount: { control: { type: 'number', min: 1, max: 100 } },
    activeTab: { control: { type: 'number', min: 1, max: 100 } },
  },
  args: {
    // inputs
    clrLayout: TabsLayout.HORIZONTAL,
    tabsActionsPosition: 'right',
    // story helpers
    createArray: n => new Array(n),
    clickTabAction: () => alert('Tab action clicked!'),
    tabCount: 4,
    activeTab: 1,
    title: 'Tab',
    content: 'Tab Content',
  },
  render: args => ({
    template: `
      <clr-tabs [clrLayout]="clrLayout">
        <clr-tabs-actions [position]="tabsActionsPosition">
          <button class="btn btn-icon btn-link" (click)="clickTabAction()" clrTabAction>
            <cds-icon shape="plus"></cds-icon>
            Tab Action
          </button>
        </clr-tabs-actions>
        @for (_ of createArray(tabCount); track $index; let i = $index) {
          <clr-tab>
            <button clrTabLink>{{ title }} {{ i + 1 }}</button>
            <clr-tab-content *clrIfActive="activeTab === i + 1">
              <p>{{ content }} {{ i + 1 }}</p>
            </clr-tab-content>
          </clr-tab>
        }
      </clr-tabs>
    `,
    props: { ...args },
  }),
};

export default meta;

type Story = StoryObj<TabsActionsArgs>;

export const Tabs: Story = {};

export const VerticalTabs: Story = {
  args: {
    tabsActionsPosition: 'left',
    clrLayout: TabsLayout.VERTICAL,
  },
};

export const TabsResponsive: Story = {
  globals: {
    viewport: {
      value: 'large',
      isRotated: false,
    },
  },
};

export const TabsActionsLeft: Story = {
  args: {
    tabsActionsPosition: 'left',
  },
};

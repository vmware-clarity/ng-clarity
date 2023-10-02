/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ClrTabsModule } from '@clr/angular';
import { Parameters } from '@storybook/addons';
import { moduleMetadata, storiesOf, Story } from '@storybook/angular';

const params: Parameters = {
  title: 'Test/Tabs2',
  // component: ClrTabs,
  argTypes: {
    // inputs
    // clrLayout: { defaultValue: TabsLayout.HORIZONTAL, control: { type: 'inline-radio', options: TabsLayout } },
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
    tabCount: { control: { type: 'number', min: 1, max: 100, disable: true }, table: { disable: true } },
    title: { control: { type: 'text', disable: true }, table: { disable: true } },
    content: { control: { type: 'text', disable: true }, table: { disable: true } },
    activeTab: { control: { type: 'number', min: 1, max: 100, disable: true }, table: { disable: true } },
  },
  args: {
    // story helpers
    createArray: n => new Array(n),
    tabCount: 2,
    activeTab: 1,
    title: 'Tab TITLE',
    content: 'TContent',
  },
  viewport: {
    // disable: true,
    defaultViewport: 'Tablet',
  },
};

const storyApi = storiesOf(params.title, module)
  .addParameters(params)
  .addDecorator(
    moduleMetadata({
      imports: [
        CommonModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        ...(Array.isArray(ClrTabsModule) ? ClrTabsModule : [ClrTabsModule]),
      ],
    })
  );

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const story: Story = args => ({
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
  props: { createArray: n => new Array(n) },
});

storyApi.add('Test story', story, params);

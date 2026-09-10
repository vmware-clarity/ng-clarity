/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrCard, ClrCardBody, ClrCardBodyText, ClrCardBodyTitle, ClrCardFooter, ClrCardModule } from '@clr/angular';
import { moduleMetadata, StoryObj } from '@storybook/angular';

import { CommonModules } from '../../helpers/common';

export default {
  title: 'Card/Angular Card',
  component: ClrCard,
  subcomponents: { ClrCardBody, ClrCardBodyTitle, ClrCardBodyText, ClrCardFooter },
  decorators: [
    moduleMetadata({
      imports: [...CommonModules, ClrCardModule],
    }),
  ],
  args: {
    clrCardCollapsible: false,
    clrCardCollapsed: false,
    clrCardFooterCollapsible: true,
    headerText: 'Header',
    bodyTitle: 'Title',
    bodyText: 'Hello World!',
    showFooter: true,
  },
  render: (args: Record<string, unknown>) => ({
    props: { ...args },
    template: `
      <clr-card
        [clrCardCollapsible]="clrCardCollapsible"
        [clrCardFooterCollapsible]="clrCardFooterCollapsible"
        [clrCardCollapsed]="clrCardCollapsed"
      >
        <clr-card-header>{{ headerText }}</clr-card-header>
        <clr-card-body>
          <clr-card-body-title>{{ bodyTitle }}</clr-card-body-title>
          <clr-card-body-text>{{ bodyText }}</clr-card-body-text>
        </clr-card-body>
        @if (showFooter) {
          <clr-card-footer>
            <button class="btn btn-sm btn-link">Action</button>
          </clr-card-footer>
        }
      </clr-card>
    `,
  }),
};

export const Default: StoryObj = {};

export const Collapsible: StoryObj = {
  args: {
    clrCardCollapsible: true,
  },
};

export const Collapsed: StoryObj = {
  args: {
    clrCardCollapsible: true,
    clrCardCollapsed: true,
  },
};

export const CollapsedWithFixedFooter: StoryObj = {
  args: {
    clrCardCollapsible: true,
    clrCardCollapsed: true,
    clrCardFooterCollapsible: false,
  },
};

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrCard, ClrCardBody, ClrCardBodyText, ClrCardBodyTitle, ClrCardFooter, ClrCardModule } from '@clr/angular';
import { type Meta, moduleMetadata, type StoryObj } from '@storybook/angular';
import { CommonModules } from '@storybook-helpers/common';

/**
 * `ClrCard` cannot be the args base: it aliases every input
 * (`@Input({ alias: 'clrCardExpanded' }) get expanded()`), so the `clrCard*` names the template binds are
 * not properties of the class. The remaining args are story-only content props.
 */
type CardAngularArgs = {
  clrCardCollapsible: boolean;
  clrCardExpanded: boolean;
  clrCardFooterCollapsible: boolean;
  headerText: string;
  bodyTitle: string;
  bodyText: string;
  showFooter: boolean;
};

const meta: Meta<CardAngularArgs> = {
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
    clrCardExpanded: true,
    clrCardFooterCollapsible: true,
    headerText: 'Header',
    bodyTitle: 'Title',
    bodyText: 'Hello World!',
    showFooter: true,
  },
  render: args => ({
    props: { ...args },
    template: `
      <clr-card
        [clrCardCollapsible]="clrCardCollapsible"
        [clrCardFooterCollapsible]="clrCardFooterCollapsible"
        [clrCardExpanded]="clrCardExpanded"
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

export default meta;

type Story = StoryObj<CardAngularArgs>;

export const Default: Story = {};

export const Collapsible: Story = {
  args: {
    clrCardCollapsible: true,
  },
};

export const Collapsed: Story = {
  args: {
    clrCardCollapsible: true,
    clrCardExpanded: false,
  },
};

export const CollapsedWithFixedFooter: Story = {
  args: {
    clrCardCollapsible: true,
    clrCardExpanded: false,
    clrCardFooterCollapsible: false,
  },
};

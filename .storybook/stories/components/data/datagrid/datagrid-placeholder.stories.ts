/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrConditionalModule, ClrDatagridModule, ClrDatagridPlaceholder } from '@clr/angular';
import { type Meta, moduleMetadata, type StoryObj } from '@storybook/angular';
import { hideControls } from '@storybook-helpers/arg-types';
import { withStyles } from '@storybook-helpers/decorators';
import { type Element, elements } from '@storybook-helpers/elements.data';
import { HIGHLIGHT_STYLES, highlightArgs, highlightArgTypes } from '@storybook-helpers/highlight';

/**
 * The args drive a bare template, not an instance of `ClrDatagridPlaceholder`, and Clarity aliases its
 * inputs, so the component class is not the args type here -- the args are the story's own knobs.
 */
type PlaceholderArgs = {
  elements: Element[];
  highlight: boolean;
  compact: boolean;
  hidableColumns: boolean;
  height: number;
  content: string;
};

const meta: Meta<PlaceholderArgs> = {
  title: 'Components/Data/Datagrid/Placeholder',
  component: ClrDatagridPlaceholder,
  decorators: [
    moduleMetadata({
      imports: [ClrDatagridModule, ClrConditionalModule],
    }),
    withStyles(HIGHLIGHT_STYLES),
  ],
  argTypes: {
    // story helpers
    ...hideControls('elements'),
    ...highlightArgTypes,
  },
  args: {
    // story helpers
    elements,
    ...highlightArgs,
    compact: false,
    hidableColumns: false,
    height: 0,
    content: "We couldn't find any elements!",
  },
  render: args => ({
    template: `
      <clr-datagrid ${args.height ? '[style.height.px]="height"' : ''} [ngClass]="{ 'datagrid-compact': compact }">
        <clr-dg-column [style.width.px]="250">
          <ng-container ${args.hidableColumns ? '*clrDgHideableColumn' : ''}>Name</ng-container>
        </clr-dg-column>
        <clr-dg-column [style.width.px]="250">
          <ng-container ${args.hidableColumns ? '*clrDgHideableColumn' : ''}>Symbol</ng-container>
        </clr-dg-column>
        <clr-dg-column [style.width.px]="250">
          <ng-container ${args.hidableColumns ? '*clrDgHideableColumn' : ''}>Number</ng-container>
        </clr-dg-column>
        <clr-dg-column>
          <ng-container ${args.hidableColumns ? '*clrDgHideableColumn' : ''}>Electronegativity</ng-container>
        </clr-dg-column>

        <clr-dg-placeholder [ngClass]="{ highlight }">{{ content }}</clr-dg-placeholder>

        <clr-dg-footer>
          <clr-dg-pagination #pagination>
            <clr-dg-page-size [clrPageSizeOptions]="[10, 20, 50, 100]">Elements per page</clr-dg-page-size>
            {{ pagination.firstItem + 1 }} - {{ pagination.lastItem + 1 }} of {{ pagination.totalItems }} elements
          </clr-dg-pagination>
        </clr-dg-footer>
      </clr-datagrid>
    `,
    props: { ...args },
  }),
};

export default meta;

type Story = StoryObj<PlaceholderArgs>;

export const Placeholder: Story = {};

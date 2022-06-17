/*
 * Copyright (c) 2016-2022 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrConditionalModule, ClrDatagridModule, ClrDatagridPlaceholder } from '@clr/angular';
import { Parameters } from '@storybook/addons';
import { Story } from '@storybook/angular';

import { elements } from '../../helpers/elements.data';
import { setupStorybook } from '../../helpers/setup-storybook.helpers';

const defaultStory: Story = args => ({
  template: `
    <style>.highlight { border: 1px solid red !important; } .electronegativity-container { border-bottom: 4px solid #119cd4; }</style>
    <clr-datagrid
      ${args.height ? '[style.height.px]="height"' : ''}
      [ngClass]="{ 'datagrid-compact': compact }"
    >
      <clr-dg-column>
        <ng-container ${args.hidableColumns ? '*clrDgHideableColumn' : ''}>Name</ng-container>
      </clr-dg-column>
      <clr-dg-column>
        <ng-container ${args.hidableColumns ? '*clrDgHideableColumn' : ''}>Symbol</ng-container>
      </clr-dg-column>
      <clr-dg-column>
        <ng-container ${args.hidableColumns ? '*clrDgHideableColumn' : ''}>Number</ng-container>
      </clr-dg-column>
      <clr-dg-column>
        <ng-container ${args.hidableColumns ? '*clrDgHideableColumn' : ''}>Electronegativity</ng-container>
      </clr-dg-column>

      <clr-dg-placeholder [ngClass]="{ highlight }">{{ content }}</clr-dg-placeholder>
      
      <clr-dg-footer>
        <clr-dg-pagination #pagination>
          <clr-dg-page-size [clrPageSizeOptions]="[10,20,50,100]">Elements per page</clr-dg-page-size>
          {{pagination.firstItem + 1}} - {{pagination.lastItem + 1}} of {{pagination.totalItems}} elements
        </clr-dg-pagination>
      </clr-dg-footer>
    </clr-datagrid>
  `,
  props: { ...args },
});

const defaultParameters: Parameters = {
  title: 'Datagrid/Placeholder',
  component: ClrDatagridPlaceholder,
  argTypes: {
    // story helpers
    elements: { control: { disable: true }, table: { disable: true } },
  },
  args: {
    // story helpers
    elements,
    highlight: true,
    compact: false,
    hidableColumns: false,
    height: 0,
    content: "We couldn't find any elements!",
  },
};

const variants: Parameters[] = [];

setupStorybook([ClrDatagridModule, ClrConditionalModule], defaultStory, defaultParameters, variants);

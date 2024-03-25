/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrDatagridModule, ClrModalModule } from '@clr/angular';
import { moduleMetadata, Story, StoryObj } from '@storybook/angular';
import { elements } from 'helpers/elements.data';

export default {
  title: 'Datagrid/Nested Detail In Detail',
  decorators: [
    moduleMetadata({
      imports: [ClrDatagridModule, ClrModalModule],
    }),
  ],
  argTypes: {
    // story helpers
    elements: { control: { disable: true }, table: { disable: true } },
  },
  args: {
    // story helpers
    elements,
  },
};

const NestedDetailInDetailTemplate: Story = args => ({
  template: `
    <div><strong>This story is NOT an endorsement of this UX pattern.</strong></div>

    <clr-datagrid>
      <clr-dg-column [style.width.px]="250">Name</clr-dg-column>
      <clr-dg-column [style.width.px]="250">Symbol</clr-dg-column>
      <clr-dg-column [style.width.px]="250">Number</clr-dg-column>
      <clr-dg-column>Electronegativity</clr-dg-column>

      <clr-dg-row *clrDgItems="let element of elements" [clrDgItem]="element">
        <clr-dg-cell>{{element.name}}</clr-dg-cell>
        <clr-dg-cell>{{element.symbol}}</clr-dg-cell>
        <clr-dg-cell>{{element.number}}</clr-dg-cell>
        <clr-dg-cell>
          <div [style.width.%]="element.electronegativity * 100 / 4" class="electronegativity-container">
            {{element.electronegativity}}
          </div>
        </clr-dg-cell>
      </clr-dg-row>

      <clr-dg-detail *clrIfDetail="let element">
        <clr-dg-detail-header>{{element.name}}</clr-dg-detail-header>
        <clr-dg-detail-body>
          <clr-datagrid>
            <clr-dg-column>Key</clr-dg-column>
            <clr-dg-column>Value</clr-dg-column>

            <clr-dg-row clrDgItem="name">
              <clr-dg-cell>Name</clr-dg-cell>
              <clr-dg-cell>{{element.name}}</clr-dg-cell>
            </clr-dg-row>

            <clr-dg-row clrDgItem="symbol">
              <clr-dg-cell>Symbol</clr-dg-cell>
              <clr-dg-cell>{{element.symbol}}</clr-dg-cell>
            </clr-dg-row>

            <clr-dg-row clrDgItem="number">
              <clr-dg-cell>Number</clr-dg-cell>
              <clr-dg-cell>{{element.number}}</clr-dg-cell>
            </clr-dg-row>

            <clr-dg-row clrDgItem="electronegativity">
              <clr-dg-cell>Electronegativity</clr-dg-cell>
              <clr-dg-cell>{{element.electronegativity}}</clr-dg-cell>
            </clr-dg-row>

            <clr-dg-detail *clrIfDetail>
              <clr-dg-detail-header>Nested Detail</clr-dg-detail-header>
              <clr-dg-detail-body>
                Pressing escape should only close this detail pane, not the parent detail pane.
              </clr-dg-detail-body>
            </clr-dg-detail>
          </clr-datagrid>
        </clr-dg-detail-body>
      </clr-dg-detail>
      
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

export const NestedDetailInDetail: StoryObj = {
  render: NestedDetailInDetailTemplate,
};

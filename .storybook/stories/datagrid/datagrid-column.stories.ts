/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  ClrConditionalModule,
  ClrDatagridColumn,
  ClrDatagridModule,
  ClrDatagridSortOrder,
  commonStringsDefault,
} from '@clr/angular';
import { action } from '@storybook/addon-actions';
import { Parameters } from '@storybook/addons';
import { Story } from '@storybook/angular';

import { elements } from '../../helpers/elements.data';
import { setupStorybook } from '../../helpers/setup-storybook.helpers';

const defaultStory: Story = args => ({
  template: `
    <style>
      .highlight { border: 1px solid red !important; }
      .electronegativity-container { border-bottom: 4px solid #119cd4; }
    </style>
    <clr-datagrid
      ${args.height ? '[style.height.px]="height"' : ''}
      ${args.multiSelectable ? '[clrDgSelected]="[]"' : ''}
      ${args.singleSelectable ? '[clrDgSingleSelected]="true"' : ''}
      [ngClass]="{ 'datagrid-compact': compact }"
    >
      <clr-dg-column
        [style.width.px]="250"
        [ngClass]="{ highlight }"
        [clrDgColType]="clrDgColType"
        clrDgField="name"
        [clrDgSortBy]="clrDgSortBy"
        [clrDgSortOrder]="ClrDatagridSortOrder[clrDgSortOrder]"
        [clrFilterNumberMaxPlaceholder]="clrFilterNumberMaxPlaceholder"
        [clrFilterNumberMinPlaceholder]="clrFilterNumberMinPlaceholder"
        [clrFilterStringPlaceholder]="clrFilterStringPlaceholder"
        [clrFilterValue]="clrFilterValue"
        (clrDgColumnResize)="clrDgColumnResize($event)"
        (clrDgSortOrderChange)="clrDgSortOrderChange($event)"
        (clrFilterValueChange)="clrFilterValueChange($event)"
      >
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

      <clr-dg-row *clrDgItems="let element of elements" [clrDgItem]="element">
        <clr-dg-cell>{{element.name}}</clr-dg-cell>
        <clr-dg-cell>{{element.symbol}}</clr-dg-cell>
        <clr-dg-cell>{{element.number}}</clr-dg-cell>
        <clr-dg-cell>
          <div [style.width.%]="element.electronegativity * 100 / 4" class="electronegativity-container">
            {{element.electronegativity}}
          </div>
        </clr-dg-cell>
        <ng-container *ngIf="expandable" ngProjectAs="clr-dg-row-detail">
          <clr-dg-row-detail *clrIfExpanded>{{element|json}}</clr-dg-row-detail>
        </ng-container>
      </clr-dg-row>
      
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
  title: 'Datagrid/Column',
  component: ClrDatagridColumn,
  argTypes: {
    // inputs
    clrDgColType: { defaultValue: 'string' },
    clrDgField: { control: { disable: true } },
    clrDgSortBy: { type: 'string' },
    clrDgSortOrder: {
      defaultValue: ClrDatagridSortOrder[ClrDatagridSortOrder.UNSORTED],
      control: {
        type: 'radio',
        options: Object.values(ClrDatagridSortOrder).filter(value => typeof value === 'string'),
      },
    },
    clrFilterNumberMaxPlaceholder: { defaultValue: commonStringsDefault.maxValue },
    clrFilterNumberMinPlaceholder: { defaultValue: commonStringsDefault.minValue },
    clrFilterStringPlaceholder: { defaultValue: commonStringsDefault.filterItems },
    clrFilterValue: { defaultValue: '', type: 'string' },
    // outputs
    clrDgColumnResize: { control: { disable: true } },
    clrDgSortOrderChange: { control: { disable: true } },
    clrFilterValueChange: { control: { disable: true } },
    // methods
    sort: { control: { disable: true } },
    // story helpers
    elements: { control: { disable: true }, table: { disable: true } },
    ClrDatagridSortOrder: { control: { disable: true }, table: { disable: true } },
  },
  args: {
    // outputs
    clrDgColumnResize: action('clrDgColumnResize'),
    clrDgSortOrderChange: action('clrDgSortOrderChange'),
    clrFilterValueChange: action('clrFilterValueChange'),
    // story helpers
    elements,
    highlight: true,
    singleSelectable: false,
    multiSelectable: false,
    expandable: false,
    compact: false,
    hidableColumns: false,
    height: 0,
    ClrDatagridSortOrder: ClrDatagridSortOrder,
  },
};

const variants: Parameters[] = [];

setupStorybook([ClrDatagridModule, ClrConditionalModule], defaultStory, defaultParameters, variants);

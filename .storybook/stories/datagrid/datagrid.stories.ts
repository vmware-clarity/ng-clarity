/*
 * Copyright (c) 2016-2022 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrCommonStringsService, ClrConditionalModule, ClrDatagrid, ClrDatagridModule } from '@clr/angular';
import { action } from '@storybook/addon-actions';
import { Parameters } from '@storybook/addons';
import { Story } from '@storybook/angular';

import { elements } from '../../helpers/elements.data';
import { setupStorybook } from '../../helpers/setup-storybook.helpers';

const defaultStory: Story = args => ({
  template: `
    <style>
      .electronegativity-container { border-bottom: 4px solid #119cd4; }
    </style>
    <clr-datagrid
      ${args.height ? '[style.height.px]="height"' : ''}
      ${args.multiSelectable ? '[clrDgSelected]="[]"' : ''}
      ${args.singleSelectable ? '[clrDgSingleSelected]="true"' : ''}
      ${args.clrDgCtrlClickRowSelection ? 'clrDgCtrlClickRowSelection' : ''}
      [ngClass]="{ 'datagrid-compact': compact }"
      [clrDetailExpandableAriaLabel]="clrDetailExpandableAriaLabel"
      [clrDgDisablePageFocus]="clrDgDisablePageFocus"
      [clrDgLoading]="clrDgLoading"
      [clrDgPreserveSelection]="clrDgPreserveSelection"
      [clrDgRowSelection]="clrDgRowSelection"
      [clrDgSingleActionableAriaLabel]="clrDgSingleActionableAriaLabel"
      [clrDgSingleSelectionAriaLabel]="clrDgSingleSelectionAriaLabel"
      (clrDgRefresh)="clrDgRefresh($event)"
      (clrDgSingleSelectedChange)="clrDgSingleSelectedChange($event)"
      (clrDgRefresh)="clrDgRefresh($event)"
    >
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

const commonStringsService = new ClrCommonStringsService();

const defaultParameters: Parameters = {
  title: 'Datagrid/Datagrid',
  component: ClrDatagrid,
  argTypes: {
    // inputs
    clrDetailExpandableAriaLabel: { defaultValue: commonStringsService.keys.detailExpandableAriaLabel },
    clrDgLoading: { defaultValue: false },
    clrDgPreserveSelection: { defaultValue: false },
    clrDgRowSelection: { defaultValue: false },
    clrDgSelected: { control: { disable: true } },
    clrDgSingleActionableAriaLabel: { defaultValue: commonStringsService.keys.singleActionableAriaLabel },
    clrDgSingleSelected: { control: { disable: true } },
    clrDgSingleSelectionAriaLabel: { defaultValue: commonStringsService.keys.singleSelectionAriaLabel },
    // outputs
    clrDgRefresh: { control: { disable: true } },
    clrDgSelectedChange: { control: { disable: true } },
    clrDgSingleSelectedChange: { control: { disable: true } },
    // methods
    dataChanged: { control: { disable: true } },
    resize: { control: { disable: true } },
    // story helpers
    elements: { control: { disable: true }, table: { disable: true } },
    clrDgCtrlClickRowSelection: { defaultValue: false, control: { type: 'boolean' } }, // adds a directive
  },
  args: {
    // outputs
    clrDgRefresh: action('clrDgRefresh'),
    clrDgSelectedChange: action('clrDgSelectedChange'),
    clrDgSingleSelectedChange: action('clrDgSingleSelectedChange'),
    // story helpers
    elements,
    singleSelectable: false,
    multiSelectable: false,
    expandable: false,
    compact: false,
    hidableColumns: false,
    height: 0,
  },
};

const variants: Parameters[] = [];

setupStorybook([ClrDatagridModule, ClrConditionalModule], defaultStory, defaultParameters, variants);

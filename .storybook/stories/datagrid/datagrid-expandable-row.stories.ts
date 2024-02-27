/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrConditionalModule, ClrDatagridModule, ClrDatagridRow } from '@clr/angular';
import { action } from '@storybook/addon-actions';
import { Parameters } from '@storybook/addons';
import { Story } from '@storybook/angular';

import { elements } from '../../helpers/elements.data';
import { setupStorybook } from '../../helpers/setup-storybook.helpers';

const defaultStory: Story = args => ({
  template: `
  <clr-datagrid
    ${args.height ? '[style.height.px]="height"' : ''}
    ${args.multiSelectable ? '[clrDgSelected]="[]"' : ''}
    ${args.singleSelectable ? '[clrDgSingleSelected]="true"' : ''}
    [ngClass]="{ 'datagrid-compact': compact }"
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

    <clr-dg-row
      *clrDgItems="let element of elements; let index = index"
      [clrDgExpanded]="clrDgExpanded && index === 0"
      [clrDgSelectable]="index !== 0 || clrDgSelectable"
      [clrDgSelected]="clrDgSelected && index === 0"
      [clrDgDetailOpenLabel]="clrDgDetailOpenLabel"
      [clrDgDetailCloseLabel]="clrDgDetailCloseLabel"
      [clrDgItem]="element"
      [ngClass]="{ highlight: highlight && index === 0 }"
      (clrDgExpandedChange)="index === 0 && clrDgExpandedChange($event)"
      (clrDgSelectedChange)="index === 0 && clrDgSelectedChange($event)"
    >
      <clr-dg-cell>
        <a
          href="javascript:void(0)"
          role="tooltip"
          aria-haspopup="true"
          class="tooltip tooltip-lg tooltip-bottom-right"
        >
          <cds-icon
            shape="exclamation-circle"
            solid
          ></cds-icon>
          <span class="tooltip-content"
            >Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin in
            neque in ante placerat mattis id sed quam. Proin rhoncus lacus et
            tempor dignissim. Vivamus sem quam, pellentesque aliquet suscipit
            eget, pellentesque sed arcu. Vivamus in dui lectus.</span
          >
        </a>
        {{ element.name }}
      </clr-dg-cell>
      <clr-dg-cell>{{element.symbol}}</clr-dg-cell>
      <clr-dg-cell>{{element.number}}</clr-dg-cell>
      <clr-dg-cell>
        <div [style.width.%]="element.electronegativity * 100 / 4" class="electronegativity-container">
          {{element.electronegativity}}
        </div>
      </clr-dg-cell>
      <clr-dg-row-detail *clrIfExpanded>
      <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin in
      neque in ante placerat mattis id sed quam. Proin rhoncus lacus et
      tempor dignissim. Vivamus sem quam, pellentesque aliquet suscipit
      eget, pellentesque sed arcu. Vivamus in dui lectus. Suspendisse
      cursus est ac nisl imperdiet viverra. Aenean sagittis nibh lacus,
      in eleifend urna ultrices et. Mauris porttitor nisi nec velit
      pharetra porttitor. Vestibulum vulputate sollicitudin dolor ut
      tincidunt. Phasellus vitae blandit felis. Nullam posuere ipsum
      tincidunt velit pellentesque rhoncus. Morbi faucibus ut ipsum at
      malesuada. Nam vestibulum felis sit amet metus finibus hendrerit.
      Fusce faucibus odio eget ex vulputate rhoncus. Fusce nec aliquam
      leo, at suscipit diam.</div>
        <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin in
      neque in ante placerat mattis id sed quam. Proin rhoncus lacus et
      tempor dignissim. Vivamus sem quam, pellentesque aliquet suscipit
      eget, pellentesque sed arcu. Vivamus in dui lectus. Suspendisse
      cursus est ac nisl imperdiet viverra. Aenean sagittis nibh lacus,
      in eleifend urna ultrices et. Mauris porttitor nisi nec velit
      pharetra porttitor. Vestibulum vulputate sollicitudin dolor ut
      tincidunt. Phasellus vitae blandit felis. Nullam posuere ipsum
      tincidunt velit pellentesque rhoncus. Morbi faucibus ut ipsum at
      malesuada. Nam vestibulum felis sit amet metus finibus hendrerit.
      Fusce faucibus odio eget ex vulputate rhoncus. Fusce nec aliquam
      leo, at suscipit diam.</div>
      </clr-dg-row-detail>
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
  title: 'Datagrid/Expandable Rows',
  component: ClrDatagridRow,
  argTypes: {
    // inputs
    clrDgDetailCloseLabel: { defaultValue: '' },
    clrDgDetailOpenLabel: { defaultValue: '' },
    clrDgExpanded: { defaultValue: false, control: { type: 'boolean' } },
    clrDgItem: { control: { disable: true } },
    clrDgSelectable: { defaultValue: true, control: { type: 'boolean' } },
    clrDgSelected: { defaultValue: false, control: { type: 'boolean' } },
    clrDgRowAriaLabel: { defaultValue: '' },
    // outputs
    clrDgExpandedChange: { control: { disable: true } },
    clrDgSelectedChange: { control: { disable: true } },
    // methods
    toggle: { control: { disable: true } },
    toggleExpand: { control: { disable: true } },
    // story helpers
    elements: { control: { disable: true }, table: { disable: true } },
  },
  args: {
    // outputs
    clrDgExpandedChange: action('clrDgExpandedChange'),
    clrDgSelectedChange: action('clrDgSelectedChange'),
    // story helpers
    elements,
    highlight: true,
    singleSelectable: false,
    multiSelectable: false,
    expandable: false,
    compact: false,
    hidableColumns: false,
    height: 0,
  },
};

setupStorybook([ClrDatagridModule, ClrConditionalModule], defaultStory, defaultParameters);

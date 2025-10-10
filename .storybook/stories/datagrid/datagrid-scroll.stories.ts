/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  ClrComboboxModule,
  ClrConditionalModule,
  ClrDatagridModule,
  ClrDropdownModule,
  ClrPopoverModule,
  ClrSignpostModule,
} from '@clr/angular';
import { moduleMetadata, StoryFn, StoryObj } from '@storybook/angular';

import { elements } from '../../helpers/elements.data';

export default {
  title: 'Datagrid/Scrolling',
  decorators: [
    moduleMetadata({
      imports: [
        ClrDatagridModule,
        ClrConditionalModule,
        ClrComboboxModule,
        ClrDropdownModule,
        ClrSignpostModule,
        ClrPopoverModule,
      ],
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

const NestedPopoverInScrollTemplate: StoryFn = args => ({
  template: `
    <style>
      .electronegativity-container {
        display: flex;
        justify-content: space-between;

        .electronegativity-bar {
          background-color: var(--cds-alias-status-info);
        }
      }
    </style>
    <clr-datagrid [style.height.px]="250">
      <clr-dg-column [style.width.px]="250">Name</clr-dg-column>
      <clr-dg-column [style.width.px]="250">Symbol</clr-dg-column>
      <clr-dg-column [style.width.px]="250">Number</clr-dg-column>
      <clr-dg-column>Electronegativity</clr-dg-column>

      <clr-dg-row *clrDgItems="let element of elements" [clrDgItem]="element">
        <clr-dg-cell>
          {{ element.name }}
          <clr-tooltip>
            <cds-icon clrTooltipTrigger shape="info-circle" size="24"></cds-icon>
            <clr-tooltip-content [clrPosition]="'top-right'" [clrSize]="'sm'">
              This is a basic tooltip
            </clr-tooltip-content>
          </clr-tooltip>
        </clr-dg-cell>
        <clr-dg-cell>{{ element.symbol }}</clr-dg-cell>
        <clr-dg-cell>
          {{ element.number }}
          <clr-signpost>
            <clr-signpost-content>This is a signpost.</clr-signpost-content>
          </clr-signpost>
        </clr-dg-cell>
        <clr-dg-cell class="electronegativity-container">
          {{ element.electronegativity }}
          <div [style.width.%]="(element.electronegativity * 100) / 5" class="electronegativity-bar">&nbsp;</div>
        </clr-dg-cell>
      </clr-dg-row>

      <clr-dg-detail *clrIfDetail="let element">
        <clr-dg-detail-header>{{ element.name }}</clr-dg-detail-header>
        <clr-dg-detail-body>
          Pressing escape on a nested popover should not close the detail pane.
          <br />

          <clr-dropdown>
            <button class="btn btn-outline-primary" clrDropdownTrigger>
              Dropdown
              <cds-icon shape="angle" direction="down"></cds-icon>
            </button>
            <clr-dropdown-menu>
              <div aria-label="Action 1" clrDropdownItem>Action 1</div>
              <div aria-label="Action 2" clrDropdownItem>Action 2</div>
              <div aria-label="Action 3" clrDropdownItem>Action 3</div>
            </clr-dropdown-menu>
          </clr-dropdown>
          <br />

          <clr-combobox>
            <ng-container *clrOptionSelected="let selected">
              {{ selected }}
            </ng-container>
            <clr-options>
              <clr-option *ngFor="let element of elements" [clrValue]="element.symbol">{{ element.name }}</clr-option>
            </clr-options>
          </clr-combobox>
          <br />

          <clr-signpost>
            <clr-signpost-content>This is a signpost.</clr-signpost-content>
          </clr-signpost>
        </clr-dg-detail-body>
      </clr-dg-detail>

      <clr-dg-footer>
        <clr-dg-pagination #pagination>
          <clr-dg-page-size [clrPageSizeOptions]="[10, 20, 50, 100]">Elements per page</clr-dg-page-size>
          {{ pagination.firstItem + 1 }} - {{ pagination.lastItem + 1 }} of {{ pagination.totalItems }} elements
        </clr-dg-pagination>
      </clr-dg-footer>
    </clr-datagrid>
  `,
  props: { ...args },
});

export const NestedPopoverInScroll: StoryObj = {
  render: NestedPopoverInScrollTemplate,
};

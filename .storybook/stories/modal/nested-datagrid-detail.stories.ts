/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrDatagridModule, ClrModalModule } from '@clr/angular';
import { moduleMetadata, StoryFn, StoryObj } from '@storybook/angular';

import { CommonModules } from '../../helpers/common';
import { elements } from '../../helpers/elements.data';

export default {
  title: 'Modal/Nested Datagrid Detail',
  decorators: [
    moduleMetadata({
      imports: [...CommonModules, ClrModalModule, ClrDatagridModule],
    }),
  ],
  argTypes: {
    // story helpers
    elements: { control: { disable: true }, table: { disable: true } },
  },
  args: {
    // story helpers
    elements,
    showActionOverflow: false,
    modalOpen: false,
  },
};

const NestedDatagridTemplate: StoryFn = args => ({
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
    <div [style.min-height.px]="showActionOverflow ? 650 : 0">
      <div><strong>This story is NOT an endorsement of this UX pattern.</strong></div>

      <button type="button" class="btn btn-primary" (click)="modalOpen = true">Open Modal</button>

      <clr-modal [(clrModalOpen)]="modalOpen">
        <h3 class="modal-title">Modal</h3>
        <div class="modal-body">
          <clr-datagrid *ngIf="modalOpen">
            <clr-dg-column [style.width.px]="250">Name</clr-dg-column>
            <clr-dg-column [style.width.px]="250">Symbol</clr-dg-column>
            <clr-dg-column [style.width.px]="250">Number</clr-dg-column>
            <clr-dg-column>Electronegativity</clr-dg-column>

            <clr-dg-row *clrDgItems="let element of elements; let index = index" [clrDgItem]="element">
              <clr-dg-action-overflow *ngIf="showActionOverflow">
                <button class="action-item">Edit</button>
                <button class="action-item">Delete</button>
              </clr-dg-action-overflow>
              <clr-dg-cell>{{ element.name }}</clr-dg-cell>
              <clr-dg-cell>{{ element.symbol }}</clr-dg-cell>
              <clr-dg-cell>{{ element.number }}</clr-dg-cell>
              <clr-dg-cell class="electronegativity-container">
                {{ element.electronegativity }}
                <div [style.width.%]="(element.electronegativity * 100) / 5" class="electronegativity-bar">&nbsp;</div>
              </clr-dg-cell>
            </clr-dg-row>

            <clr-dg-detail *clrIfDetail="let element">
              <clr-dg-detail-header>{{ element.name }}</clr-dg-detail-header>
              <clr-dg-detail-body>
                Pressing escape should only this detail pane, not the modal.
                <br />
                {{ element | json }}
              </clr-dg-detail-body>
            </clr-dg-detail>

            <clr-dg-footer>
              <clr-dg-pagination #pagination>
                <clr-dg-page-size [clrPageSizeOptions]="[10, 20, 50, 100]">Elements per page</clr-dg-page-size>
                {{ pagination.firstItem + 1 }} - {{ pagination.lastItem + 1 }} of {{ pagination.totalItems }} elements
              </clr-dg-pagination>
            </clr-dg-footer>
          </clr-datagrid>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-primary" (click)="modalOpen = false">Close</button>
        </div>
      </clr-modal>
    </div>
  `,
  props: args,
});

export const NestedDatagridDetail: StoryObj = {
  render: NestedDatagridTemplate,
};

export const NestedDatagridWithOpenedActions: StoryObj = {
  render: NestedDatagridTemplate,
  args: {
    modalOpen: true,
    showActionOverflow: true,
  },
  play({ canvasElement }) {
    setTimeout(() => {
      (canvasElement.querySelector('button.datagrid-action-toggle') as HTMLElement).click();
    }, 1);
  },
};

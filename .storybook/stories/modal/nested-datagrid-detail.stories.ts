/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Parameters } from '@storybook/addons';
import { Story } from '@storybook/angular';
import { elements } from 'helpers/elements.data';

import { ClrDatagridModule, ClrModalModule } from '../../../projects/angular/src';
import { setupStorybook } from '../../helpers/setup-storybook.helpers';

const story: Story = args => ({
  template: `
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
              Pressing escape should only this detail pane, not the modal.<br />
              {{element | json}}
            </clr-dg-detail-body>
          </clr-dg-detail>

          <clr-dg-footer>
            <clr-dg-pagination #pagination>
              <clr-dg-page-size [clrPageSizeOptions]="[10,20,50,100]">Elements per page</clr-dg-page-size>
              {{pagination.firstItem + 1}} - {{pagination.lastItem + 1}} of {{pagination.totalItems}} elements
            </clr-dg-pagination>
          </clr-dg-footer>
        </clr-datagrid>
      </div>
      <div class="modal-footer">
        <button type="button" class="btn btn-primary" (click)="modalOpen = false">Close</button>
      </div>
    </clr-modal>
  `,
  props: { ...args },
});

const parameters: Parameters = {
  title: 'Modal/Nested Datagrid Detail',
  argTypes: {
    // story helpers
    elements: { control: { disable: true }, table: { disable: true } },
  },
  args: {
    // story helpers
    elements,
  },
};

setupStorybook([ClrModalModule, ClrDatagridModule], story, parameters);

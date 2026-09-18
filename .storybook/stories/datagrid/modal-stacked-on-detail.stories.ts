/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrDatagridModule, ClrModalModule } from '@clr/angular';
import { type Meta, moduleMetadata, type StoryObj } from '@storybook/angular';
import { hideControls } from '@storybook-helpers/arg-types';
import { withStyles } from '@storybook-helpers/decorators';
import { type Element, elements } from '@storybook-helpers/elements.data';

/** The story renders a bare template with no component, so the rows it paginates are the only arg. */
type ModalStackedOnDetailArgs = {
  elements: Element[];
};

/** Was an inline `<style>` at the head of the story template; copied verbatim. */
const ELECTRONEGATIVITY_STYLES = `
  .electronegativity-container {
    display: flex;
    justify-content: space-between;

    .electronegativity-bar {
      background-color: var(--cds-alias-status-info);
    }
  }
`;

const meta: Meta<ModalStackedOnDetailArgs> = {
  title: 'Datagrid/Modal Stacked On Detail',
  decorators: [
    moduleMetadata({
      imports: [ClrDatagridModule, ClrModalModule],
    }),
    withStyles(ELECTRONEGATIVITY_STYLES),
  ],
  argTypes: {
    // story helpers
    ...hideControls('elements'),
  },
  args: {
    // story helpers
    elements,
  },
  render: args => ({
    template: `
      <div><strong>This story is NOT an endorsement of this UX pattern.</strong></div>

      <clr-datagrid>
        <clr-dg-column [style.width.px]="250">Name</clr-dg-column>
        <clr-dg-column [style.width.px]="250">Symbol</clr-dg-column>
        <clr-dg-column [style.width.px]="250">Number</clr-dg-column>
        <clr-dg-column>Electronegativity</clr-dg-column>

        <clr-dg-row *clrDgItems="let element of elements; let index = index" [clrDgItem]="element">
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
            <button type="button" class="btn btn-primary" (click)="modalOpen = true">Open Modal</button>
          </clr-dg-detail-body>
        </clr-dg-detail>

        <clr-dg-footer>
          <clr-dg-pagination #pagination>
            <clr-dg-page-size [clrPageSizeOptions]="[10, 20, 50, 100]">Elements per page</clr-dg-page-size>
            {{ pagination.firstItem + 1 }} - {{ pagination.lastItem + 1 }} of {{ pagination.totalItems }} elements
          </clr-dg-pagination>
        </clr-dg-footer>
      </clr-datagrid>

      <clr-modal [(clrModalOpen)]="modalOpen">
        <h3 class="modal-title">Modal</h3>
        <div class="modal-body">Pressing escape should only this modal, not the detail pane.</div>
        <div class="modal-footer">
          <button type="button" class="btn btn-primary" (click)="modalOpen = false">Close</button>
        </div>
      </clr-modal>
    `,
    props: { ...args },
  }),
};

export default meta;

type Story = StoryObj<ModalStackedOnDetailArgs>;

export const ModalStackedOnDetail: Story = {};

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  ClrConditionalModule,
  ClrDatagrid,
  ClrDatagridModule,
  ClrDropdownModule,
  commonStringsDefault,
  SelectionType,
} from '@clr/angular';
import { type Meta, moduleMetadata, type StoryObj } from '@storybook/angular';
import { hideControls } from '@storybook-helpers/arg-types';
import { withStyles } from '@storybook-helpers/decorators';
import { behaviorElements, type Element } from '@storybook-helpers/elements.data';
import type { BehaviorSubject } from 'rxjs';
import { action } from 'storybook/actions';

/**
 * The args drive a bare template, not an instance of `ClrDatagrid`. Clarity aliases its inputs
 * (`@Input('clrDgLoading') get loading`), so the component class cannot be the args type. The two
 * methods are picked off it because they are named in `argTypes` only, to keep their docs rows hidden.
 */
type VirtualScrollArgs = Pick<ClrDatagrid, 'dataChanged' | 'resize'> & {
  clrDgSelected: Element[];
  clrDgSelectionType: SelectionType;
  clrDgActionOverflowOpen: boolean;
  clrDgActionOverflowButtonLabel: string;
  clrDetailExpandableAriaLabel: string;
  clrDgLoading: boolean;
  clrLoadingMoreItems: boolean;
  clrDgPreserveSelection: boolean;
  clrDgRowSelection: boolean;
  clrDgCustomSelectAllEnabled: boolean;
  clrDgSkeletonLoading: boolean;
  clrDgSingleActionableAriaLabel: string;
  clrDgSingleSelectionAriaLabel: string;
  clrDgRefresh: (state: unknown) => void;
  clrDgSelectedChange: (selected: Element[]) => void;
  clrRenderRangeChange: (range: unknown) => void;
  clrDgActionOverflowOpenChange: (open: boolean) => void;
  clrDgCustomSelectAll: (this: { selectedRows: number[] }, selectAllChecked: boolean) => void;
  behaviorElements: BehaviorSubject<Element[]>;
  scrollToIndexBehavior: 'auto' | 'smooth';
  expandable: boolean;
  actionOverflow: boolean;
  compact: boolean;
  hidableColumns: boolean;
  scrollOffset: number;
  showFooterNavButtons: boolean;
  height: number;
  selectedRows: number[];
  selectedRowsArray: Element[];
  setExpanded: (expanded: boolean, element: Element) => void;
};

/** Was part of an inline `<style>` at the head of the story template; copied verbatim. */
const ELECTRONEGATIVITY_STYLES = `
  .electronegativity-container {
    display: flex;
    justify-content: space-between;

    .electronegativity-bar {
      background-color: var(--cds-alias-status-info);
    }
  }
`;

/** Was part of an inline `<style>` at the head of the story template; copied verbatim. */
const FOOTER_NAV_STYLES = `
  .footer-nav-buttons {
    display: inline-block;
    margin-left: var(--cds-global-space-5);
  }
  .footer-button {
    min-width: var(--cds-global-space-9);
    margin: 0 0 0 var(--cds-global-space-5);
    padding: 0;
  }
`;

const meta: Meta<VirtualScrollArgs> = {
  title: 'Components/Data/Datagrid/Virtualscroll',
  component: ClrDatagrid,
  decorators: [
    moduleMetadata({
      imports: [ClrDatagridModule, ClrConditionalModule, ClrDropdownModule],
    }),
    withStyles(ELECTRONEGATIVITY_STYLES + FOOTER_NAV_STYLES),
  ],
  argTypes: {
    // inputs
    clrDgSelected: { control: { disable: true } },
    clrDgSelectionType: {
      control: { type: 'select' },
      // Legacy label -> value object; `InputType` types `options` as an array, hence the cast.
      options: {
        None: SelectionType.None,
        Single: SelectionType.Single,
        Multi: SelectionType.Multi,
      } as unknown as SelectionType[],
    },
    // outputs
    clrDgRefresh: { control: { disable: true } },
    clrDgSelectedChange: { control: { disable: true } },
    clrRenderRangeChange: { control: { disable: true } },
    clrDgActionOverflowOpenChange: { control: { disable: true } },
    // methods
    dataChanged: { control: { disable: true } },
    resize: { control: { disable: true } },
    scrollToIndexBehavior: { control: { type: 'radio' }, options: ['auto', 'smooth'] },
    // story helpers
    ...hideControls('behaviorElements', 'setExpanded'),
  },
  args: {
    // inputs
    clrDgActionOverflowOpen: false,
    clrDgActionOverflowButtonLabel: commonStringsDefault.rowActions,
    clrDetailExpandableAriaLabel: commonStringsDefault.detailExpandableAriaLabel,
    clrDgLoading: false,
    clrLoadingMoreItems: false,
    clrDgPreserveSelection: false,
    clrDgRowSelection: false,
    clrDgCustomSelectAllEnabled: false,
    clrDgSkeletonLoading: false,
    clrDgSingleActionableAriaLabel: commonStringsDefault.singleActionableAriaLabel,
    clrDgSingleSelectionAriaLabel: commonStringsDefault.singleSelectionAriaLabel,
    // outputs
    clrDgRefresh: action('clrDgRefresh'),
    clrDgSelectedChange: action('clrDgSelectedChange'),
    clrRenderRangeChange: action('clrRenderRangeChange'),
    clrDgActionOverflowOpenChange: action('clrDgActionOverflowOpenChange'),
    clrDgCustomSelectAll(this: { selectedRows: number[] }, selectAllChecked: boolean) {
      action('clrDgCustomSelectAll').apply(this, [selectAllChecked]);
      this.selectedRows = selectAllChecked ? behaviorElements.value.map((element, i) => i).filter(i => i % 2) : [];
    },
    // story helpers
    behaviorElements,
    clrDgSelectionType: SelectionType.None,
    scrollToIndexBehavior: 'smooth',
    expandable: false,
    actionOverflow: false,
    compact: false,
    hidableColumns: false,
    scrollOffset: 16,
    showFooterNavButtons: false,
    height: 480,
    selectedRows: [],
    selectedRowsArray: [],
    setExpanded,
  },
  render: args => ({
    template: `
      @if ({ elements: behaviorElements | async }; as data) {
        <clr-datagrid
          #datagrid
          ${args.height ? '[style.height.px]="height"' : ''}
          [(clrDgSelected)]="selectedRowsArray"
          [clrDgSelectionType]="clrDgSelectionType"
          [ngClass]="{ 'datagrid-compact': compact }"
          [clrDetailExpandableAriaLabel]="clrDetailExpandableAriaLabel"
          [clrDgDisablePageFocus]="clrDgDisablePageFocus"
          [clrDgLoading]="clrDgLoading"
          [clrDgPreserveSelection]="clrDgPreserveSelection"
          [clrDgRowSelection]="clrDgRowSelection"
          [clrDgCustomSelectAllEnabled]="clrDgCustomSelectAllEnabled"
          [clrDgSingleActionableAriaLabel]="clrDgSingleActionableAriaLabel"
          [clrDgSingleSelectionAriaLabel]="clrDgSingleSelectionAriaLabel"
          (clrDgRefresh)="clrDgRefresh($event)"
          (clrDgSelectedChange)="clrDgSelectedChange($event)"
          (clrDgCustomSelectAll)="clrDgCustomSelectAll($event)"
          [clrLoadingMoreItems]="clrLoadingMoreItems"
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

          @if (data.elements) {
            <ng-template
              clrVirtualScroll
              let-element
              let-index="index"
              [clrVirtualRowsOf]="data.elements"
              [clrVirtualRowsTemplateCacheSize]="400"
              (renderedRangeChange)="clrRenderRangeChange($event)"
            >
              <clr-dg-row
                [clrDgItem]="element"
                [clrDgSelected]="selectedRows.includes(index)"
                [clrDgSkeletonLoading]="clrDgSkeletonLoading && index === 0"
              >
                @if (actionOverflow) {
                  <clr-dg-action-overflow
                    [clrDgActionOverflowOpen]="clrDgActionOverflowOpen && index === 0"
                    [clrDgActionOverflowButtonLabel]="clrDgActionOverflowButtonLabel"
                    (clrDgActionOverflowOpenChange)="index === 0 && clrDgActionOverflowOpenChange($event)"
                  >
                    <button class="action-item">Edit</button>
                    <button class="action-item">Delete</button>
                  </clr-dg-action-overflow>
                }
                <clr-dg-cell>{{ element.name }}</clr-dg-cell>
                <clr-dg-cell>{{ element.symbol }}</clr-dg-cell>
                <clr-dg-cell>{{ element.number }}</clr-dg-cell>
                <clr-dg-cell class="electronegativity-container">
                  {{ element.electronegativity }}
                  <div [style.width.%]="(element.electronegativity * 100) / 5" class="electronegativity-bar">&nbsp;</div>
                </clr-dg-cell>
                @if (expandable) {
                  <ng-container ngProjectAs="clr-dg-row-detail">
                    <clr-dg-row-detail
                      [clrIfExpanded]="!!element.expanded"
                      (clrIfExpandedChange)="setExpanded($event, element)"
                    >
                      {{ element | json }} {{ element.expanded }}
                    </clr-dg-row-detail>
                  </ng-container>
                }
              </clr-dg-row>
            </ng-template>
          }

          <clr-dg-footer>
            {{ data.elements?.length }}
            @if (showFooterNavButtons) {
              <div class="footer-nav-buttons">
                <clr-dropdown>
                  <button class="btn btn-sm btn-outline-neutral" clrDropdownTrigger aria-label="Dropdown demo button">
                    Jump to
                    <cds-icon shape="angle" direction="down"></cds-icon>
                  </button>
                  <clr-dropdown-menu *clrIfOpen [clrPosition]="'top-right'">
                    <div (click)="datagrid.virtualScroll.scrollToIndex(20, scrollToIndexBehavior)" clrDropdownItem>
                      20
                    </div>
                    <div (click)="datagrid.virtualScroll.scrollToIndex(60, scrollToIndexBehavior)" clrDropdownItem>
                      60
                    </div>
                    <div (click)="datagrid.virtualScroll.scrollToIndex(80, scrollToIndexBehavior)" clrDropdownItem>
                      80
                    </div>
                    <div (click)="datagrid.virtualScroll.scrollToIndex(100, scrollToIndexBehavior)" clrDropdownItem>
                      100
                    </div>
                  </clr-dropdown-menu>
                </clr-dropdown>

                <button
                  class="btn btn-sm btn-link-neutral footer-button"
                  (click)="datagrid.virtualScroll.scrollToIndex(0, scrollToIndexBehavior)"
                >
                  <cds-icon shape="step-forward-2" direction="left"></cds-icon>
                </button>
                <button
                  class="btn btn-sm btn-link-neutral footer-button"
                  (click)="datagrid.virtualScroll.scrollUp(scrollOffset, scrollToIndexBehavior)"
                >
                  <cds-icon shape="angle" direction="up"></cds-icon>
                </button>
                <button
                  class="btn btn-sm btn-link-neutral footer-button"
                  (click)="datagrid.virtualScroll.scrollDown(scrollOffset, scrollToIndexBehavior)"
                >
                  <cds-icon shape="angle" direction="down"></cds-icon>
                </button>
                <button
                  class="btn btn-sm btn-link-neutral footer-button"
                  (click)="datagrid.virtualScroll.scrollToIndex(data.elements?.length, scrollToIndexBehavior)"
                >
                  <cds-icon shape="step-forward-2" direction="right"></cds-icon>
                </button>
              </div>
            }
          </clr-dg-footer>
        </clr-datagrid>
      }
    `,
    props: { ...args },
  }),
};

export default meta;

type Story = StoryObj<VirtualScrollArgs>;

function setExpanded($event, element) {
  element.expanded = $event;
}

export const Datagrid: Story = {};

export const SingleSelect: Story = {
  args: {
    clrDgSelectionType: SelectionType.Single,
  },
};
export const MultiSelect: Story = {
  args: {
    clrDgSelectionType: SelectionType.Multi,
  },
};
export const MultiSelectWithSelection: Story = {
  args: {
    clrDgSelectionType: SelectionType.Multi,
    selectedRows: [1],
  },
};

export const ManageColumns: Story = {
  args: {
    hidableColumns: true,
  },
};

export const SkeletonLoading: Story = {
  args: {
    clrDgSkeletonLoading: true,
  },
};

export const Compact: Story = {
  args: {
    compact: true,
  },
};
export const CompactSingleSelect: Story = {
  args: {
    compact: true,
    clrDgSelectionType: SelectionType.Single,
  },
};
export const CompactMultiSelect: Story = {
  args: {
    compact: true,
    clrDgSelectionType: SelectionType.Multi,
  },
};
export const CompactMultiSelectWithSelection: Story = {
  args: {
    compact: true,
    clrDgSelectionType: SelectionType.Multi,
    selectedRows: [1],
  },
};

export const CompactSkeletonLoading: Story = {
  args: {
    clrDgSkeletonLoading: true,
    compact: true,
  },
};

export const Full: Story = {
  args: {
    actionOverflow: true,
    expandable: true,
    hidableColumns: true,
    clrDgSelectionType: SelectionType.Multi,
  },
};

export const FullCompact: Story = {
  args: {
    actionOverflow: true,
    compact: true,
    expandable: true,
    hidableColumns: true,
    clrDgSelectionType: SelectionType.Multi,
  },
};

export const FullCompactWithButtonNavigationPattern: Story = {
  args: {
    actionOverflow: true,
    compact: true,
    expandable: true,
    hidableColumns: true,
    clrDgSelectionType: SelectionType.Multi,
    showFooterNavButtons: true,
  },
};

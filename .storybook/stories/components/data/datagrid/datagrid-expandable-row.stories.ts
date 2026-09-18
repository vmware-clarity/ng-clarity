/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrConditionalModule, ClrDatagridModule, ClrDatagridRow, ClrTooltipModule, SelectionType } from '@clr/angular';
import { type Meta, moduleMetadata, type StoryContext, type StoryObj } from '@storybook/angular';
import { hideControls } from '@storybook-helpers/arg-types';
import { withStyles } from '@storybook-helpers/decorators';
import { type Element, elements } from '@storybook-helpers/elements.data';
import { action } from 'storybook/actions';

/**
 * The args drive a bare template, not an instance of `ClrDatagridRow`. Clarity aliases its inputs
 * (`@Input('clrDgExpanded') get expanded`), so the component class cannot be the args type. The two
 * methods are picked off it because they are named in `argTypes` only, to keep their docs rows hidden.
 */
type ExpandableRowArgs = Pick<ClrDatagridRow, 'toggle' | 'toggleExpand'> & {
  clrDgItem: Element;
  clrDgSelected: boolean;
  clrDgSelectionType: SelectionType;
  clrDgDetailCloseLabel: string;
  clrDgDetailOpenLabel: string;
  clrDgExpanded: boolean;
  clrDgReplace: boolean;
  clrDgSelectable: boolean;
  clrDgRowSelectionLabel: string;
  clrDgExpandedChange: (expanded: boolean) => void;
  clrDgSelectedChange: (selected: boolean) => void;
  elements: Element[];
  highlight: boolean;
  detailColumns: boolean;
  compact: boolean;
  overflowEllipsis: boolean;
  hidableColumns: boolean;
  height: number;
};

/** Was an inline `<style>` at the head of the story template; copied verbatim. */
const ELECTRONEGATIVITY_STYLES = `
  clr-dg-cell.datagrid-cell.electronegativity-container {
    display: flex;
    justify-content: space-between;

    .electronegativity-bar {
      max-height: var(--cds-global-space-8);
      background-color: var(--cds-alias-status-info);
    }
  }
`;

const meta: Meta<ExpandableRowArgs> = {
  title: 'Components/Data/Datagrid/Expandable Row',
  component: ClrDatagridRow,
  decorators: [
    moduleMetadata({
      imports: [ClrDatagridModule, ClrTooltipModule, ClrConditionalModule],
    }),
    withStyles(ELECTRONEGATIVITY_STYLES),
  ],
  argTypes: {
    // inputs
    clrDgItem: { control: { disable: true } },
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
    clrDgExpandedChange: { control: { disable: true } },
    clrDgSelectedChange: { control: { disable: true } },
    // methods
    toggle: { control: { disable: true } },
    toggleExpand: { control: { disable: true } },
    // story helpers
    ...hideControls('elements'),
  },
  args: {
    // inputs
    clrDgSelectionType: SelectionType.None,
    clrDgDetailCloseLabel: '',
    clrDgDetailOpenLabel: '',
    clrDgExpanded: false,
    clrDgReplace: false,
    clrDgSelectable: true,
    clrDgSelected: false,
    clrDgRowSelectionLabel: '',
    // outputs
    clrDgExpandedChange: action('clrDgExpandedChange'),
    clrDgSelectedChange: action('clrDgSelectedChange'),
    // story helpers
    elements,
    // NOTE: the template binds `highlight`, but this file ships no `.highlight` rule, so the outline
    // never renders. Left exactly as-is: adding the rule would change every snapshot in this file.
    highlight: true,
    detailColumns: false,
    compact: false,
    overflowEllipsis: false,
    hidableColumns: false,
    height: 0,
  },
  render: args => ({
    template: `
      <clr-datagrid
        ${args.height ? '[style.height.px]="height"' : ''}
        [clrDgSelected]="[]"
        [clrDgSelectionType]="clrDgSelectionType"
        [ngClass]="{ 'datagrid-compact': compact, 'datagrid-overflow-ellipsis': overflowEllipsis }"
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
        @if (overflowEllipsis) {
          <clr-dg-column [style.width.px]="250">
            <ng-container ${args.hidableColumns ? '*clrDgHideableColumn' : ''}>Long text width 250px</ng-container>
          </clr-dg-column>
        }
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
            <clr-tooltip>
              <cds-icon clrTooltipTrigger shape="exclamation-circle" solid></cds-icon>
              <clr-tooltip-content clrPosition="bottom-right" clrSize="lg">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin in neque in ante placerat mattis id sed
                quam. Proin rhoncus lacus et tempor dignissim. Vivamus sem quam, pellentesque aliquet suscipit eget,
                pellentesque sed arcu. Vivamus in dui lectus. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                Proin in neque in ante placerat mattis id sed quam. Proin rhoncus lacus et tempor dignissim. Vivamus sem
                quam, pellentesque aliquet suscipit eget, pellentesque sed arcu. Vivamus in dui lectus.
              </clr-tooltip-content>
            </clr-tooltip>
            {{ element.name }}
          </clr-dg-cell>
          <clr-dg-cell>{{ element.symbol }}</clr-dg-cell>
          <clr-dg-cell>{{ element.number }}</clr-dg-cell>
          @if (overflowEllipsis) {
            <clr-dg-cell>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin in neque in ante placerat mattis id sed quam.
              Proin rhoncus lacus et tempor dignissim. Vivamus sem quam, pellentesque aliquet suscipit eget, pellentesque
              sed arcu. Vivamus in dui lectus. Suspendisse cursus est ac nisl imperdiet viverra. Aenean sagittis nibh
              lacus, in eleifend urna ultrices et. Mauris porttitor nisi nec velit pharetra porttitor. Vestibulum
            </clr-dg-cell>
          }
          <clr-dg-cell class="electronegativity-container">
            {{ element.electronegativity }}
            <div [style.width.%]="(element.electronegativity * 100) / 5" class="electronegativity-bar">&nbsp;</div>
          </clr-dg-cell>

          <clr-dg-row-detail *clrIfExpanded [clrDgReplace]="clrDgReplace">
            @if (!detailColumns) {
              <div>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin in neque in ante placerat mattis id sed
                quam. Proin rhoncus lacus et tempor dignissim. Vivamus sem quam, pellentesque aliquet suscipit eget,
                pellentesque sed arcu. Vivamus in dui lectus. Suspendisse cursus est ac nisl imperdiet viverra. Aenean
                sagittis nibh lacus, in eleifend urna ultrices et. Mauris porttitor nisi nec velit pharetra porttitor.
                Vestibulum vulputate sollicitudin dolor ut tincidunt. Phasellus vitae blandit felis. Nullam posuere ipsum
                tincidunt velit pellentesque rhoncus. Morbi faucibus ut ipsum at malesuada. Nam vestibulum felis sit amet
                metus finibus hendrerit. Fusce faucibus odio eget ex vulputate rhoncus. Fusce nec aliquam leo, at suscipit
                diam.
              </div>
              <div>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin in neque in ante placerat mattis id sed
                quam. Proin rhoncus lacus et tempor dignissim. Vivamus sem quam, pellentesque aliquet suscipit eget,
                pellentesque sed arcu. Vivamus in dui lectus. Suspendisse cursus est ac nisl imperdiet viverra. Aenean
                sagittis nibh lacus, in eleifend urna ultrices et. Mauris porttitor nisi nec velit pharetra porttitor.
                Vestibulum vulputate sollicitudin dolor ut tincidunt. Phasellus vitae blandit felis. Nullam posuere ipsum
                tincidunt velit pellentesque rhoncus. Morbi faucibus ut ipsum at malesuada. Nam vestibulum felis sit amet
                metus finibus hendrerit. Fusce faucibus odio eget ex vulputate rhoncus. Fusce nec aliquam leo, at suscipit
                diam.
              </div>
            }

            @if (detailColumns) {
              <clr-dg-cell>
                <clr-tooltip>
                  <cds-icon clrTooltipTrigger shape="exclamation-circle" solid></cds-icon>
                  <clr-tooltip-content clrPosition="bottom-right" clrSize="lg">
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin in neque in ante placerat mattis id sed
                    quam. Proin rhoncus lacus et tempor dignissim. Vivamus sem quam, pellentesque aliquet suscipit eget,
                    pellentesque sed arcu. Vivamus in dui lectus. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Proin in neque in ante placerat mattis id sed quam. Proin rhoncus lacus et tempor dignissim. Vivamus
                    sem quam, pellentesque aliquet suscipit eget, pellentesque sed arcu. Vivamus in dui lectus.
                  </clr-tooltip-content>
                </clr-tooltip>
                {{ element.name }} {{ clrDgReplace ? '(Row Replaced)' : '' }}
              </clr-dg-cell>
              <clr-dg-cell>{{ element.symbol }}</clr-dg-cell>
              <clr-dg-cell>{{ element.number }}</clr-dg-cell>
              @if (overflowEllipsis) {
                <clr-dg-cell>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin in neque in ante placerat mattis id sed
                  quam. Proin rhoncus lacus et tempor dignissim. Vivamus sem quam, pellentesque aliquet suscipit eget,
                  pellentesque sed arcu. Vivamus in dui lectus. Suspendisse cursus est ac nisl imperdiet viverra. Aenean
                  sagittis nibh lacus, in eleifend urna ultrices et. Mauris porttitor nisi nec velit pharetra porttitor.
                  Vestibulum
                </clr-dg-cell>
              }
              <clr-dg-cell class="electronegativity-container">
                {{ element.electronegativity }}
                <div [style.width.%]="(element.electronegativity * 100) / 5" class="electronegativity-bar">&nbsp;</div>
              </clr-dg-cell>
            }
          </clr-dg-row-detail>
        </clr-dg-row>

        <clr-dg-footer>
          <clr-dg-pagination #pagination>
            <clr-dg-page-size [clrPageSizeOptions]="[10, 20, 50, 100]">Elements per page</clr-dg-page-size>
            {{ pagination.firstItem + 1 }} - {{ pagination.lastItem + 1 }} of {{ pagination.totalItems }} elements
          </clr-dg-pagination>
        </clr-dg-footer>
      </clr-datagrid>
    `,
    props: { ...args },
  }),
};

export default meta;

type Story = StoryObj<ExpandableRowArgs>;

export const ExpandableRows: Story = {};

export const ExpandedExpandableRows: Story = {
  args: {
    clrDgExpanded: true,
  },
};

export const CompactExpandedExpandableRows: Story = {
  args: {
    compact: true,
    clrDgExpanded: true,
  },
};

export const ExpandedColumnReplaceExpandableRows: Story = {
  args: {
    clrDgExpanded: true,
    clrDgReplace: true,
    detailColumns: true,
  },
};

export const CompactExpandedColumnReplaceExpandableRows: Story = {
  args: {
    compact: true,
    clrDgExpanded: true,
    clrDgReplace: true,
    detailColumns: true,
  },
};

export const CompactOverflowEllipsisExpandableRows: Story = {
  args: {
    compact: true,
    overflowEllipsis: true,
    clrDgSelectionType: SelectionType.Multi,
    clrDgReplace: true,
    detailColumns: true,
  },
};

export const ExpandableRowsTooltipOpened: Story = {
  play: focusTooltip,
};

export const ExpandedExpandableRowsTooltipOpened: Story = {
  play: focusTooltip,
  args: {
    clrDgExpanded: true,
  },
};

export const ExpandedColumnExpandableRowsTooltipOpened: Story = {
  play: focusTooltip,
  args: {
    clrDgExpanded: true,
    detailColumns: true,
  },
};

function focusTooltip({ canvasElement }: StoryContext) {
  canvasElement.querySelector<HTMLButtonElement>('cds-icon[clrTooltipTrigger]')?.focus();
}

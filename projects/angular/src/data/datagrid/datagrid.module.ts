/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { NgModule, Type } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClrCheckboxModule } from '@clr/angular/src/forms/checkbox';
import { ClrInputModule } from '@clr/angular/src/forms/input';
import { ClrNumberInputModule } from '@clr/angular/src/forms/number-input';
import { ClrRadioModule } from '@clr/angular/src/forms/radio';
import { ClrSelectModule } from '@clr/angular/src/forms/select';
import {
  angleDoubleIcon,
  arrowIcon,
  ClarityIcons,
  ClrIcon,
  ellipsisVerticalIcon,
  filterGridCircleIcon,
  filterGridIcon,
  stepForward2Icon,
  timesIcon,
  viewColumnsIcon,
  windowCloseIcon,
} from '@clr/angular/src/icon';
import { ÇlrClrPopoverModuleNext } from '@clr/angular/src/popover/common';
import { ClrSpinnerModule } from '@clr/angular/src/progress/spinner';
import {
  CdkDragModule,
  CdkTrapFocusModule,
  ClrConditionalModule,
  ClrExpandableAnimationModule,
  ClrKeyFocusModule,
  ClrLoadingModule,
  ClrOutsideClickModule,
} from '@clr/angular/src/utils';

import { DatagridNumericFilter } from './built-in/filters/datagrid-numeric-filter';
import { DatagridStringFilter } from './built-in/filters/datagrid-string-filter';
import { ActionableOompaLoompa } from './chocolate/actionable-oompa-loompa';
import { DatagridWillyWonka } from './chocolate/datagrid-willy-wonka';
import { ExpandableOompaLoompa } from './chocolate/expandable-oompa-loompa';
import { ClrDatagrid } from './datagrid';
import { ClrDatagridActionBar } from './datagrid-action-bar';
import { ClrDatagridActionOverflow } from './datagrid-action-overflow';
import { ClrDatagridCell } from './datagrid-cell';
import { ClrDatagridColumn } from './datagrid-column';
import { ClrDatagridColumnSeparator } from './datagrid-column-separator';
import { ClrDatagridColumnToggle } from './datagrid-column-toggle';
import { ClrDatagridColumnToggleButton } from './datagrid-column-toggle-button';
import { ClrDatagridDetail } from './datagrid-detail';
import { ClrDatagridDetailBody } from './datagrid-detail-body';
import { ClrDatagridDetailHeader } from './datagrid-detail-header';
import { DatagridDetailRegisterer } from './datagrid-detail-registerer';
import { ClrDatagridFilter } from './datagrid-filter';
import { ClrDatagridFooter } from './datagrid-footer';
import { ClrDatagridHideableColumn } from './datagrid-hideable-column';
import { ClrIfDetail } from './datagrid-if-detail';
import { ClrDatagridItems } from './datagrid-items';
import { ClrDatagridPageSize } from './datagrid-page-size';
import { ClrDatagridPagination } from './datagrid-pagination';
import { ClrDatagridPlaceholder } from './datagrid-placeholder';
import { ClrDatagridRow } from './datagrid-row';
import { ClrDatagridRowDetail } from './datagrid-row-detail';
import { ClrDatagridSelectionCellDirective } from './datagrid-selection-cell.directive';
import { ClrDatagridSingleSelectionValueAccessor } from './datagrid-single-selection.directive';
import { ClrDatagridVirtualScrollDirective } from './datagrid-virtual-scroll.directive';
import { DatagridCellRenderer } from './render/cell-renderer';
import { DatagridHeaderRenderer } from './render/header-renderer';
import { DatagridMainRenderer } from './render/main-renderer';
import { DatagridRowDetailRenderer } from './render/row-detail-renderer';
import { DatagridRowRenderer } from './render/row-renderer';
import { WrappedCell } from './wrapped-cell';
import { WrappedColumn } from './wrapped-column';
import { WrappedRow } from './wrapped-row';

export const CLR_DATAGRID_DIRECTIVES: Type<any>[] = [
  // Core
  ClrDatagrid,
  ClrDatagridActionBar,
  ClrDatagridActionOverflow,
  ClrDatagridCell,
  ClrDatagridColumn,
  ClrDatagridColumnSeparator,
  ClrDatagridDetail,
  ClrDatagridDetailBody,
  ClrDatagridDetailHeader,
  ClrDatagridFilter,
  ClrDatagridFooter,
  ClrDatagridHideableColumn,
  ClrDatagridItems,
  ClrDatagridPageSize,
  ClrDatagridPagination,
  ClrDatagridPlaceholder,
  ClrDatagridRow,
  ClrDatagridRowDetail,
  ClrDatagridSelectionCellDirective,
  ClrDatagridVirtualScrollDirective,
  ClrIfDetail,
  DatagridDetailRegisterer,
  WrappedCell,
  WrappedColumn,
  WrappedRow,

  // Renderers
  DatagridCellRenderer,
  DatagridHeaderRenderer,
  DatagridMainRenderer,
  DatagridRowDetailRenderer,
  DatagridRowRenderer,

  // Chocolate
  ActionableOompaLoompa,
  DatagridWillyWonka,
  ExpandableOompaLoompa,

  // Built-in shortcuts
  DatagridNumericFilter,
  DatagridStringFilter,
];

const CLR_DATAGRID_INTERNAL_DIRECTIVES = [ClrDatagridColumnToggle, ClrDatagridColumnToggleButton];
const CLR_DATAGRID_STANDALONE_DIRECTIVES = [ClrDatagridSingleSelectionValueAccessor];

@NgModule({
  imports: [
    CommonModule,
    CdkDragModule,
    CdkTrapFocusModule,
    ClrIcon,
    ClrInputModule,
    ClrRadioModule,
    ClrCheckboxModule,
    ClrNumberInputModule,
    ClrSelectModule,
    FormsModule,
    ClrLoadingModule,
    ClrConditionalModule,
    ClrOutsideClickModule,
    ClrExpandableAnimationModule,
    ClrSpinnerModule,
    ÇlrClrPopoverModuleNext,
    ClrKeyFocusModule,
    CLR_DATAGRID_STANDALONE_DIRECTIVES,
  ],
  declarations: [CLR_DATAGRID_DIRECTIVES, CLR_DATAGRID_INTERNAL_DIRECTIVES],
  exports: [CLR_DATAGRID_DIRECTIVES, CLR_DATAGRID_STANDALONE_DIRECTIVES],
})
export class ClrDatagridModule {
  constructor() {
    ClarityIcons.addIcons(
      ellipsisVerticalIcon,
      viewColumnsIcon,
      windowCloseIcon,
      arrowIcon,
      timesIcon,
      stepForward2Icon,
      angleDoubleIcon,
      filterGridCircleIcon,
      filterGridIcon
    );
  }
}

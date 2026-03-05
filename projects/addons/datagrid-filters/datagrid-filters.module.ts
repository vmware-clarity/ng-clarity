/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { A11yModule as CdkA11yModule } from '@angular/cdk/a11y';
import { CommonModule, DatePipe } from '@angular/common';
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClrCheckboxModule, ClrInputModule, ClrRadioModule, ClrSelectModule } from '@clr/angular/forms';
import {
  angleIcon,
  ClarityIcons,
  ClrIcon,
  filterGridIcon,
  plusIcon,
  searchIcon,
  windowCloseIcon,
} from '@clr/angular/icon';
import { ClrSignpostModule } from '@clr/angular/popover/signpost';
import { ClrSpinnerModule } from '@clr/angular/progress/spinner';

import { DateTimeFilterComponent } from './advanced-filters/date-time-filter.component';
import { EnumFilterComponent } from './advanced-filters/enum-filter.component';
import { FilterFormComponent } from './advanced-filters/filter-form.component';
import { GeneralFilterComponent } from './advanced-filters/general-filter.component';
import { CompositeFiltersComponent } from './composite-filters.component';
import { DatagridFiltersStrings } from './datagrid-filters-strings.service';
import { DataGridFiltersComponent } from './datagrid-filters.component';
import { FilterPopoverRepositionDirective } from './filter-popover-reposition-directive';
import { DismissableDirective } from './manage-filters/dismissable.directive';
import { ManageFilterComponent } from './manage-filters/manage-filter.component';
import { SkipFiltersPipe } from './skip-filters.pipe';

export function datagridFiltersStringsServiceFactory(existing: DatagridFiltersStrings) {
  return existing || new DatagridFiltersStrings();
}

@NgModule({
  declarations: [
    CompositeFiltersComponent,
    DataGridFiltersComponent,
    DateTimeFilterComponent,
    DismissableDirective,
    EnumFilterComponent,
    FilterFormComponent,
    FilterPopoverRepositionDirective,
    GeneralFilterComponent,
    ManageFilterComponent,
    SkipFiltersPipe,
  ],
  imports: [
    CdkA11yModule,
    ClrCheckboxModule,
    ClrIcon,
    ClrInputModule,
    ClrRadioModule,
    ClrSelectModule,
    ClrSignpostModule,
    ClrSpinnerModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [CompositeFiltersComponent, DataGridFiltersComponent, FilterFormComponent],
  providers: [
    DatePipe,
    {
      // This pattern allows the importer of this module to specify its own DatagridFiltersStrings.
      provide: DatagridFiltersStrings,
      useFactory: datagridFiltersStringsServiceFactory,
      deps: [[new Optional(), new SkipSelf(), DatagridFiltersStrings]],
    },
  ],
})
export class AppfxDatagridFiltersModule {
  constructor() {
    ClarityIcons.addIcons(angleIcon, filterGridIcon, plusIcon, searchIcon, windowCloseIcon);
  }
}

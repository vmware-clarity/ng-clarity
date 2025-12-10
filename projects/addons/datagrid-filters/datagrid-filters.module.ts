/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule, DatePipe } from '@angular/common';
import { NgModule, Optional, SkipSelf } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { angleIcon, ClarityIcons, filterGridIcon, plusIcon, windowCloseIcon } from '@cds/core/icon';
import {
  ClrCheckboxModule,
  ClrIconModule,
  ClrInputModule,
  ClrRadioModule,
  ClrSelectModule,
  ClrSignpostModule,
} from '@clr/angular';

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
    ClrCheckboxModule,
    ClrIconModule,
    ClrInputModule,
    ClrRadioModule,
    ClrSelectModule,
    ClrSignpostModule,
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
    ClarityIcons.addIcons(angleIcon, filterGridIcon, plusIcon, windowCloseIcon);
  }
}

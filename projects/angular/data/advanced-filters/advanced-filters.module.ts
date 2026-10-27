/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ClrTreeViewModule } from '@clr/angular/data/tree-view';
import { ClrBadge } from '@clr/angular/emphasis/badge';
import { ClrLabel } from '@clr/angular/emphasis/label';
import { ClrCheckboxModule } from '@clr/angular/forms/checkbox';
import { ClrComboboxModule } from '@clr/angular/forms/combobox';
import { ClrCommonFormsModule } from '@clr/angular/forms/common';
import { ClrDatepickerModule } from '@clr/angular/forms/datepicker';
import { ClrInputModule } from '@clr/angular/forms/input';
import { ClrNumberInputModule } from '@clr/angular/forms/number-input';
import { ClrRadioModule } from '@clr/angular/forms/radio';
import { ClrSelectModule } from '@clr/angular/forms/select';
import {
  ClarityIcons,
  ClrIcon,
  exclamationCircleIcon,
  filterIcon,
  plusIcon,
  timesIcon,
  trashIcon,
  treeViewIcon,
} from '@clr/angular/icon';
import { ClrPopoverModuleNext } from '@clr/angular/popover/common';
import { ClrTooltipModule } from '@clr/angular/popover/tooltip';
import { CdkTrapFocusModule } from '@clr/angular/utils';

import { ClrAdvancedFilters } from './advanced-filters';
import { ClrAdvancedFiltersEditor } from './editor/advanced-filters-editor';
import { ClrAdvancedFiltersError } from './editor/advanced-filters-error.directive';
import { ClrAdvancedFiltersFilter } from './filter/advanced-filters-filter';
import { ClrAdvancedFiltersAddFilter } from './group/advanced-filters-add-filter';
import { ClrAdvancedFiltersGroup } from './group/advanced-filters-group';
import { ClrAdvancedFiltersPill } from './pills/advanced-filters-pill';
import { ClrAdvancedFiltersPillAdd } from './pills/advanced-filters-pill-add';
import { ClrAdvancedFiltersPillEditor } from './pills/advanced-filters-pill-editor';
import { ClrAdvancedFiltersPills } from './pills/advanced-filters-pills';
import { ClrAdvancedFiltersValue } from './value/advanced-filters-value';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ClrTreeViewModule,
    ClrPopoverModuleNext,
    ClrTooltipModule,
    CdkTrapFocusModule,
    ClrCommonFormsModule,
    ClrComboboxModule,
    ClrSelectModule,
    ClrInputModule,
    ClrNumberInputModule,
    ClrRadioModule,
    ClrCheckboxModule,
    ClrDatepickerModule,
    ClrIcon,
    ClrLabel,
    ClrBadge,
  ],
  declarations: [
    ClrAdvancedFilters,
    ClrAdvancedFiltersGroup,
    ClrAdvancedFiltersAddFilter,
    ClrAdvancedFiltersFilter,
    ClrAdvancedFiltersEditor,
    ClrAdvancedFiltersValue,
    ClrAdvancedFiltersError,
    ClrAdvancedFiltersPills,
    ClrAdvancedFiltersPill,
    ClrAdvancedFiltersPillAdd,
    ClrAdvancedFiltersPillEditor,
  ],
  exports: [ClrAdvancedFilters],
})
export class ClrAdvancedFiltersModule {
  constructor() {
    ClarityIcons.addIcons(filterIcon, treeViewIcon, trashIcon, timesIcon, exclamationCircleIcon, plusIcon);
  }
}

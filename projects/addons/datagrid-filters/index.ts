/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

export { CompositeFiltersComponent } from './composite-filters.component';
export { DataGridFiltersComponent } from './datagrid-filters.component';
export {
  /**
   * @deprecated Use AppfxDatagridFiltersModule import instead.
   */
  AppfxDatagridFiltersModule as DatagridFiltersModule,
} from './datagrid-filters.module';
export { AppfxDatagridFiltersModule } from './datagrid-filters.module';
export { DatagridFiltersStrings } from './datagrid-filters-strings.service';
export { ComparisonOperator, FilterMode, LogicalOperator, Unit } from './model/datagrid-filters.enums';
export {
  DateTimePropertyDefinition,
  EnumPropertyDefinition,
  FilterablePropertyDefinition,
  NumericPropertyDefinition,
  PropertyFilter,
  PropertyPredicate,
  StringPropertyDefinition,
} from './model/datagrid-filters.interfaces';

// FIXME
// Unsupported private class FilterFormComponent.
// This class is visible to consumers via AppfxDatagridFiltersModule -> FilterFormComponent,
// but is not exported from the top-level library entrypoint.
export { FilterFormComponent } from './advanced-filters/filter-form.component';

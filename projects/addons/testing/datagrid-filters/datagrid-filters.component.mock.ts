/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FilterablePropertyDefinition, FilterMode, PropertyFilter } from '@clr/addons/datagrid-filters';

@Component({
  selector: 'appfx-datagrid-filters',
  standalone: false,
  template: '',
})
export class MockDatagridFiltersComponent {
  @Input() filterMode = FilterMode.Quick;

  @Input() filterableProperties: FilterablePropertyDefinition[];

  @Output() searchTermChange = new EventEmitter<string>();

  @Output() propertyFiltersChange = new EventEmitter<PropertyFilter[]>();
}

@Component({
  selector: 'appfx-datagrid-filters',
  standalone: true,
  template: '',
})
export class MockDatagridFiltersStandaloneComponent extends MockDatagridFiltersComponent {}

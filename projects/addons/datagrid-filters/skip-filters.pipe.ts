/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Pipe, PipeTransform } from '@angular/core';

import { FilterablePropertyDefinition } from './model/datagrid-filters.interfaces';

/**
 * Pipe used to limit available filter options in a select container.
 * This is needed in order to prevent applying the same filter more than once
 */
@Pipe({
  name: 'skipFilter',
  standalone: false,
})
export class SkipFiltersPipe implements PipeTransform {
  transform(items: FilterablePropertyDefinition[], propertyDefinitions?: FilterablePropertyDefinition[]): any {
    return propertyDefinitions
      ? items.filter((item: FilterablePropertyDefinition) => !propertyDefinitions.includes(item))
      : items;
  }
}

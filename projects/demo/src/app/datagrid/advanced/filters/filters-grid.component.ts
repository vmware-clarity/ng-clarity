/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppfxDatagridModule, ColumnDefinition } from '@clr/addons/datagrid';
import {
  ComparisonOperator,
  EnumPropertyDefinition,
  FilterablePropertyDefinition,
  FilterMode,
  PropertyFilter,
  StringPropertyDefinition,
} from '@clr/addons/datagrid-filters';
import { ClrSelectModule, SelectionType } from '@clr/angular';

import { CATEGORY_ENUM_VALUES } from './assets/category-enum-values';
import { Inventory, VmItem } from '../inventory/inventory';

@Component({
  imports: [AppfxDatagridModule, ClrSelectModule, FormsModule],
  standalone: true,
  templateUrl: 'filters-grid.component.html',
  providers: [Inventory],
})
export class FiltersGridComponent {
  protected readonly selectionType = SelectionType.None;
  protected readonly columns: ColumnDefinition<VmItem>[] = [
    {
      displayName: 'VM Name',
      field: 'name',
    },
    {
      displayName: 'State',
      field: 'state',
    },
    {
      displayName: 'Status',
      field: 'status',
    },
    {
      displayName: 'Used space',
      field: 'usedSpace',
    },
    {
      displayName: 'Category',
      field: 'event',
    },
  ];

  protected filteredItems: VmItem[] = [];
  protected allItems: VmItem[] = [];
  protected filterableProperties: FilterablePropertyDefinition[] = [];
  protected readonly FilterMode = FilterMode;
  protected selectedFilterMode: FilterMode = FilterMode.AdvancedOnly;

  constructor(private inventory: Inventory) {
    inventory.reset();
    this.allItems = inventory.allItems;
    this.filteredItems = this.allItems;
    this.initFilterableProperties();
  }

  onAdvancedFilterChange(filterCriteria: PropertyFilter[]): void {
    this.filteredItems = this.allItems;

    if (filterCriteria?.length > 0) {
      filterCriteria
        .filter(propFilter => propFilter?.criteria?.length > 0)
        .forEach(propFilter => {
          const filteredItems: VmItem[] = [];
          propFilter.criteria.forEach(predicate => {
            if (predicate.filterableProperty.property) {
              filteredItems.push(
                ...this.filteredItems.filter(item => {
                  return this.applyOperatorFilter(
                    item[predicate.filterableProperty.property],
                    predicate.value,
                    predicate.operator
                  );
                })
              );
            }
          });

          this.filteredItems = filteredItems;
        });
    }
  }

  protected onFilterModeChange(filterMode: string): void {
    this.filteredItems = this.allItems;

    if (filterMode === FilterMode.Quick.toString()) {
      this.selectedFilterMode = FilterMode.Quick;
    } else if (filterMode === FilterMode.Advanced.toString()) {
      this.selectedFilterMode = FilterMode.Advanced;
    } else if (filterMode === FilterMode.AdvancedOnly.toString()) {
      this.selectedFilterMode = FilterMode.AdvancedOnly;
    } else {
      this.selectedFilterMode = undefined;
    }
  }

  protected onSearchTermChange(searchTerm: string): void {
    if (!searchTerm || searchTerm.trim() === '') {
      this.filteredItems = this.allItems;
    }

    const lowerCaseSearch = searchTerm.toLowerCase();
    this.filteredItems = this.allItems.filter((item: VmItem) =>
      [item.name, item.state, item.status, item.usedSpace].some(field => field.toLowerCase().includes(lowerCaseSearch))
    );
  }

  private initFilterableProperties(): void {
    const stringNameProperty = new StringPropertyDefinition('VM Name', 'name');

    const stateEnumMap = new Map<string, string>();
    stateEnumMap.set('Powered On', 'Powered On');
    stateEnumMap.set('Powered Off', 'Powered Off');
    const singleSelectStateProperty = new EnumPropertyDefinition('State', 'state', stateEnumMap, true);

    const enumStatusMap = new Map<string, string>();
    enumStatusMap.set('Normal', 'Normal');
    enumStatusMap.set('Warning', 'Warning');
    enumStatusMap.set('Alert', 'Alert');
    const enumProperty = new EnumPropertyDefinition('Status', 'status', enumStatusMap);

    const categoryEnumProp = new EnumPropertyDefinition(
      'Category',
      'event',
      new Map(Object.entries(CATEGORY_ENUM_VALUES)),
      false,
      true,
      true,
      true
    );

    this.filterableProperties.push(stringNameProperty, singleSelectStateProperty, enumProperty, categoryEnumProp);
  }

  private applyOperatorFilter(item: string, predicateValue: string, operator: ComparisonOperator): boolean {
    if (operator === ComparisonOperator.Equals) {
      return item === predicateValue;
    } else if (operator === ComparisonOperator.DoesNotEqual) {
      return item !== predicateValue;
    } else if (operator === ComparisonOperator.Contains) {
      return item.indexOf(predicateValue) >= 0;
    } else if (operator === ComparisonOperator.DoesNotContain) {
      return item.indexOf(predicateValue) < 0;
    } else if (operator === ComparisonOperator.StartsWith) {
      return item.startsWith(predicateValue);
    } else if (operator === ComparisonOperator.EndsWith) {
      return item.endsWith(predicateValue);
    } else if (operator === ComparisonOperator.IsEmpty) {
      return !item;
    }

    return true;
  }
}

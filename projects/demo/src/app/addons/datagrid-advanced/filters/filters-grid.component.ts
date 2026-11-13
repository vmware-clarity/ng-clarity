/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, Inject, Injectable } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppfxDatagridModule, ColumnDefinition } from '@clr/addons/datagrid';
import {
  AppfxDatagridFiltersModule,
  ComparisonOperator,
  DatagridFiltersUserService,
  DateTimePropertyDefinition,
  EnumPropertyDefinition,
  FilterablePropertyDefinition,
  FilterMode,
  LogicalOperator,
  PropertyFilter,
  PropertyPredicate,
  StringPropertyDefinition,
  UserPropertyDefinition,
} from '@clr/addons/datagrid-filters';
import { ClarityModule, SelectionType } from '@clr/angular';
import { Observable, throwError, timer } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { CATEGORY_ENUM_VALUES } from './assets/category-enum-values';
import { Inventory, VmItem } from '../inventory/inventory';

@Injectable()
export class CustomUserService extends DatagridFiltersUserService {
  errorRetrievingDomains = false;
  errorRetrievingUsers = false;

  private readonly error = new HttpErrorResponse({
    error: 'Internal Server Error',
    status: 500,
    statusText: 'Server Error',
  });

  private readonly domainUsers: Record<string, string[]> = {
    'CORP.EXAMPLE': this.generateUsers('CORP.EXAMPLE', [
      'admin',
      'john.doe',
      'svc-backup',
      'svc-deploy',
      'alice.wong',
      'bob.martin',
      'carol.jones',
      'david.lee',
      'emma.clark',
      'frank.miller',
      'grace.kim',
      'henry.chen',
      'iris.patel',
      'jack.brown',
      'karen.davis',
      'leo.garcia',
      'mia.wilson',
      'noah.taylor',
      'olivia.moore',
      'peter.white',
      'quinn.hall',
      'rachel.allen',
      'sam.young',
      'tina.king',
      'uma.scott',
      'victor.hill',
    ]),
    'CLOUD.EXAMPLE': this.generateUsers('CLOUD.EXAMPLE', [
      'jane.smith',
      'admin',
      'ops-monitor',
      'root',
      'deploy-bot',
      'ci-runner',
      'diana.ross',
      'eric.johnson',
      'fiona.li',
      'george.harris',
      'hannah.wright',
      'ian.lopez',
      'julia.robinson',
      'kevin.walker',
      'laura.martinez',
      'mike.anderson',
      'nina.thomas',
      'oscar.jackson',
    ]),
    'DEV.EXAMPLE': this.generateUsers('DEV.EXAMPLE', [
      'svc-audit',
      'developer',
      'qa-lead',
      'devops',
      'intern.alex',
      'intern.jamie',
      'tech-lead',
      'pm.sarah',
      'designer.max',
      'analyst.riya',
      'support.tom',
      'docs.writer',
    ]),
  };

  getDomains(): Observable<string[]> {
    if (this.errorRetrievingDomains) {
      return timer(1000).pipe(switchMap(() => throwError(() => this.error)));
    }
    return timer(1000).pipe(map(() => Object.keys(this.domainUsers)));
  }

  searchUsers(searchTerm: string, domain: string): Observable<string[]> {
    if (this.errorRetrievingUsers) {
      return timer(1000).pipe(switchMap(() => throwError(() => this.error)));
    }
    const users = this.domainUsers[domain] || [];
    const lower = searchTerm.toLowerCase();
    return timer(500).pipe(map(() => users.filter(u => u.toLowerCase().includes(lower))));
  }

  private generateUsers(domain: string, names: string[]): string[] {
    return names.map(n => `${n}@${domain}`);
  }
}

@Component({
  imports: [AppfxDatagridModule, AppfxDatagridFiltersModule, ClarityModule, FormsModule],
  standalone: true,
  templateUrl: 'filters-grid.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  providers: [Inventory, { provide: DatagridFiltersUserService, useClass: CustomUserService }],
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
      displayName: 'Priority',
      field: 'priority',
    },
    {
      displayName: 'Used space',
      field: 'usedSpace',
    },
    {
      displayName: 'Category',
      field: 'event',
    },
    {
      displayName: 'User',
      field: 'user',
    },
    {
      displayName: 'Created',
      field: 'creation',
    },
    {
      displayName: 'Last modified',
      field: 'modified',
    },
  ];

  protected filteredItems: VmItem[] = [];
  protected allItems: VmItem[] = [];
  protected filterableProperties: FilterablePropertyDefinition[] = [];
  protected predefinedFilters: FilterablePropertyDefinition[] = [];
  protected semiPredefinedFilters: EnumPropertyDefinition[] = [];
  protected toggleFilters: PropertyFilter[] = [];
  protected presetFilters: PropertyFilter[] = [];
  protected predefinedFilteredItems: VmItem[] = [];
  protected combinedFilteredItems: VmItem[] = [];
  protected readonly FilterMode = FilterMode;
  protected selectedFilterMode: FilterMode = FilterMode.AdvancedOnly;
  protected errorRetrievingDomains = false;
  protected errorRetrievingUsers = false;
  private searchTerm = '';
  private advancedCriteria: PropertyFilter[] = [];
  private combinedSearchTerm = '';
  private combinedCriteria: PropertyFilter[] = [];

  constructor(
    private inventory: Inventory,
    @Inject(DatagridFiltersUserService) private userService: CustomUserService
  ) {
    inventory.reset();
    this.allItems = inventory.allItems;
    this.filteredItems = this.allItems;
    this.initFilterableProperties();
    // The predefined filters grid is filled by the filter bar: it emits the preset filters once at start-up.
    this.combinedFilteredItems = this.allItems;
  }

  protected get isErrorRetrievingDomains(): boolean {
    return this.errorRetrievingDomains;
  }

  protected set isErrorRetrievingDomains(value: boolean) {
    this.errorRetrievingDomains = value;
    this.userService.errorRetrievingDomains = value;
  }

  protected get isErrorRetrievingUsers(): boolean {
    return this.errorRetrievingUsers;
  }

  protected set isErrorRetrievingUsers(value: boolean) {
    this.errorRetrievingUsers = value;
    this.userService.errorRetrievingUsers = value;
  }

  onAdvancedFilterChange(filterCriteria: PropertyFilter[]): void {
    this.advancedCriteria = filterCriteria;
    this.filteredItems = this.applySearch(this.filterItems(this.advancedCriteria), this.searchTerm);
  }

  protected onPredefinedFilterChange(filterCriteria: PropertyFilter[]): void {
    this.predefinedFilteredItems = this.filterItems(filterCriteria);
  }

  // Combined filter: the host applies the search and the pills together (AND).
  protected onCombinedSearchTermChange(searchTerm: string): void {
    this.combinedSearchTerm = searchTerm;
    this.updateCombinedItems();
  }

  protected onCombinedFilterChange(filterCriteria: PropertyFilter[]): void {
    this.combinedCriteria = filterCriteria;
    this.updateCombinedItems();
  }

  protected onFilterModeChange(filterMode: string): void {
    this.filteredItems = this.allItems;
    this.searchTerm = '';
    this.advancedCriteria = [];

    if (filterMode === FilterMode.Combined.toString()) {
      this.selectedFilterMode = FilterMode.Combined;
    } else if (filterMode === FilterMode.Quick.toString()) {
      this.selectedFilterMode = FilterMode.Quick;
    } else if (filterMode === FilterMode.Advanced.toString()) {
      this.selectedFilterMode = FilterMode.Advanced;
    } else if (filterMode === FilterMode.AdvancedOnly.toString()) {
      this.selectedFilterMode = FilterMode.AdvancedOnly;
    } else {
      this.selectedFilterMode = undefined;
    }
  }

  // The search and the advanced filters are combined with AND. In the other modes the
  // component clears one side when switching, so this also covers Quick and Advanced.
  protected onSearchTermChange(searchTerm: string): void {
    this.searchTerm = searchTerm ?? '';
    this.filteredItems = this.applySearch(this.filterItems(this.advancedCriteria), this.searchTerm);
  }

  private updateCombinedItems(): void {
    this.combinedFilteredItems = this.applySearch(this.filterItems(this.combinedCriteria), this.combinedSearchTerm);
  }

  private applySearch(items: VmItem[], searchTerm: string): VmItem[] {
    const search = searchTerm.trim().toLowerCase();
    return search
      ? items.filter((item: VmItem) =>
          [item.name, item.state, item.status, item.usedSpace].some(field => field.toLowerCase().includes(search))
        )
      : items;
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

    const priorityProperty = new EnumPropertyDefinition(
      'Priority',
      'priority',
      new Map(['Low', 'Medium', 'High'].map(value => [value, value]))
    );

    const categoryEnumProp = new EnumPropertyDefinition(
      'Category',
      'event',
      new Map(Object.entries(CATEGORY_ENUM_VALUES)),
      false,
      true,
      true,
      true
    );

    const userProp = new UserPropertyDefinition('User', 'user');
    const createdProp = new DateTimePropertyDefinition('Created', 'creation');
    // includeSeconds: the time inputs take seconds, and the pill shows them.
    const modifiedProp = new DateTimePropertyDefinition('Last modified', 'modified', undefined, true);

    this.filterableProperties.push(
      stringNameProperty,
      singleSelectStateProperty,
      enumProperty,
      priorityProperty,
      categoryEnumProp,
      userProp,
      createdProp,
      modifiedProp
    );

    this.predefinedFilters = [stringNameProperty, enumProperty];
    // Category as option pills for a few common events: Category: (User Login) (User Logout) (Password Changed)
    const categoryOptions = new Map(
      ['auth.login', 'auth.logout', 'auth.password_change'].map(key => [key, CATEGORY_ENUM_VALUES[key]])
    );
    // Priority: (Low) (Medium) (High) and Category: (User Login) (User Logout) (Password Changed)
    this.semiPredefinedFilters = [priorityProperty, new EnumPropertyDefinition('Category', 'event', categoryOptions)];
    // On/off filter: OFF = not applied, ON = State equals Powered On.
    const stateProperty = new EnumPropertyDefinition('State', 'state', stateEnumMap);
    this.toggleFilters = [
      {
        operator: LogicalOperator.Or,
        criteria: [{ filterableProperty: stateProperty, operator: ComparisonOperator.Equals, value: 'Powered On' }],
      },
    ];
    this.presetFilters = [
      {
        operator: LogicalOperator.Or,
        criteria: ['linux', 'windows', 'ubuntu'].map(value => ({
          filterableProperty: stringNameProperty,
          operator: ComparisonOperator.Contains,
          value,
        })),
      },
      {
        operator: LogicalOperator.Or,
        criteria: ['Warning', 'Alert'].map(value => ({
          filterableProperty: enumProperty,
          operator: ComparisonOperator.Equals,
          value,
        })),
      },
    ];
  }

  private filterItems(filterCriteria: PropertyFilter[]): VmItem[] {
    const activeFilters = (filterCriteria ?? []).filter(propFilter => propFilter?.criteria?.length > 0);
    return this.allItems.filter(item =>
      activeFilters.every(propFilter => {
        const matches = (predicate: PropertyPredicate) =>
          !!predicate.filterableProperty.property &&
          (predicate.filterableProperty instanceof DateTimePropertyDefinition
            ? this.applyDateFilter(item[predicate.filterableProperty.property], predicate.value, predicate.operator)
            : this.applyOperatorFilter(
                item[predicate.filterableProperty.property],
                predicate.value,
                predicate.operator
              ));
        return propFilter.operator === LogicalOperator.And
          ? propFilter.criteria.every(matches)
          : propFilter.criteria.some(matches);
      })
    );
  }

  // Date filters emit date-time strings; compare them as timestamps.
  private applyDateFilter(item: string, predicateValue: string, operator: ComparisonOperator): boolean {
    if (operator === ComparisonOperator.IsEmpty) {
      return !item;
    }
    const itemTime = Date.parse(item);
    const filterTime = Date.parse(predicateValue);
    if (isNaN(itemTime) || isNaN(filterTime)) {
      return false;
    }
    switch (operator) {
      case ComparisonOperator.Equals:
        return itemTime === filterTime;
      case ComparisonOperator.Before:
      case ComparisonOperator.LessThan:
        return itemTime < filterTime;
      case ComparisonOperator.BeforeOrEqualTo:
      case ComparisonOperator.LessThanOrEqualTo:
        return itemTime <= filterTime;
      case ComparisonOperator.After:
      case ComparisonOperator.GreaterThan:
        return itemTime > filterTime;
      case ComparisonOperator.AfterOrEqualTo:
      case ComparisonOperator.GreaterThanOrEqualTo:
        return itemTime >= filterTime;
      default:
        return true;
    }
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

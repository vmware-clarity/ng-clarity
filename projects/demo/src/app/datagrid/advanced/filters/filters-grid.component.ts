/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { HttpErrorResponse } from '@angular/common/http';
import { Component, Inject, Injectable } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppfxDatagridModule, ColumnDefinition, SelectionType } from '@clr/addons/datagrid';
import {
  ComparisonOperator,
  DatagridFiltersUserService,
  EnumPropertyDefinition,
  FilterablePropertyDefinition,
  FilterMode,
  PropertyFilter,
  StringPropertyDefinition,
  UserPropertyDefinition,
} from '@clr/addons/datagrid-filters';
import { ClarityModule } from '@clr/angular';
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
  imports: [AppfxDatagridModule, ClarityModule, FormsModule],
  standalone: true,
  templateUrl: 'filters-grid.component.html',
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
  ];

  protected filteredItems: VmItem[] = [];
  protected allItems: VmItem[] = [];
  protected filterableProperties: FilterablePropertyDefinition[] = [];
  protected readonly FilterMode = FilterMode;
  protected selectedFilterMode: FilterMode = FilterMode.AdvancedOnly;
  protected errorRetrievingDomains = false;
  protected errorRetrievingUsers = false;

  constructor(
    private inventory: Inventory,
    @Inject(DatagridFiltersUserService) private userService: CustomUserService
  ) {
    inventory.reset();
    this.allItems = inventory.allItems;
    this.filteredItems = this.allItems;
    this.initFilterableProperties();
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

    const userProp = new UserPropertyDefinition('User', 'user');

    this.filterableProperties.push(
      stringNameProperty,
      singleSelectStateProperty,
      enumProperty,
      categoryEnumProp,
      userProp
    );
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

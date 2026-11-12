/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { DatagridFiltersDateTimeDemoComponent } from './ng/date-time-filters';
import { DatagridFiltersModesDemoComponent } from './ng/filter-modes';
import { DatagridFiltersPredefinedDemoComponent } from './ng/predefined-filters';
import { DatagridFiltersSemiPredefinedDemoComponent } from './ng/semi-predefined-filters';
import { DatagridFiltersToggleDemoComponent } from './ng/toggle-filters';
import { DatagridFiltersTwoWayDemoComponent } from './ng/two-way-binding';
import { AiSkillComponent } from '../../../shared/ai-skill/ai-skill.component';
import { CodeSnippetComponent } from '../../../shared/code-snippet/code-snippet.component';
import { DocTabComponent } from '../../../shared/doc-tabs/doc-tab.component';
import { DocTabsComponent } from '../../../shared/doc-tabs/doc-tabs.component';
import { StackblitzExampleComponent } from '../../../shared/stackblitz-example/stackblitz-example.component';
import { ThemedImageComponent } from '../../../shared/themed-image/themed-image.component';
import { ClarityDocComponent } from '../clarity-doc';

// StackBlitz loads the class as `ExampleComponent` in `example.component.ts`, with the template in `example.component.html`.
const replaceComponentName = (file: string) =>
  file
    .replace(/(export class )\w+/, '$1ExampleComponent')
    .replace(/selector: '[^']+'/, "selector: 'app-example'")
    .replace(/templateUrl: '[^']+'/, "templateUrl: './example.component.html'");

const AppliedFiltersTs = require('!raw-loader!./ng/applied-filters.ts').default;
const DateTimeHtml = require('!raw-loader!./ng/date-time-filters.html').default;
const DateTimeTs = replaceComponentName(require('!raw-loader!./ng/date-time-filters.ts').default);
const FilterModesHtml = require('!raw-loader!./ng/filter-modes.html').default;
const FilterModesTs = replaceComponentName(require('!raw-loader!./ng/filter-modes.ts').default);
const PredefinedHtml = require('!raw-loader!./ng/predefined-filters.html').default;
const PredefinedTs = replaceComponentName(require('!raw-loader!./ng/predefined-filters.ts').default);
const SemiPredefinedHtml = require('!raw-loader!./ng/semi-predefined-filters.html').default;
const SemiPredefinedTs = replaceComponentName(require('!raw-loader!./ng/semi-predefined-filters.ts').default);
const ToggleHtml = require('!raw-loader!./ng/toggle-filters.html').default;
const ToggleTs = replaceComponentName(require('!raw-loader!./ng/toggle-filters.ts').default);
const TwoWayHtml = require('!raw-loader!./ng/two-way-binding.html').default;
const TwoWayTs = replaceComponentName(require('!raw-loader!./ng/two-way-binding.ts').default);
const VmPropertiesTs = require('!raw-loader!./ng/vm-properties.ts').default;

const DATAGRID_FILTERS_EXAMPLE = `
import { HttpErrorResponse } from '@angular/common/http';
import { Component, EventEmitter, Inject, Injectable, OnInit, Output } from '@angular/core';

import {
  ComparisonOperator,
  DatagridFiltersUserService,
  DateTimePropertyDefinition,
  EnumPropertyDefinition,
  FilterablePropertyDefinition,
  FilterMode,
  LogicalOperator,
  NumericPropertyDefinition,
  PropertyFilter,
  PropertyPredicate,
  StringPropertyDefinition,
  Unit,
  UserPropertyDefinition,
} from '@clr/addons/datagrid-filters';
import { Observable, throwError, timer } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

// Provide a custom user service for the User filter
@Injectable()
export class CustomUserService extends DatagridFiltersUserService {
  getDomains(): Observable<string[]> {
    return timer(1000).pipe(map(() => ['CORP.EXAMPLE', 'CLOUD.EXAMPLE']));
  }

  searchUsers(searchTerm: string, domain: string): Observable<string[]> {
    const users = ['admin', 'john.doe', 'jane.smith'];
    return timer(500).pipe(
      map(() => users.filter(u => u.toLowerCase().includes(searchTerm.toLowerCase())))
    );
  }
}

@Component({
  templateUrl: 'datagrid-filters-demo.component.html',
  providers: [
    { provide: DatagridFiltersUserService, useClass: CustomUserService },
  ],
})
export class DatagridFiltersDemoComponent implements OnInit {
  @Output()
  public searchTermChange: EventEmitter<string> = new EventEmitter<string>();

  @Output()
  public advancedFilterChange: EventEmitter<PropertyFilter[]> = new EventEmitter<PropertyFilter[]>();

  public presetFilters: PropertyFilter[];
  public filterMode: FilterMode = FilterMode.Advanced;
  public filterableProperties: FilterablePropertyDefinition[] = [];

  public ngOnInit() {
    const stringNameProperty = new StringPropertyDefinition('Name', 'name');
    const stringAddressProperty = new StringPropertyDefinition('Address', 'address');

    const dateTimeProperty = new DateTimePropertyDefinition('Last change', 'lastChanged');

    const numericCustomerCountProperty = new NumericPropertyDefinition(
      'Number of customers',
      'customersCount'
    );
    const numericCapacityProperty = new NumericPropertyDefinition(
      'Capacity',
      'capacity',
      undefined,
      Unit.MB
    );

    const enumValuesMap = new Map<string, string>();
    enumValuesMap.set('green', 'Green');
    enumValuesMap.set('yellow', 'Yellow');
    enumValuesMap.set('orange', 'Orange');
    enumValuesMap.set('red', 'Red');
    const enumProperty = new EnumPropertyDefinition('Status', 'status', enumValuesMap);
    const singleSelectEnumProperty = new EnumPropertyDefinition('Color', 'color', enumValuesMap, true);

    // Searchable enum with many values
    const categoryValues = new Map<string, string>([
      ['auth.login', 'User Login'],
      ['resource.created', 'Resource Created'],
      ['deploy.completed', 'Deployment Completed'],
      // ... many more values
    ]);
    const categoryEnumProp = new EnumPropertyDefinition(
      'Category',
      'category',
      categoryValues,
      false, // multi-select
      true, // searchable
      true, // enableSelectAll
      true // allowNotInOperator
    );

    const preSelectedFilter = new PropertyFilter();
    preSelectedFilter.operator = LogicalOperator.And;
    const predicate = new PropertyPredicate();
    predicate.filterableProperty = categoryEnumProp;
    predicate.operator = ComparisonOperator.DoesNotEqual;
    predicate.value = [...categoryValues.keys()][0];
    preSelectedFilter.criteria = [predicate];

    this.presetFilters = [preSelectedFilter];

    // User filter — requires DatagridFiltersUserService
    const userProp = new UserPropertyDefinition('User', 'user');

    this.filterableProperties.push(
      stringNameProperty,
      stringAddressProperty,
      dateTimeProperty,
      numericCustomerCountProperty,
      numericCapacityProperty,
      enumProperty,
      singleSelectEnumProperty,
      categoryEnumProp,
      userProp
    );
  }

  public onAdvancedSearchTermChange(searchTerm: string): void {
    this.searchTermChange.emit(searchTerm);
  }

  public onAdvancedFilterCriteriaChange(filterCriteria: PropertyFilter[]): void {
    this.advancedFilterChange.emit(filterCriteria);
  }
}
`;

// Files the examples import, added next to `example.component.ts` in StackBlitz.
const additionalFiles = {
  'applied-filters.ts': AppliedFiltersTs,
  'vm-properties.ts': VmPropertiesTs,
};

@Component({
  selector: 'clr-filters-demo',
  templateUrl: './filters.demo.html',
  host: {
    '[class.content-area]': 'true',
    '[class.dox-content-panel]': 'true',
  },
  changeDetection: ChangeDetectionStrategy.Eager,
  imports: [
    DocTabsComponent,
    DocTabComponent,
    ThemedImageComponent,
    CodeSnippetComponent,
    StackblitzExampleComponent,
    AiSkillComponent,
    RouterLink,
    DatagridFiltersModesDemoComponent,
    DatagridFiltersPredefinedDemoComponent,
    DatagridFiltersSemiPredefinedDemoComponent,
    DatagridFiltersToggleDemoComponent,
    DatagridFiltersTwoWayDemoComponent,
    DatagridFiltersDateTimeDemoComponent,
  ],
})
export class FiltersDemo extends ClarityDocComponent {
  filterModesHtml = FilterModesHtml;
  filterModesTs = FilterModesTs;
  predefinedHtml = PredefinedHtml;
  predefinedTs = PredefinedTs;
  semiPredefinedHtml = SemiPredefinedHtml;
  semiPredefinedTs = SemiPredefinedTs;
  toggleHtml = ToggleHtml;
  toggleTs = ToggleTs;
  twoWayHtml = TwoWayHtml;
  twoWayTs = TwoWayTs;
  dateTimeHtml = DateTimeHtml;
  dateTimeTs = DateTimeTs;
  vmPropertiesTs = VmPropertiesTs;
  appliedFiltersTs = AppliedFiltersTs;
  additionalFiles = additionalFiles;
  propertyDefinitionsExample = DATAGRID_FILTERS_EXAMPLE;

  constructor() {
    super('filters');
  }
}

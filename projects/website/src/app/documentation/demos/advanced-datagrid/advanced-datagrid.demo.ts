/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import {
  circleIcon,
  ClarityIcons,
  ClrAccordionModule,
  ClrAlertModule,
  ClrIfExpanded,
  dotCircleIcon,
  errorStandardIcon,
  successStandardIcon,
} from '@clr/angular';
import { ADVANCED_DATAGRID_EXAMPLES } from '@clr/examples/advanced-datagrid';

import { AiSkillComponent } from '../../../shared/ai-skill/ai-skill.component';
import { CodeSnippetComponent } from '../../../shared/code-snippet/code-snippet.component';
import { DocExampleComponent } from '../../../shared/doc-example/doc-example.component';
import { DocTabComponent } from '../../../shared/doc-tabs/doc-tab.component';
import { DocTabsComponent } from '../../../shared/doc-tabs/doc-tabs.component';
import { LinkCardsLink } from '../../../shared/link-cards/link-cards.component';
import { ThemedImageComponent } from '../../../shared/themed-image/themed-image.component';
import { ClarityDocComponent } from '../clarity-doc';
import { multiStepPatternLink } from '../pattern-links';

const BASIC_DATAGRID_EXAMPLE = `
<appfx-datagrid [columns]="columns" [gridItems]="gridItems"></appfx-datagrid>
// Component Class
export class ExampleComponent {
  public gridItems: MyInterface[] = [
    { name: "Peter", color: "green" },
    { name: "Peter", color: "green" },
    { name: "Maria", color: "red" },
  ];

  public columns: ColumnDefinition<MyInterface>[] = [
    {
      displayName: "Person name",
      field: "name"
    },
    {
      displayName: "Eye color",
      field: "color"
    },
  ];
}
`;

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

@Component({
  selector: 'clr-advanced-datagrid-demo',
  templateUrl: './advanced-datagrid.demo.html',
  styleUrl: './advanced-datagrid.demo.scss',
  host: {
    '[class.content-area]': 'true',
    '[class.dox-content-panel]': 'true',
  },
  imports: [
    DocTabsComponent,
    DocTabComponent,
    ThemedImageComponent,
    CodeSnippetComponent,
    DocExampleComponent,
    AiSkillComponent,
    ClrAccordionModule,
    ClrIfExpanded,
    ClrAlertModule,
  ],
})
export class AdvancedDatagridDemo extends ClarityDocComponent {
  readonly examples = ADVANCED_DATAGRID_EXAMPLES;

  basicDatagridExample = BASIC_DATAGRID_EXAMPLE;
  datagridFiltersExample = DATAGRID_FILTERS_EXAMPLE;
  readonly patternLinks: LinkCardsLink[] = [multiStepPatternLink];

  constructor() {
    super('advanced-datagrid');
    ClarityIcons.addIcons(circleIcon, dotCircleIcon, successStandardIcon, errorStandardIcon);
  }
}

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
  ClrDatagridModule,
  ClrIfExpanded,
  dotCircleIcon,
  errorStandardIcon,
  successStandardIcon,
} from '@clr/angular';

import { ClientSideDatagridDemoComponent } from './ng/client-side';
import { CustomColumnDefinitionsDemoComponent } from './ng/custom-column-definitions';
import { DetailPaneGridDemoComponent } from './ng/detail-pane';
import { DragDropGridDemoComponent } from './ng/drag-drop';
import { FiltersGridComponent } from './ng/filters';
import { PersistenceGridDemoComponent } from './ng/persistance';
import { ServerDrivenGridDemoComponent } from './ng/server-driven';
import { VirtualScrollGridDemoComponent } from './ng/virtual-scroll';
import { CodeSnippetComponent } from '../../../shared/code-snippet/code-snippet.component';
import { DocTabComponent } from '../../../shared/doc-tabs/doc-tab.component';
import { DocTabsComponent } from '../../../shared/doc-tabs/doc-tabs.component';
import { LinkCardsLink } from '../../../shared/link-cards/link-cards.component';
import { StackblitzExampleComponent } from '../../../shared/stackblitz-example/stackblitz-example.component';
import { ThemedImageComponent } from '../../../shared/themed-image/themed-image.component';
import { ClarityDocComponent } from '../clarity-doc';
import { multiStepPatternLink } from '../pattern-links';

const replaceComponentName = (file: string) => {
  file = file.replace(/(export class )\w+(\s*\{)/, '$1ExampleComponent$2');
  return file;
};

const ClientSideHtml = require('!raw-loader!./ng/client-side.html').default;
const ClientSideTs = replaceComponentName(require('!raw-loader!./ng/client-side.ts').default);
const CustomColumnDefinitionsHtml = require('!raw-loader!./ng/custom-column-definitions.html').default;
const CustomColumnDefinitionsTs = replaceComponentName(
  require('!raw-loader!./ng/custom-column-definitions.ts').default
);
const DetailPaneHtml = require('!raw-loader!./ng/detail-pane.html').default;
const DetailPaneTs = replaceComponentName(require('!raw-loader!./ng/detail-pane.ts').default);
const DragDropHtml = require('!raw-loader!./ng/drag-drop.html').default;
const DragDropTs = replaceComponentName(require('!raw-loader!./ng/drag-drop.ts').default);
const FiltersHtml = require('!raw-loader!./ng/filters.html').default;
const FiltersTs = replaceComponentName(require('!raw-loader!./ng/filters.ts').default);
const PersistanceHtml = require('!raw-loader!./ng/persistance.html').default;
const PersistanceTs = replaceComponentName(require('!raw-loader!./ng/persistance.ts').default);
const ServerDrivenHtml = require('!raw-loader!./ng/server-driven.html').default;
const ServerDrivenTs = replaceComponentName(require('!raw-loader!./ng/server-driven.ts').default);
const VirtualScrollHtml = require('!raw-loader!./ng/virtual-scroll.html').default;
const VirtualScrollTs = replaceComponentName(require('!raw-loader!./ng/virtual-scroll.ts').default);

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

const additionalFiles = {
  'inventory/inventory.ts': require('!raw-loader!./ng/inventory/inventory.ts').default,
  'inventory/values.ts': require('!raw-loader!./ng/inventory/values.ts').default,
  'grid-config/grid-config-form.component.html': require('!raw-loader!./ng/grid-config/grid-config-form.component.html')
    .default,
  'grid-config/grid-config-form.component.ts': require('!raw-loader!./ng/grid-config/grid-config-form.component.ts')
    .default,
  'persistance-datagrid-local-storage.service.ts':
    require('!raw-loader!./ng/persistance-datagrid-local-storage.service.ts').default,
};

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
    ClrAccordionModule,
    ClrDatagridModule,
    ClrIfExpanded,
    ClientSideDatagridDemoComponent,
    StackblitzExampleComponent,
    ServerDrivenGridDemoComponent,
    VirtualScrollGridDemoComponent,
    CustomColumnDefinitionsDemoComponent,
    DetailPaneGridDemoComponent,
    DragDropGridDemoComponent,
    FiltersGridComponent,
    ClrAlertModule,
    PersistenceGridDemoComponent,
  ],
})
export class AdvancedDatagridDemo extends ClarityDocComponent {
  additionalFiles = additionalFiles;

  clientSideHtml = ClientSideHtml;
  clientSideTs = ClientSideTs;

  customColumnDefinitionsHtml = CustomColumnDefinitionsHtml;
  customColumnDefinitionsTs = CustomColumnDefinitionsTs;

  detailPaneHtml = DetailPaneHtml;
  detailPaneTs = DetailPaneTs;

  dragDropHtml = DragDropHtml;
  dragDropTs = DragDropTs;

  filtersHtml = FiltersHtml;
  filtersTs = FiltersTs;

  persistanceHtml = PersistanceHtml;
  persistanceTs = PersistanceTs;

  serverDrivenHtml = ServerDrivenHtml;
  serverDrivenTs = ServerDrivenTs;

  virtualScrollHtml = VirtualScrollHtml;
  virtualScrollTs = VirtualScrollTs;

  basicDatagridExample = BASIC_DATAGRID_EXAMPLE;
  datagridFiltersExample = DATAGRID_FILTERS_EXAMPLE;
  readonly patternLinks: LinkCardsLink[] = [multiStepPatternLink];

  constructor() {
    super('advanced-datagrid');
    ClarityIcons.addIcons(circleIcon, dotCircleIcon, successStandardIcon, errorStandardIcon);
  }
}

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

import { AdvancedDatagridDemoModule } from './advanced-datagrid.demo.module';
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

const ClientSideHtml = '';
const ClientSideTs = replaceComponentName('');
const CustomColumnDefinitionsHtml = '';
const CustomColumnDefinitionsTs = replaceComponentName('');
const DetailPaneHtml = '';
const DetailPaneTs = replaceComponentName('');
const DragDropHtml = '';
const DragDropTs = replaceComponentName('');
const FiltersHtml = '';
const FiltersTs = replaceComponentName('');
const PersistanceHtml = '';
const PersistanceTs = replaceComponentName('');
const ServerDrivenHtml = '';
const ServerDrivenTs = replaceComponentName('');
const VirtualScrollHtml = '';
const VirtualScrollTs = replaceComponentName('');

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
import { Component, EventEmitter, OnInit, Output } from '@angular/core';

import {
  DateTimePropertyDefinition,
  EnumPropertyDefinition,
  FilterablePropertyDefinition,
  FilterMode,
  NumericPropertyDefinition,
  PropertyFilter,
  StringPropertyDefinition,
  Unit,
} from '@clr/addons/datagrid-filters';

@Component({
  templateUrl: 'datagrid-filters-demo.component.html',
})
export class DatagridFiltersDemoComponent implements OnInit {
  /**
   * Event emitter to tell hosting view that search term, used for filtering
   * has changed.
   */
  @Output()
  public searchTermChange: EventEmitter<string> = new EventEmitter<string>();

  /**
   * Event emitter to tell hosting view that filtering criteria have changed.
   */
  @Output()
  public advancedFilterChange: EventEmitter<PropertyFilter[]> = new EventEmitter<PropertyFilter[]>();

  public filterMode: FilterMode = FilterMode.Advanced;
  public filterableProperties: FilterablePropertyDefinition[] = [];

  public ngOnInit() {
    const stringNameProperty: StringPropertyDefinition = new StringPropertyDefinition('Name', 'name');
    const stringAddressProperty: StringPropertyDefinition = new StringPropertyDefinition(
      'Address',
      'address'
    );

    const dateTimeProperty: DateTimePropertyDefinition = new DateTimePropertyDefinition(
      'Last change',
      'lastChanged'
    );

    const numericCustomerCountProperty: NumericPropertyDefinition = new NumericPropertyDefinition(
      'Number of customers',
      'customersCount'
    );
    const numericCapacityProperty: NumericPropertyDefinition = new NumericPropertyDefinition(
      'Capacity',
      'capacity',
      undefined, // default operators
      Unit.MB
    );

    const enumValuesMap: Map<string, string> = new Map<string, string>();
    enumValuesMap.set('green', 'Green');
    enumValuesMap.set('yellow', 'Yellow');
    enumValuesMap.set('orange', 'Orange');
    enumValuesMap.set('red', 'Red');
    const enumProperty: EnumPropertyDefinition = new EnumPropertyDefinition(
      'Status',
      'status',
      enumValuesMap
    );
    const singleSelectEnumProperty: EnumPropertyDefinition = new EnumPropertyDefinition(
      'Color',
      'color',
      enumValuesMap,
      true
    );

    this.filterableProperties.push(
      stringNameProperty,
      stringAddressProperty,
      dateTimeProperty,
      numericCustomerCountProperty,
      numericCapacityProperty,
      enumProperty,
      singleSelectEnumProperty
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
  'inventory/inventory.ts': '',
  'inventory/values.ts': '',
  'grid-config/grid-config-form.component.html': '',
  'grid-config/grid-config-form.component.ts': '',
  'persistance-datagrid-local-storage.service.ts': '',
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
    AdvancedDatagridDemoModule,
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

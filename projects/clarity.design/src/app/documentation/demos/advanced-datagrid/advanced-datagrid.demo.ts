/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import { circleIcon, ClarityIcons, dotCircleIcon, errorStandardIcon, successStandardIcon } from '@cds/core/icon';

import { LinkCardsLink } from '../../../shared/link-cards/link-cards.component';
import { ClarityDocComponent } from '../clarity-doc';
import { multiStepPatternLink } from '../pattern-links';

const replaceComponentName = (file: string) => {
  file = file.replace(/(export class )\w+(\s*\{)/, '$1ExampleComponent$2');
  return file;
};

/* eslint-disable @typescript-eslint/no-var-requires */
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
  standalone: false,
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

## Overview & Rationale

AppFx Datagrid Filters component provides an enhanced user experience for datagrid filtering.
It is expected to be hosted in the datagrid action bar and can be used in three modes - quick, advanced and advanced only. <br/>
Advanced modes allow users to build and manage complex filtering queries. Quick mode is suitable for quick search filtering.

#### Advanced Filter

![Datagrid Filters example screen](assets/appfx/datagrid-advanced-filter-overview.png)

#### Quick Filter

![Datagrid Filters example screen](assets/appfx/datagrid-quick-filter-overview.png)

## Component API

#### appfx-datagrid-filters

| Property                | Input/Output | Type                             | Description                                                                                                                                                                                                                         |
| ----------------------- | ------------ | -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `filterMode`            | Input        | `FilterMode`                     | Enum parameter with three options.<br/>FilterMode.Quick - only quick filter is activated.<br/>FilterMode.Advanced - both quick and advanced filters are activated.<br/>FilterMode.AdvancedOnly - Only advanced filter is activated. |
| `filterableProperties`  | Input        | `FilterablePropertyDefinition[]` | Array of properties, which are used for advanced filtering.<br/>Supported types: StringPropertyDefinition, NumericPropertyDefinition, EnumPropertyDefinition, DateTimePropertyDefinition                                            |
| `searchTermChange`      | Output       | `EventEmitter<string>`           | Emits when the quick filter changes. Triggered on `Enter` key press and/or automatically on every 2 sec when the user is typing in the search input.                                                                                |
| `propertyFiltersChange` | Output       | `EventEmitter<PropertyFilter[]>` | Emits when the advanced filter changes.                                                                                                                                                                                             |

#### FilterablePropertyDefinition

Base abstract class for filterable properties. Filterable properties are usually a subset of the datagrid columns.<br/>
List of subclasses: StringPropertyDefinition, NumericPropertyDefinition, EnumPropertyDefinition, DateTimePropertyDefinition.

| Property             | Type                   | Description                                                                                             |
| -------------------- | ---------------------- | ------------------------------------------------------------------------------------------------------- |
| `displayName`        | `string`               | Name as shown to users                                                                                  |
| `property`           | `string`               | Actual name of the property that is used for filtering                                                  |
| `supportedOperators` | `ComparisonOperator[]` | Optional. List of comparison operators. Can be used to override the default operators for the property. |

#### StringPropertyDefinition

Extends FilterablePropertyDefinition.

| Property          | Type              | Description                                                                                                                     |
| ----------------- | ----------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `singleCondition` | `boolean`         | Optional. Indicates that the property can be used with single condition only. Default: false                                    |
| `logicalOperator` | `LogicalOperator` | Optional. Indicates that the property supports only AND or OR logical operators. Default: undefined (supports both AND and OR). |

Default supported operators:

1. ComparisonOperator.Equals
2. ComparisonOperator.DoesNotEqual
3. ComparisonOperator.Contains<br/>
4. ComparisonOperator.DoesNotContain
5. ComparisonOperator.StartsWith
6. ComparisonOperator.EndsWith
7. ComparisonOperator.IsEmpty

#### EnumPropertyDefinition

Extends FilterablePropertyDefinition.

| Property       | Type                  | Description                                                                                       |
| -------------- | --------------------- | ------------------------------------------------------------------------------------------------- |
| `values`       | `Map<string, string>` | Enumeration key/value data to be used in the filter selection.                                    |
| `singleSelect` | `boolean`             | Optional. Indicates that the property should be used for single select filtering. Default: false. |

#### NumericPropertyDefinition

Extends FilterablePropertyDefinition.

| Property          | Type              | Description                                                                                                                     |
| ----------------- | ----------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| `singleCondition` | `boolean`         | Optional. Indicates that the property can be used with single condition only. Default: false.                                   |
| `logicalOperator` | `LogicalOperator` | Optional. Indicates that the property supports only AND or OR logical operators. Default: undefined (supports both AND and OR). |

Default supported operators:

1. ComparisonOperator.Equals
2. ComparisonOperator.DoesNotEqual
3. ComparisonOperator.LessThan
4. ComparisonOperator.LessThanOrEqualTo
5. ComparisonOperator.GreaterThan
6. ComparisonOperator.GreaterThanOrEqualTo
7. ComparisonOperator.IsEmpty

| Property | Type   | Description                                    |
| -------- | ------ | ---------------------------------------------- |
| `unit`   | `Unit` | Default unit of the property metric. Optional. |

### DateTimePropertyDefinition

Extends FilterablePropertyDefinition. Default supported operators:

1. ComparisonOperator.Equals
2. ComparisonOperator.Before
3. ComparisonOperator.BeforeOrEqualTo
4. ComparisonOperator.After
5. ComparisonOperator.AfterOrEqualTo
6. ComparisonOperator.CustomRange
7. ComparisonOperator.IsEmpty
8. ComparisonOperator.LastDay
9. ComparisonOperator.LastWeek
10. ComparisonOperator.LastMonth
11. ComparisonOperator.LastYear
12. ComparisonOperator.TimeSpan

### PropertyFilter

| Property   | Type                  | Description                                   |
| ---------- | --------------------- | --------------------------------------------- |
| `criteria` | `PropertyPredicate[]` | Filter criteria                               |
| `operator` | `LogicalOperator`     | Logical operator. Supported values are AND/OR |

### PropertyPredicate

| Property             | Type                           | Description                         |
| -------------------- | ------------------------------ | ----------------------------------- |
| `filterableProperty` | `FilterablePropertyDefinition` | Property that is used for filtering |
| `operator`           | `ComparisonOperator`           | Filtering operator                  |
| `value`              | `any`                          | Filter value                        |

### Example Code

datagrid-filters-demo.component.html

```html
<appfx-datagrid-filters
  [filterMode]="filterMode"
  [filterableProperties]="filterableProperties"
  (searchTermChange)="onAdvancedSearchTermChange($event)"
  (propertyFiltersChange)="onAdvancedFilterCriteriaChange($event)"
>
</appfx-datagrid-filters>
```

datagrid-filters-demo.component.ts

```ts
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
    const stringAddressProperty: StringPropertyDefinition = new StringPropertyDefinition('Address', 'address');

    const dateTimeProperty: DateTimePropertyDefinition = new DateTimePropertyDefinition('Last change', 'lastChanged');

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
    const enumProperty: EnumPropertyDefinition = new EnumPropertyDefinition('Status', 'status', enumValuesMap);
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
```

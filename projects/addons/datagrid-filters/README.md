## Overview & Rationale

AppFx Filters component provides an enhanced user experience for datagrid filtering.
It is expected to be hosted in the datagrid action bar and can be used in three modes - quick, advanced and advanced only. <br/>
Advanced modes allow users to build and manage complex filtering queries. Quick mode is suitable for quick search filtering.

#### Advanced Filter

![Filters example screen](assets/appfx/datagrid-advanced-filter-overview.png)

#### Quick Filter

![Filters example screen](assets/appfx/datagrid-quick-filter-overview.png)

## Component API

#### appfx-datagrid-filters

| Property                | Input/Output | Type                             | Description                                                                                                                                                                                                                                                                                                                                                                                                                               |
| ----------------------- | ------------ | -------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `filterMode`            | Input        | `FilterMode`                     | Enum parameter with four options.<br/>FilterMode.Quick - only quick filter is activated.<br/>FilterMode.Advanced - both quick and advanced filters are activated.<br/>FilterMode.AdvancedOnly - Only advanced filter is activated.<br/>FilterMode.Combined - quick search and advanced filter pills are shown and applied together. The host combines `searchTermChange` and `propertyFiltersChange` with AND, and Clear all clears both. |
| `filterableProperties`  | Input        | `FilterablePropertyDefinition[]` | Array of properties, which are used for advanced filtering.<br/>Supported types: StringPropertyDefinition, NumericPropertyDefinition, EnumPropertyDefinition, DateTimePropertyDefinition                                                                                                                                                                                                                                                  |
| `presetFilters`         | Input        | `PropertyFilter[]`               | Filters applied when the filter bar starts, e.g. a fixed default view. Read once at start-up; later changes are ignored. See [Keeping filters in sync](#keeping-filters-in-sync).                                                                                                                                                                                                                                                         |
| `predefinedFilters`     | Input        | `FilterablePropertyDefinition[]` | Properties whose pills remain visible without active criteria. Defaults to `[]`; initial values are supplied through `presetFilters`.                                                                                                                                                                                                                                                                                                     |
| `semiPredefinedFilters` | Input        | `EnumPropertyDefinition[]`       | Enum fields shown as a label followed by option pills. Selected options are combined with OR and applied immediately. Only option selection is supported; see [Field precedence](#field-precedence).                                                                                                                                                                                                                                      |
| `toggleFilters`         | Input        | `PropertyFilter[]`               | Ready-made filters shown as on/off pills. ON applies the filter as configured. A preset or `propertyFilters` entry with the same criteria turns the toggle ON.                                                                                                                                                                                                                                                                            |
| `searchTermChange`      | Output       | `EventEmitter<string>`           | Emits when the quick filter changes. Triggered on `Enter` key press and/or automatically on every 2 sec when the user is typing in the search input.                                                                                                                                                                                                                                                                                      |
| `propertyFilters`       | Input        | `PropertyFilter[]`               | The active filters, including toggle filters that are ON. Supports two-way binding with `[(propertyFilters)]`. See [Keeping filters in sync](#keeping-filters-in-sync).                                                                                                                                                                                                                                                                   |
| `propertyFiltersChange` | Output       | `EventEmitter<PropertyFilter[]>` | Emits the active filters, including toggle filters that are ON, when the user changes them. Also emits once at start-up when presets or clean-up change what `propertyFilters` passed in.                                                                                                                                                                                                                                                 |

#### Predefined filters

The optional `predefinedFilters: FilterablePropertyDefinition[]` input selects the properties whose pills are always visible in advanced mode. Supply their definitions in the desired display order. Properties are matched by their `property` key, so a predefined field is not offered again in **Add filter**.

Predefined pills start empty and use a gray outline with the field name. Set initial criteria through the existing `presetFilters` input. Active pills use a blue outline and background, display the first condition, and show `+N` for additional conditions. Operators other than equality remain visible in the summary.

Opening a pill edits its criteria in a popover. **Clear filter** returns a predefined pill to its empty state; user-added filters can be removed. **Clear all** clears all criteria and removes user-added pills while retaining predefined pills. **Hide** only hides user-added pills. Empty pills are not included in `propertyFiltersChange`.

The popover applies changes only on **Apply**. **Cancel**, Escape, and outside clicks discard unapplied edits.

**Add filter** uses a searchable field combobox. Existing pills keep their field locked while editing. String and numeric filters place the **AND/OR** button group beside the field, with each condition's operator and value on one row. A label between conditions shows the selected logical operator.

String and numeric filters support any number of conditions, joined by one shared **AND** or **OR** operator. **Add condition** appends another row; individual rows can be removed while keeping at least one. Setting `singleCondition` to `true` limits the field to one condition.

```html
<appfx-datagrid-filters
  [filterMode]="filterMode"
  [filterableProperties]="filterableProperties"
  [predefinedFilters]="predefinedFilters"
  [presetFilters]="presetFilters"
  (propertyFiltersChange)="onAdvancedFilterCriteriaChange($event)"
></appfx-datagrid-filters>
```

For example, `predefinedFilters = [nameProperty, statusProperty]` permanently shows the name and status filters independently of their initial values. Unlike a flag on `FilterablePropertyDefinition`, this input lets each grid choose visibility and order while sharing the same field definitions.

### Keeping filters in sync

Use `[(propertyFilters)]` when the host keeps the active filters, for example to restore a saved view or a URL:

```html
<appfx-datagrid-filters
  [filterMode]="filterMode"
  [filterableProperties]="filterableProperties"
  [toggleFilters]="toggleFilters"
  [(propertyFilters)]="filters"
></appfx-datagrid-filters>
```

- A new `propertyFilters` value replaces the active filters. A filter with exactly a toggle's criteria turns that toggle ON; a toggle missing from the value turns OFF. The filter bar copies the array and never changes it.
- Setting `propertyFilters` does not emit `propertyFiltersChange`, so passing the emitted value back does not loop. The exception is a filter on a semi-predefined field that had to be removed; the corrected list is emitted.
- `presetFilters` are applied once, at start-up. For the same field, a preset wins over a `propertyFilters` filter. If the start-up result differs from what `propertyFilters` passed in (or there is no `propertyFilters` binding and presets are set), `propertyFiltersChange` emits it once, after the first change detection, so the host is in sync from the start.
- Switching `appfx-datagrid-filters` to quick mode clears the filters and emits `[]`.

Filters built by the editors carry an `editorState`, which keeps the choices the criteria cannot express (e.g. _Last week_, or a value typed in another unit). Keep it when storing filters in memory. When it is missing, for example in a host preset or after storing only the criteria, the filter bar derives what it can from the criteria.

### Field precedence

Each field can be used only once per filter bar. Fields are claimed from left to right: `predefinedFilters` first, then `semiPredefinedFilters`, then `toggleFilters` (the first toggle per field wins). Later entries for an already claimed field are ignored, with a console warning. Fields used by any of these inputs are not offered in **Add filter**.

Semi-predefined fields only support picking options. A preset or `propertyFilters` entry for such a field must be one or more `Equals` conditions on option keys, combined with OR; any other filter on such a field is removed, with a console warning. This also applies when a field becomes semi-predefined after init; the filter bar then emits `propertyFiltersChange` without the removed filter.

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

| Property          | Type                  | Description                                                                                       |
| ----------------- | --------------------- | ------------------------------------------------------------------------------------------------- |
| `values`          | `Map<string, string>` | Enumeration key/value data to be used in the filter selection.                                    |
| `singleSelect`    | `boolean`             | Optional. Indicates that the property should be used for single select filtering. Default: false. |
| `searchable`      | `boolean`             | Optional. Indicates that the property should provide a searching interface. Default: false.       |
| `enableSelectAll` | `boolean`             | Optional. Indicates that a select all checkbox is shown. Default: true.                           |

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

Date-time filters emit local date-times followed by the local UTC offset, e.g. `2026-03-29T00:00:00+02:00`. **Equals** a date is emitted as `>= that day 00:00` AND `< next day 00:00`, and a custom range ends before the midnight after its end date. A day always runs from midnight to the next midnight, also on the days daylight saving starts or ends (23 or 25 hours). **Last day**, **Last week** and **Time span** count back a fixed length from now.

#### Preset ranges

Pass `rangeOptions` (Clarity's `DateRangeOption[]` from `@clr/angular`) as the fifth constructor argument to offer ready-made ranges for **Custom range**. Without times they are listed in the date range picker; with times they are buttons under the operator. A click fills From and To, which the user can still change before **Apply**; the pill then shows the dates.

```ts
const today = new Date();
const daysAgo = (days: number) => new Date(today.getFullYear(), today.getMonth(), today.getDate() - days);

new DateTimePropertyDefinition('Created', 'created', undefined, false, [
  { label: 'Today', value: [today, today] },
  { label: 'Last 7 days', value: [daysAgo(6), today] },
  { label: 'Working hours', value: [new Date(2026, 10, 12, 9, 0), new Date(2026, 10, 12, 17, 0)] },
]);
```

- `value` is `[start, end]`, both inclusive. Options whose `value` is not exactly two valid `Date`s are ignored.
- The dates are used as given. To change what a range covers (e.g. a new "Today"), pass a new definition with new options.
- With times, a `Date` at exactly 00:00 means the whole day: From becomes 00:00 and To 23:59. Other times are used as they are, so `17:00` includes 17:00. Seconds are kept only with `includeSeconds`.
- Keep the list short (4–5 options); with times the buttons are listed under the operator.

### PropertyFilter

| Property      | Type                  | Description                                                                                               |
| ------------- | --------------------- | --------------------------------------------------------------------------------------------------------- |
| `criteria`    | `PropertyPredicate[]` | Filter criteria                                                                                           |
| `operator`    | `LogicalOperator`     | Logical operator. Supported values are AND/OR                                                             |
| `editorState` | `FilterEditorState`   | Optional. Set by the built-in editors so a filter can be edited again. Not needed for host-built filters. |

### PropertyPredicate

| Property             | Type                           | Description                                                 |
| -------------------- | ------------------------------ | ----------------------------------------------------------- |
| `filterableProperty` | `FilterablePropertyDefinition` | Property that is used for filtering                         |
| `operator`           | `ComparisonOperator`           | Filtering operator                                          |
| `value`              | `any`                          | Filter value. `undefined` for `ComparisonOperator.IsEmpty`. |

### Example Code

datagrid-filters-demo.component.html

```html
<appfx-datagrid-filters
  [filterMode]="filterMode"
  [filterableProperties]="filterableProperties"
  [presetFilters]="presetFilters"
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

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  inject,
  Injectable,
  QueryList,
  TemplateRef,
  Type,
  ViewChild,
  ViewChildren,
  ViewContainerRef,
} from '@angular/core';
import {
  AppfxDatagridFiltersModule,
  ComparisonOperator,
  DatagridFiltersStrings,
  DatagridFiltersUserService,
  DateTimePropertyDefinition,
  EnumPropertyDefinition,
  FilterablePropertyDefinition,
  FilterMode,
  LogicalOperator,
  NumericPropertyDefinition,
  PropertyFilter,
  PropertyPredicate,
  PropertyType,
  StringPropertyDefinition,
  TimeSpan,
  Unit,
  UserPropertyDefinition,
} from '@clr/addons/datagrid-filters';
// The editors are internal to the module, so the gallery creates them directly to show them side by side.
import { DateTimeFilterComponent } from '@clr/addons/datagrid-filters/advanced-filters/date-time-filter.component';
import { EnumFilterComponent } from '@clr/addons/datagrid-filters/advanced-filters/enum-filter.component';
import { GeneralFilterComponent } from '@clr/addons/datagrid-filters/advanced-filters/general-filter.component';
import { UsersFilterComponent } from '@clr/addons/datagrid-filters/advanced-filters/users-filter.component';
import { Observable, of } from 'rxjs';

@Injectable()
class FilterTypesUserService extends DatagridFiltersUserService {
  private readonly users = ['admin', 'john.doe', 'alice.wong', 'bob.martin', 'carol.jones'].map(
    user => `${user}@CORP.EXAMPLE`
  );

  override getDomains(): Observable<string[]> {
    return of(['CORP.EXAMPLE']);
  }

  override searchUsers(searchTerm: string): Observable<string[]> {
    return of(this.users.filter(user => user.toLowerCase().includes(searchTerm.toLowerCase())));
  }
}

interface FilterTypeExample {
  title: string;
  note: string;
  type: PropertyType;
  property: FilterablePropertyDefinition;
  filter?: PropertyFilter;
}

const nameProperty = new StringPropertyDefinition('VM Name', 'name');
const tagsProperty = new StringPropertyDefinition('Tags', 'tags', undefined, false, LogicalOperator.And);
const cpuProperty = new NumericPropertyDefinition('vCPUs', 'cpu');
const memoryProperty = new NumericPropertyDefinition('Memory', 'memory', undefined, Unit.MB);
const statusProperty = new EnumPropertyDefinition(
  'Status',
  'status',
  new Map([
    ['Normal', 'Normal'],
    ['Warning', 'Warning'],
    ['Alert', 'Alert'],
  ])
);
const stateProperty = new EnumPropertyDefinition(
  'State',
  'state',
  new Map([
    ['Powered On', 'Powered On'],
    ['Powered Off', 'Powered Off'],
    ['Suspended', 'Suspended'],
  ]),
  true
);
const ownerProperty = new UserPropertyDefinition('Owner', 'owner');
const createdProperty = new DateTimePropertyDefinition('Created', 'created');
const modifiedProperty = new DateTimePropertyDefinition('Last modified', 'modified');

function filterOf(operator: LogicalOperator, ...criteria: [FilterablePropertyDefinition, ComparisonOperator, any][]) {
  const filter = new PropertyFilter();
  filter.operator = operator;
  filter.criteria = criteria.map(([filterableProperty, comparison, value]) => {
    const predicate = new PropertyPredicate();
    predicate.filterableProperty = filterableProperty;
    predicate.operator = comparison;
    predicate.value = value;
    return predicate;
  });
  return filter;
}

function withState(filter: PropertyFilter, editorState: PropertyFilter['editorState']): PropertyFilter {
  filter.editorState = editorState;
  return filter;
}

const examples: FilterTypeExample[] = [
  {
    title: 'Text',
    note: 'Free-text values, one per condition. And/Or appears once there are two conditions.',
    type: PropertyType.String,
    property: nameProperty,
    filter: filterOf(
      LogicalOperator.Or,
      [nameProperty, ComparisonOperator.Contains, 'web'],
      [nameProperty, ComparisonOperator.StartsWith, 'db']
    ),
  },
  {
    title: 'Text, fixed operator',
    note: 'The field sets logicalOperator, so the word is shown instead of the choice.',
    type: PropertyType.String,
    property: tagsProperty,
    filter: filterOf(
      LogicalOperator.And,
      [tagsProperty, ComparisonOperator.Contains, 'prod'],
      [tagsProperty, ComparisonOperator.DoesNotContain, 'test']
    ),
  },
  {
    title: 'Text, new filter',
    note: 'One empty condition: no And/Or yet, no read-back until the value is valid.',
    type: PropertyType.String,
    property: nameProperty,
  },
  {
    title: 'Number',
    note: 'Integer values.',
    type: PropertyType.Numeric,
    property: cpuProperty,
    filter: filterOf(LogicalOperator.And, [cpuProperty, ComparisonOperator.GreaterThanOrEqualTo, 4]),
  },
  {
    title: 'Number with unit',
    note: 'Each condition keeps the unit it was typed in.',
    type: PropertyType.Numeric,
    property: memoryProperty,
    filter: withState(
      filterOf(
        LogicalOperator.And,
        [memoryProperty, ComparisonOperator.GreaterThan, 4096],
        [memoryProperty, ComparisonOperator.LessThan, 16384]
      ),
      { values: [4, 16], units: [Unit.GB, Unit.GB] }
    ),
  },
  {
    title: 'List',
    note: 'Checkboxes with Select all and the count on one line.',
    type: PropertyType.Enum,
    property: statusProperty,
    filter: filterOf(
      LogicalOperator.Or,
      [statusProperty, ComparisonOperator.Equals, 'Warning'],
      [statusProperty, ComparisonOperator.Equals, 'Alert']
    ),
  },
  {
    title: 'List, single select',
    note: 'Radios for a field that takes one value.',
    type: PropertyType.Enum,
    property: stateProperty,
    filter: filterOf(LogicalOperator.Or, [stateProperty, ComparisonOperator.Equals, 'Powered On']),
  },
  {
    title: 'User',
    note: 'Domain, search, and the selected users with their count.',
    type: PropertyType.User,
    property: ownerProperty,
    filter: filterOf(
      LogicalOperator.Or,
      [ownerProperty, ComparisonOperator.Equals, 'john.doe@CORP.EXAMPLE'],
      [ownerProperty, ComparisonOperator.Equals, 'alice.wong@CORP.EXAMPLE']
    ),
  },
  {
    title: 'Date and time, custom range',
    note: 'One condition: From and To, inclusive.',
    type: PropertyType.DateTime,
    property: createdProperty,
    filter: withState(
      filterOf(
        LogicalOperator.And,
        [createdProperty, ComparisonOperator.GreaterThanOrEqualTo, '2026-11-16'],
        [createdProperty, ComparisonOperator.LessThan, '2026-11-24']
      ),
      { operator: ComparisonOperator.CustomRange, value: '2026-11-16', valueTo: '2026-11-23' }
    ),
  },
  {
    title: 'Date and time, time span',
    note: 'A number and a span, counted back from now.',
    type: PropertyType.DateTime,
    property: modifiedProperty,
    filter: withState(
      filterOf(LogicalOperator.And, [modifiedProperty, ComparisonOperator.GreaterThanOrEqualTo, '2026-11-20']),
      { operator: ComparisonOperator.TimeSpan, timeSpanValue: 3, timeSpan: TimeSpan.Days }
    ),
  },
  {
    title: 'Date and time, last week',
    note: 'Relative presets need no value.',
    type: PropertyType.DateTime,
    property: modifiedProperty,
    filter: withState(
      filterOf(LogicalOperator.And, [modifiedProperty, ComparisonOperator.GreaterThanOrEqualTo, '2026-11-16']),
      { operator: ComparisonOperator.LastWeek }
    ),
  },
];

const editors: Record<PropertyType, Type<unknown>> = {
  [PropertyType.String]: GeneralFilterComponent,
  [PropertyType.Numeric]: GeneralFilterComponent,
  [PropertyType.Enum]: EnumFilterComponent,
  [PropertyType.User]: UsersFilterComponent,
  [PropertyType.DateTime]: DateTimeFilterComponent,
};

/**
 * Every filter type on one page: a filter bar with a pill per type, then each editor open as it shows in its popover.
 * Apply and Cancel on a gallery editor do nothing.
 */
@Component({
  selector: 'clr-datagrid-filter-types-story',
  standalone: true,
  imports: [AppfxDatagridFiltersModule],
  providers: [{ provide: DatagridFiltersUserService, useClass: FilterTypesUserService }],
  template: `
    <h2 cds-text="section">Filter bar</h2>
    <p cds-text="body">Open a pill to edit it in its popover.</p>
    <appfx-datagrid-filters
      [filterMode]="filterMode"
      [filterableProperties]="properties"
      [presetFilters]="presetFilters"
      [(propertyFilters)]="propertyFilters"
    ></appfx-datagrid-filters>

    <h2 cds-text="section" cds-layout="m-t:xl">Editors</h2>
    <div class="filter-types">
      @for (example of examples; track example.title) {
        <section class="filter-type">
          <h3 cds-text="subsection">{{ example.title }}</h3>
          <p cds-text="secondary">{{ example.note }}</p>
          <div class="filter-type-popover">
            <ng-container #editor></ng-container>
          </div>
        </section>
      }
    </div>

    <ng-template #heading let-example>
      <div class="filter-heading" filterField>
        <span class="filter-heading-name">{{ example.property.displayName }}</span>
        <span class="filter-heading-type">{{ strings.getPropertyTypeDisplayName(example.type) }}</span>
      </div>
    </ng-template>
  `,
  styles: `
    .filter-types {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(min(24rem, 100%), 1fr));
      gap: var(--cds-global-space-9);
      margin-top: var(--cds-global-space-7);
    }

    .filter-type {
      display: flex;
      flex-direction: column;
      gap: var(--cds-global-space-3);
    }

    /* The popover's box, without the overlay. */
    .filter-type-popover {
      display: flex;
      flex-direction: column;
      width: min(24rem, 100%);
      padding: var(--clr-base-vertical-offset-l) var(--clr-base-horizontal-offset-l);
      background: var(--cds-alias-object-container-background);
      border: var(--cds-alias-object-border-width-100) solid var(--cds-alias-object-border-color);
      border-radius: var(--clr-base-border-radius-s);
      box-shadow: var(--cds-alias-object-shadow-200);
    }
  `,
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class DatagridFilterTypesStoryComponent implements AfterViewInit {
  @ViewChildren('editor', { read: ViewContainerRef }) editorHosts!: QueryList<ViewContainerRef>;
  @ViewChild('heading') heading!: TemplateRef<{ $implicit: FilterTypeExample }>;

  readonly strings = inject(DatagridFiltersStrings);
  readonly examples = examples;
  readonly filterMode = FilterMode.AdvancedOnly;
  readonly properties = [
    nameProperty,
    tagsProperty,
    cpuProperty,
    memoryProperty,
    statusProperty,
    stateProperty,
    ownerProperty,
    createdProperty,
    modifiedProperty,
  ];
  /** One pill per field: the first example of each field that has a filter. */
  readonly presetFilters = this.properties.flatMap(property => {
    const filter = examples.find(example => example.property === property && example.filter)?.filter;
    return filter ? [filter] : [];
  });
  propertyFilters: PropertyFilter[] = [];

  ngAfterViewInit(): void {
    this.editorHosts.forEach((host, index) => {
      const example = this.examples[index];
      const heading = this.heading.createEmbeddedView({ $implicit: example });
      heading.detectChanges();
      // The editors project the field heading into [filterField], their first slot.
      const editor = host.createComponent(editors[example.type], { projectableNodes: [heading.rootNodes, []] });
      editor.setInput('filterProperty', example.property);
      if (example.filter) {
        editor.setInput('propertyFilter', example.filter);
      }
      editor.onDestroy(() => heading.destroy());
      editor.changeDetectorRef.detectChanges();
    });
  }
}

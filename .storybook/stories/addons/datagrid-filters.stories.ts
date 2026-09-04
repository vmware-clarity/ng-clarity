/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { Component, Injectable, Input } from '@angular/core';
import {
  AppfxDatagridFiltersModule,
  ComparisonOperator,
  DataGridFiltersComponent,
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
  UserPropertyDefinition,
} from '@clr/addons/datagrid-filters';
import { moduleMetadata, StoryFn, StoryObj } from '@storybook/angular';
import { Observable, of, timer } from 'rxjs';
import { map } from 'rxjs/operators';

// ─── User service ────────────────────────────────────────────────────────────

@Injectable()
class StoryUserService extends DatagridFiltersUserService {
  private readonly domainUsers: Record<string, string[]> = {
    'CORP.EXAMPLE': ['admin', 'john.doe', 'alice.wong', 'bob.martin', 'carol.jones'].map(u => `${u}@CORP.EXAMPLE`),
    'CLOUD.EXAMPLE': ['jane.smith', 'ops-monitor', 'deploy-bot', 'diana.ross'].map(u => `${u}@CLOUD.EXAMPLE`),
  };

  override getDomains(): Observable<string[]> {
    return of(Object.keys(this.domainUsers));
  }

  override searchUsers(searchTerm: string, domain: string): Observable<string[]> {
    const users = this.domainUsers[domain] || [];
    const lower = searchTerm.toLowerCase();
    return timer(300).pipe(map(() => users.filter(u => u.toLowerCase().includes(lower))));
  }
}

// ─── Filterable properties ───────────────────────────────────────────────────

const nameProperty = new StringPropertyDefinition('VM Name', 'name');

const stateProperty = new EnumPropertyDefinition(
  'State',
  'state',
  new Map([
    ['Powered On', 'Powered On'],
    ['Powered Off', 'Powered Off'],
  ]),
  true
);

const statusProperty = new EnumPropertyDefinition(
  'Status',
  'status',
  new Map([
    ['Normal', 'Normal'],
    ['Warning', 'Warning'],
    ['Alert', 'Alert'],
  ])
);

const usedSpaceProperty = new NumericPropertyDefinition('Used space', 'usedSpace');

const createdProperty = new DateTimePropertyDefinition('Created', 'created');

const userProperty = new UserPropertyDefinition('User', 'user');

const filterableProperties: FilterablePropertyDefinition[] = [
  nameProperty,
  stateProperty,
  statusProperty,
  usedSpaceProperty,
  createdProperty,
  userProperty,
];

function createPredicate(
  filterableProperty: FilterablePropertyDefinition,
  operator: ComparisonOperator,
  value: any
): PropertyPredicate {
  const predicate = new PropertyPredicate();
  predicate.filterableProperty = filterableProperty;
  predicate.operator = operator;
  predicate.value = value;
  return predicate;
}

function createPropertyFilter(operator: LogicalOperator, ...criteria: PropertyPredicate[]): PropertyFilter {
  const propertyFilter = new PropertyFilter();
  propertyFilter.operator = operator;
  propertyFilter.criteria = criteria;
  return propertyFilter;
}

const presetFilters: PropertyFilter[] = [
  createPropertyFilter(
    LogicalOperator.And,
    createPredicate(nameProperty, ComparisonOperator.Contains, 'web'),
    createPredicate(nameProperty, ComparisonOperator.DoesNotContain, 'test')
  ),
  createPropertyFilter(LogicalOperator.Or, createPredicate(statusProperty, ComparisonOperator.Equals, 'Warning')),
];

// ─── Wrapper ─────────────────────────────────────────────────────────────────

@Component({
  selector: 'clr-datagrid-filters-story-wrapper',
  standalone: true,
  imports: [CommonModule, AppfxDatagridFiltersModule],
  providers: [{ provide: DatagridFiltersUserService, useClass: StoryUserService }],
  template: `
    <appfx-datagrid-filters
      [filterMode]="filterMode"
      [filterableProperties]="filterableProperties"
      [presetFilters]="presetFilters"
      (searchTermChange)="searchTerm = $event"
      (propertyFiltersChange)="propertyFilters = $event"
    ></appfx-datagrid-filters>

    <div cds-layout="m-t:lg" cds-text="body">
      <div>
        <strong>Search term:</strong>
        {{ searchTerm || '—' }}
      </div>
      <div>
        <strong>Applied filters:</strong>
        @if (propertyFilters.length) {
          <ul>
            @for (propertyFilter of propertyFilters; track $index) {
              <li>
                @for (predicate of propertyFilter.criteria; track $index; let last = $last) {
                  {{ predicate.filterableProperty.displayName }} {{ comparisonOperator[predicate.operator] }} "{{
                    predicate.value
                  }}"
                  @if (!last) {
                    {{ logicalOperator[propertyFilter.operator] }}
                  }
                }
              </li>
            }
          </ul>
        } @else {
          —
        }
      </div>
    </div>
  `,
})
class DatagridFiltersStoryWrapperComponent {
  @Input() filterMode: FilterMode = FilterMode.Advanced;
  @Input() presetFilters: PropertyFilter[] = [];

  readonly filterableProperties = filterableProperties;
  readonly comparisonOperator = ComparisonOperator;
  readonly logicalOperator = LogicalOperator;

  searchTerm = '';
  propertyFilters: PropertyFilter[] = [];
}

// ─── Meta ─────────────────────────────────────────────────────────────────────

export default {
  title: 'Addons/Datagrid Filters',
  component: DataGridFiltersComponent,
  decorators: [
    moduleMetadata({
      imports: [AppfxDatagridFiltersModule, CommonModule, DatagridFiltersStoryWrapperComponent],
    }),
  ],
  argTypes: {
    filterMode: {
      control: { type: 'select' },
      options: [FilterMode.Quick, FilterMode.Advanced, FilterMode.AdvancedOnly],
      labels: {
        [FilterMode.Quick]: 'Quick',
        [FilterMode.Advanced]: 'Advanced',
        [FilterMode.AdvancedOnly]: 'AdvancedOnly',
      },
    },
    presetFilters: { control: false },
  },
  args: {
    filterMode: FilterMode.Advanced,
    presetFilters: [],
  },
};

type Story = StoryObj<DatagridFiltersStoryWrapperComponent>;

const template: StoryFn<DatagridFiltersStoryWrapperComponent> = args => ({
  props: args,
  template: `
    <clr-datagrid-filters-story-wrapper
      [filterMode]="filterMode"
      [presetFilters]="presetFilters"
    ></clr-datagrid-filters-story-wrapper>
  `,
});

export const Advanced: Story = {
  render: template,
};

export const Quick: Story = {
  render: template,
  args: {
    filterMode: FilterMode.Quick,
  },
};

export const AdvancedOnly: Story = {
  render: template,
  args: {
    filterMode: FilterMode.AdvancedOnly,
  },
};

export const AdvancedWithPresetFilters: Story = {
  render: template,
  args: {
    filterMode: FilterMode.AdvancedOnly,
    presetFilters,
  },
};

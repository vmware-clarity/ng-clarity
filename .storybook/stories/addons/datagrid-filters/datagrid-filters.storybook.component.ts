/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Injectable, Input } from '@angular/core';
import {
  AppfxDatagridFiltersModule,
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
  UserPropertyDefinition,
} from '@clr/addons/datagrid-filters';
import { Observable, of, timer } from 'rxjs';
import { map } from 'rxjs/operators';

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

const guestOsProperty = new EnumPropertyDefinition(
  'Guest OS',
  'guestOs',
  new Map([
    ['linux', 'Linux'],
    ['windows', 'Windows'],
    ['other', 'Other'],
  ])
);

const usedSpaceProperty = new NumericPropertyDefinition('Used space', 'usedSpace');

const createdProperty = new DateTimePropertyDefinition('Created', 'created');

const userProperty = new UserPropertyDefinition('User', 'user');

const filterableProperties: FilterablePropertyDefinition[] = [
  nameProperty,
  stateProperty,
  statusProperty,
  guestOsProperty,
  usedSpaceProperty,
  createdProperty,
  userProperty,
];

export const predefinedFilters = [nameProperty, statusProperty, usedSpaceProperty, createdProperty, userProperty];

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

/**
 * Preset filters for the `AdvancedWithPresetFilters` story. They live here, next to the property
 * definitions they reference, so the story file does not have to re-export the wrapper's data.
 */
export const presetFilters: PropertyFilter[] = [
  createPropertyFilter(
    LogicalOperator.And,
    createPredicate(nameProperty, ComparisonOperator.Contains, 'web'),
    createPredicate(nameProperty, ComparisonOperator.DoesNotContain, 'test')
  ),
  createPropertyFilter(LogicalOperator.Or, createPredicate(statusProperty, ComparisonOperator.Equals, 'Warning')),
];

/** Enum fields shown as a label followed by option pills. */
export const semiPredefinedFilters = [guestOsProperty];

/** Ready-made filters shown as on/off pills. */
export const toggleFilters: PropertyFilter[] = [
  createPropertyFilter(LogicalOperator.Or, createPredicate(stateProperty, ComparisonOperator.Equals, 'Powered On')),
  createPropertyFilter(LogicalOperator.Or, createPredicate(statusProperty, ComparisonOperator.Equals, 'Alert')),
];

/** A saved view restored through `[(propertyFilters)]`. Its second filter matches a toggle, so the toggle turns ON. */
export const savedView: PropertyFilter[] = [
  createPropertyFilter(LogicalOperator.And, createPredicate(nameProperty, ComparisonOperator.StartsWith, 'db')),
  createPropertyFilter(LogicalOperator.Or, createPredicate(stateProperty, ComparisonOperator.Equals, 'Powered On')),
];

/** Equals a day, written as the editor writes it: from that midnight to the next. */
export const equalsDayPresetFilters: PropertyFilter[] = [
  createPropertyFilter(
    LogicalOperator.And,
    createPredicate(createdProperty, ComparisonOperator.GreaterThanOrEqualTo, '2026-03-29'),
    createPredicate(createdProperty, ComparisonOperator.LessThan, '2026-03-30')
  ),
];

/** A custom range from 1 to 7 March: it ends at the midnight after its last day. */
export const customRangePresetFilters: PropertyFilter[] = [
  createPropertyFilter(
    LogicalOperator.And,
    createPredicate(createdProperty, ComparisonOperator.GreaterThanOrEqualTo, '2026-03-01'),
    createPredicate(createdProperty, ComparisonOperator.LessThan, '2026-03-08')
  ),
];

/**
 * Last week. Relative operators cannot be recovered from criteria, so the filter carries an `editorState`.
 * A function, so the start is computed when the story renders.
 */
export function lastWeekPresetFilters(): PropertyFilter[] {
  const start = new Date();
  start.setDate(start.getDate() - 7);
  const filter = createPropertyFilter(
    LogicalOperator.And,
    createPredicate(createdProperty, ComparisonOperator.GreaterThanOrEqualTo, start.toISOString())
  );
  filter.editorState = { operator: ComparisonOperator.LastWeek };
  return [filter];
}

@Component({
  selector: 'clr-datagrid-filters-story-wrapper',
  standalone: true,
  imports: [CommonModule, AppfxDatagridFiltersModule],
  providers: [{ provide: DatagridFiltersUserService, useClass: StoryUserService }],
  template: `
    <clr-advanced-filters
      [filterMode]="filterMode"
      [filterableProperties]="filterableProperties"
      [presetFilters]="presetFilters"
      [predefinedFilters]="predefinedFilters"
      [semiPredefinedFilters]="semiPredefinedFilters"
      [toggleFilters]="toggleFilters"
      [(propertyFilters)]="propertyFilters"
      (searchTermChange)="searchTerm = $event"
    ></clr-advanced-filters>

    @if (savedView.length) {
      <div cds-layout="m-t:md">
        <button type="button" class="btn btn-sm btn-outline" (click)="restoreSavedView()">Restore saved view</button>
        <button type="button" class="btn btn-sm btn-link" (click)="clearFilters()">Clear from host</button>
      </div>
    }

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
                  {{ predicate.filterableProperty.displayName }} {{ comparisonOperator[predicate.operator] }}
                  @if (predicate.operator !== comparisonOperator.IsEmpty) {
                    "{{ predicate.value }}"
                  }
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
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class DatagridFiltersStoryWrapperComponent {
  @Input() filterMode: FilterMode = FilterMode.Advanced;
  @Input() presetFilters: PropertyFilter[] = [];
  @Input() predefinedFilters: FilterablePropertyDefinition[] = [];
  @Input() semiPredefinedFilters: EnumPropertyDefinition[] = [];
  @Input() toggleFilters: PropertyFilter[] = [];
  /** Filters the host restores through `[(propertyFilters)]`. The host buttons are hidden when empty. */
  @Input() savedView: PropertyFilter[] = [];

  readonly filterableProperties = filterableProperties;
  readonly comparisonOperator = ComparisonOperator;
  readonly logicalOperator = LogicalOperator;

  searchTerm = '';
  propertyFilters: PropertyFilter[] = [];

  restoreSavedView(): void {
    this.propertyFilters = [...this.savedView];
  }

  clearFilters(): void {
    this.propertyFilters = [];
  }
}

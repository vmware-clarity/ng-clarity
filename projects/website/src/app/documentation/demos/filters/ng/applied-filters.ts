/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { ComparisonOperator, LogicalOperator, PropertyFilter } from '@clr/addons/datagrid-filters';

/**
 * Prints what the filter bar emitted. Shared by the datagrid filters demos.
 */
@Component({
  selector: 'app-applied-filters',
  template: `
    <div cds-layout="m-t:lg" cds-text="body">
      @if (showSearchTerm) {
        <div>
          <strong>Search term:</strong>
          {{ searchTerm || '—' }}
        </div>
      }
      <div>
        <strong>Applied filters:</strong>
        @if (filters.length) {
          <ul class="list">
            @for (propertyFilter of filters; track $index) {
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppliedFiltersComponent {
  @Input() filters: PropertyFilter[] = [];
  @Input() searchTerm = '';
  @Input() showSearchTerm = false;

  readonly comparisonOperator = ComparisonOperator;
  readonly logicalOperator = LogicalOperator;
}

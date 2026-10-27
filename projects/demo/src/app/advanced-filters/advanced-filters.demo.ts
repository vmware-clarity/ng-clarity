/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component } from '@angular/core';
import {
  ClrAdvancedFilter,
  ClrAdvancedFilterField,
  ClrAdvancedFilterFieldType,
  ClrAdvancedFilterGroup,
  ClrAdvancedFilterLayout,
  ClrAdvancedFilterLogic,
  ClrAdvancedFilterOperator,
} from '@clr/angular/data/advanced-filters';

const DAY = 24 * 60 * 60 * 1000;

@Component({
  selector: 'app-advanced-filters-demo',
  templateUrl: './advanced-filters.demo.html',
  standalone: false,
})
export class AdvancedFiltersDemoComponent {
  readonly layouts = ClrAdvancedFilterLayout;
  layout = ClrAdvancedFilterLayout.TREE;
  maxDepth = 3;
  showFields = true;
  changes = 0;

  allFields: ClrAdvancedFilterField[] = [
    { key: 'name', label: 'Name', type: ClrAdvancedFilterFieldType.STRING },
    { key: 'budget', label: 'Budget', type: ClrAdvancedFilterFieldType.NUMBER },
    { key: 'discontinued', label: 'Discontinued', type: ClrAdvancedFilterFieldType.BOOLEAN },
    {
      key: 'ordered',
      label: 'Ordered on',
      type: ClrAdvancedFilterFieldType.DATE,
      rangeOptions: [
        { label: 'Last 7 days', value: [new Date(Date.now() - 7 * DAY), new Date()] },
        { label: 'Last 30 days', value: [new Date(Date.now() - 30 * DAY), new Date()] },
      ],
    },
    {
      key: 'region',
      label: 'Region',
      type: ClrAdvancedFilterFieldType.ENUM,
      options: [
        { value: 'us-east', label: 'US East' },
        { value: 'us-west', label: 'US West' },
        { value: 'eu-central', label: 'EU Central' },
      ],
    },
  ];

  filter = this.createFilter();

  get fields(): ClrAdvancedFilterField[] {
    return this.showFields ? this.allFields : this.allFields.filter(field => field.key !== 'budget');
  }

  get json(): string {
    return JSON.stringify(this.filter, null, 2);
  }

  reset(): void {
    this.filter = this.createFilter();
  }

  private createFilter(): ClrAdvancedFilterGroup {
    const [name, budget, , ordered, region] = this.allFields;
    const root = new ClrAdvancedFilterGroup();
    root.logic = ClrAdvancedFilterLogic.OR;
    root.addChild(new ClrAdvancedFilter(budget, ClrAdvancedFilterOperator.GREATER_THAN, 60));
    root.addChild(new ClrAdvancedFilter(name, ClrAdvancedFilterOperator.CONTAINS, 'dfsd'));
    const nested = root.addChild(new ClrAdvancedFilterGroup());
    nested.addChild(new ClrAdvancedFilter(ordered, ClrAdvancedFilterOperator.AFTER, '2026-10-20'));
    nested.addChild(new ClrAdvancedFilter(region, ClrAdvancedFilterOperator.IN, ['us-west', 'eu-central']));
    return root;
  }
}

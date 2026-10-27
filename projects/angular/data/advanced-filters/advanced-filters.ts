/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Component, EventEmitter, Input, numberAttribute, OnChanges, Output, SimpleChanges } from '@angular/core';
import { ClrCommonStringsService } from '@clr/angular/utils';

import { ClrAdvancedFilterLayout } from './enums/advanced-filter-layout.enum';
import { AdvancedFilterText } from './filter/advanced-filter-text';
import { ClrAdvancedFilterField } from './interfaces/advanced-filter-field.interface';
import { ClrAdvancedFilterGroup } from './models/advanced-filter-group.model';
import { ClrAdvancedFilterNode } from './models/advanced-filter-node.model';
import { ClrAdvancedFilter } from './models/advanced-filter.model';
import { AdvancedFilterPills } from './pills/advanced-filter-pills';
import { AdvancedFilterValidatorBuilder } from './validators/advanced-filter-validator-builder';

/**
 * Builds a nested filter structure: groups combined by AND or OR, and filters. Filters are added and edited in a
 * popover; nothing is edited inline. The component never interprets the structure.
 *
 * Two layouts show the structure (`clrLayout`): a tree, the default, and pills, one per field.
 *
 * ```html
 * <clr-advanced-filters [clrFields]="fields" [(clrFilter)]="filter" [clrMaxDepth]="3"></clr-advanced-filters>
 * <clr-advanced-filters [clrFields]="fields" [(clrFilter)]="filter" [clrLayout]="'pills'"></clr-advanced-filters>
 * ```
 */
@Component({
  selector: 'clr-advanced-filters',
  template: `
    @if (layout === layouts.PILLS) {
      <clr-advanced-filters-pills [root]="root" [fields]="fields" (edit)="onEdit()"></clr-advanced-filters-pills>
    } @else {
      <clr-tree [attr.aria-label]="commonStrings.keys.advancedFiltersAriaLabel">
        <clr-advanced-filters-group
          ngProjectAs="clr-tree-node"
          [group]="root"
          [fields]="fields"
          [level]="1"
          [maxDepth]="maxDepth"
          (edit)="onEdit()"
        ></clr-advanced-filters-group>
      </clr-tree>
    }
  `,
  host: { '[class.clr-advanced-filters]': 'true' },
  providers: [AdvancedFilterText, AdvancedFilterPills],
  standalone: false,
})
export class ClrAdvancedFilters implements OnChanges {
  /**
   * The field definitions to pick from. A built-in field without a `validator` gets the built-in validator of its
   * type. Filters whose field key is no longer among the definitions are removed from the tree.
   */
  @Input('clrFields') clrFields: ClrAdvancedFilterField[] | undefined;

  /**
   * The root of the filter tree, used as it is: the component changes this instance. Anything else than a
   * `ClrAdvancedFilterGroup`, `null` included, starts a new empty AND root.
   */
  @Input('clrFilter') filter: ClrAdvancedFilterGroup | null = null;

  /**
   * How the structure is shown: a tree (the default), or pills. Pills have two levels and a root that is always AND;
   * they show a structure built otherwise as well as they can. Any other value shows the tree.
   */
  @Input('clrLayout') layout: ClrAdvancedFilterLayout | `${ClrAdvancedFilterLayout}` = ClrAdvancedFilterLayout.TREE;

  /**
   * The deepest level of groups the user can create in the tree, the root included. Pills always have two levels.
   */
  @Input({ alias: 'clrMaxDepth', transform: numberAttribute }) maxDepth = 3;

  /**
   * The root, after each change the user makes. The same instance as `clrFilter` when one was given.
   */
  @Output('clrFilterChange') filterChange = new EventEmitter<ClrAdvancedFilterGroup>(false);

  readonly layouts = ClrAdvancedFilterLayout;
  root = new ClrAdvancedFilterGroup();
  fields: ClrAdvancedFilterField[] = [];

  private readonly validatorBuilder = new AdvancedFilterValidatorBuilder();

  constructor(public commonStrings: ClrCommonStringsService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['filter']) {
      this.root = this.filter instanceof ClrAdvancedFilterGroup ? this.filter : new ClrAdvancedFilterGroup();
    }
    if (changes['clrFields']) {
      this.fields = (this.clrFields ?? []).map(field => this.withValidator(field));
    }
    // Only once definitions were given: a filter whose definitions have not arrived yet is not "gone".
    if ((changes['filter'] || changes['clrFields']) && this.clrFields) {
      this.removeFiltersWithoutField(this.root);
    }
  }

  onEdit(): void {
    this.filterChange.emit(this.root);
  }

  /**
   * A copy that carries the built-in validator of its type, so the consumer's definition is never changed.
   */
  private withValidator(field: ClrAdvancedFilterField): ClrAdvancedFilterField {
    const validator = field.validator ? undefined : this.validatorBuilder.build(field.type);
    return validator ? { ...field, validator } : field;
  }

  /**
   * A field definition is gone when no definition has its key any more.
   */
  private removeFiltersWithoutField(node: ClrAdvancedFilterNode): void {
    if (node instanceof ClrAdvancedFilterGroup) {
      node.children.forEach(child => this.removeFiltersWithoutField(child));
    } else if (node instanceof ClrAdvancedFilter && !this.fields.some(field => field.key === node.field.key)) {
      node.remove();
    }
  }
}

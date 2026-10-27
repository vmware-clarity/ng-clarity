/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Injectable } from '@angular/core';

import { ClrAdvancedFilterFieldType } from '../enums/advanced-filter-field-type.enum';
import { AdvancedFilterPillKind } from '../enums/advanced-filter-pill-kind.enum';
import { ClrAdvancedFilterField } from '../interfaces/advanced-filter-field.interface';
import { AdvancedFilterPillEdit } from '../interfaces/advanced-filter-pill-edit.interface';
import { AdvancedFilterPill } from '../interfaces/advanced-filter-pill.interface';
import { ClrAdvancedFilterGroup } from '../models/advanced-filter-group.model';
import { ClrAdvancedFilterNode } from '../models/advanced-filter-node.model';
import { ClrAdvancedFilter } from '../models/advanced-filter.model';

/**
 * Internal. The rules of the pills layout: the pills a tree gives, and how an edit of the pill popover is written to
 * the tree.
 *
 * Fields with AND / OR (DATE, NUMBER, STRING) are always written as a group, even with one condition; the other types
 * as a single filter. An edit changes the existing nodes in place, so they keep their ids.
 */
@Injectable()
export class AdvancedFilterPills {
  private readonly logicTypes: ReadonlySet<string> = new Set([
    ClrAdvancedFilterFieldType.STRING,
    ClrAdvancedFilterFieldType.NUMBER,
    ClrAdvancedFilterFieldType.DATE,
  ]);

  /**
   * One pill per child of the root, in the order of the model. The logic of the root is not shown.
   * @param fields The component's definitions: a pill shows the definition with its field's key.
   */
  build(root: ClrAdvancedFilterGroup, fields: readonly ClrAdvancedFilterField[]): AdvancedFilterPill[] {
    const seen = new Set<string>();
    return root.children.map(node => {
      const filters = this.fieldFilters(node);
      if (!filters) {
        return {
          node,
          kind: AdvancedFilterPillKind.SUMMARY,
          field: null,
          filters: this.allFilters(node),
          duplicate: false,
        };
      }
      const key = filters[0].field.key;
      const duplicate = seen.has(key);
      seen.add(key);
      const field = fields.find(candidate => candidate.key === key) ?? filters[0].field;
      return { node, kind: AdvancedFilterPillKind.FIELD, field, filters, duplicate };
    });
  }

  /**
   * Whether the pill popover offers AND / OR and more than one condition for the field.
   */
  supportsLogic(field: ClrAdvancedFilterField): boolean {
    return this.logicTypes.has(field.type);
  }

  /**
   * Adds the edit to the root: a group for fields with AND / OR, else a filter.
   * @returns The added node.
   */
  add(root: ClrAdvancedFilterGroup, edit: AdvancedFilterPillEdit): ClrAdvancedFilterNode {
    if (!this.supportsLogic(edit.field)) {
      const [row] = edit.rows;
      return root.addChild(new ClrAdvancedFilter(edit.field, row.operator, row.value));
    }
    const group = new ClrAdvancedFilterGroup();
    this.write(group, edit);
    return root.addChild(group);
  }

  /**
   * Writes the edit to the node of a pill. A filter that gets more than one condition moves into a new group at its
   * place, and keeps its id.
   * @returns The node of the pill after the edit.
   */
  update(node: ClrAdvancedFilterNode, edit: AdvancedFilterPillEdit): ClrAdvancedFilterNode {
    if (node instanceof ClrAdvancedFilterGroup) {
      this.write(node, edit);
      return node;
    }
    const filter = node as ClrAdvancedFilter;
    if (edit.rows.length === 1) {
      const [row] = edit.rows;
      filter.set(row.operator, row.value);
      return filter;
    }
    const group = new ClrAdvancedFilterGroup();
    const parent = filter.parent;
    if (parent) {
      parent.addChild(group, parent.children.indexOf(filter));
    }
    if (!edit.rows.some(row => row.filter === filter)) {
      filter.remove();
    }
    this.write(group, edit);
    return group;
  }

  /**
   * The group gets the edit's logic and exactly its rows, in their order: kept filters are edited, the others removed,
   * and new rows added.
   */
  private write(group: ClrAdvancedFilterGroup, edit: AdvancedFilterPillEdit): void {
    group.logic = edit.logic;
    const kept = new Set<ClrAdvancedFilterNode | null>(edit.rows.map(row => row.filter));
    group.children.filter(child => !kept.has(child)).forEach(child => child.remove());
    edit.rows.forEach((row, index) => {
      if (row.filter) {
        row.filter.set(row.operator, row.value);
      }
      group.addChild(row.filter ?? new ClrAdvancedFilter(edit.field, row.operator, row.value), index);
    });
  }

  /**
   * The filters of a FIELD pill: a filter, or a non-empty group of filters on one field. `null` for anything else.
   */
  private fieldFilters(node: ClrAdvancedFilterNode): ClrAdvancedFilter[] | null {
    if (!(node instanceof ClrAdvancedFilterGroup)) {
      return [node as ClrAdvancedFilter];
    }
    const filters = node.children.filter((child): child is ClrAdvancedFilter => child instanceof ClrAdvancedFilter);
    if (!filters.length || filters.length !== node.children.length) {
      return null;
    }
    const key = filters[0].field.key;
    return filters.every(filter => filter.field.key === key) ? filters : null;
  }

  private allFilters(node: ClrAdvancedFilterNode): ClrAdvancedFilter[] {
    if (!(node instanceof ClrAdvancedFilterGroup)) {
      return [node as ClrAdvancedFilter];
    }
    return node.children.flatMap(child => this.allFilters(child));
  }
}

/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { ClrAdvancedFilterField } from './advanced-filter-field.interface';
import { AdvancedFilterPillKind } from '../enums/advanced-filter-pill-kind.enum';
import { ClrAdvancedFilterNode } from '../models/advanced-filter-node.model';
import { ClrAdvancedFilter } from '../models/advanced-filter.model';

/**
 * Internal. One pill of the pills layout: one child of the root.
 */
export interface AdvancedFilterPill {
  /**
   * The child of the root the pill stands for: a filter or a group.
   */
  readonly node: ClrAdvancedFilterNode;
  readonly kind: AdvancedFilterPillKind;
  /**
   * For FIELD pills, the field's definition among the component's fields, else the definition of its first filter.
   * `null` for SUMMARY pills.
   */
  readonly field: ClrAdvancedFilterField | null;
  /**
   * For FIELD pills, the filters in the order of the model; for SUMMARY pills, every filter below the node.
   */
  readonly filters: readonly ClrAdvancedFilter[];
  /**
   * A FIELD pill whose field already has a pill before it. It is marked invalid and can only be removed. The view
   * marks it; the filters stay valid.
   */
  readonly duplicate: boolean;
}

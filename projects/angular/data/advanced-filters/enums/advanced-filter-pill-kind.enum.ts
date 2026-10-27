/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/**
 * Internal. What a pill of the pills layout stands for.
 */
export enum AdvancedFilterPillKind {
  /**
   * A filter, or a group of filters on one field without nested groups: shown with the field, edited in the popover.
   */
  FIELD = 'field',
  /**
   * Anything else the pills layout cannot edit, such as a group with several fields or nested groups: shown as a count
   * of its filters, and can only be removed.
   */
  SUMMARY = 'summary',
}

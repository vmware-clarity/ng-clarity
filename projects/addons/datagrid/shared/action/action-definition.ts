/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/**
 * Expose most common datagrid actionbar layout styles.
 */
export enum ActionBarLayout {
  flatCompact = 'btn btn-sm btn-link',
  flat = 'btn btn-link',
  outlined = 'btn btn-sm btn-secondary',
}

/**
 * Configuration for actions.
 */
export interface ActionDefinition<T = string> {
  id: string;
  label: T;
  ariaLabel?: string;
  enabled: boolean;
  tooltip?: T;
  /**
   * Specify style class to be applied. Default style is flatCompact - 'btn btn-sm btn-link'.
   * {@see ActionBarLayout}
   */
  class?: string;

  /**
   * True if the action button is visible above the grid, otherwise the button
   * is placed within a dropdown.
   */
  isVisible?: boolean;

  /**
   * When an action has children, it is displayed like a dropdown and
   * the children are the dropdown items.
   */
  children?: ActionDefinition[];
}

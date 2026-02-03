/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/**
 * Interface defining the configuration required to enable drag-and-drop functionality within a datagrid.
 * This configuration specifies which field should be displayed while dragging and optionally groups the draggable items.
 */
export interface DatagridDragConfig {
  /**
   * The name of the field whose value will be displayed as a ghost element while dragging.
   * The ghost element is the visual representation of the dragged item that follows the cursor during
   * a drag-and-drop operation.
   */
  fieldName: string;

  /**
   * An optional identifier for grouping draggable elements.
   */
  dragGroup?: string;
}

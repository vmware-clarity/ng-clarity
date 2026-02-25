/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/**
 * Controls how many panels can be open simultaneously within an accordion.
 */
export enum AccordionStrategy {
  /** Only one panel can be open at a time. Opening a panel closes any previously open panel. */
  Default = 'default',
  /** Multiple panels can be open simultaneously. */
  Multi = 'multi',
}

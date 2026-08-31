/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/**
 * HTML supported heading levels. If you provide any other number the headings will be rendered using
 * role="heading" and aria-level="{{ level }}".
 */
export type TopHeadingLevel = 1 | 2 | 3 | 4 | 5;

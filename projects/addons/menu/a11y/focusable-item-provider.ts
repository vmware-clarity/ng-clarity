/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/**
 * Used as token for querying a list of heterogeneous implementations.
 */
export abstract class FocusableItemProvider {
  abstract getFocusableItem(): any;
}

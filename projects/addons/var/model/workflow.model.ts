/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/**
 * Type used for Wizard/Dialog/Stepper model.
 * This is defined to avoid developers from assigning primitive types.
 *
 * Note: This doesn't restrict from assigning function/array, since function/array is also treated as object.
 * We have a runtime check to validate that it is not a function/array.
 */
export type WorkflowModel = object;

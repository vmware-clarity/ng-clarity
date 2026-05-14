/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

/**
 * Result of a nested property resolution.
 */
export interface PropertyResolutionResult<T = any> {
  value: T | undefined;
  isValid: boolean;
}

/**
 * Safely resolves a nested property path (e.g., "a.b.c") on an object.
 *
 * @param item The object to resolve the property on.
 * @param propertyPath The dot-separated property path.
 * @returns An object containing the resolved value and a boolean indicating if the path was valid.
 */
export function getNestedProperty<T = any>(item: any, propertyPath: string): PropertyResolutionResult<T> {
  if (!item || !propertyPath) {
    return { value: undefined, isValid: false };
  }

  let isValid = true;
  const value = propertyPath.split('.').reduce((o: any, i: string) => {
    if (o !== null && o !== undefined && typeof o === 'object' && i in o) {
      return o[i];
    }
    isValid = false;
    return undefined;
  }, item);

  return { value, isValid };
}

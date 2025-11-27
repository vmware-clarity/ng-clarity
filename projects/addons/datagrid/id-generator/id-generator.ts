/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { FactoryProvider, InjectionToken } from '@angular/core';

// Variable to keep track of unique ID instances
// Using BigInt to avoid overflow.
let instancesCount = BigInt(0);

export const uniqueIdToken: InjectionToken<string> = new InjectionToken('UID generator');
export const uniqueIdProvider: FactoryProvider = {
  provide: uniqueIdToken,
  useFactory: uniqueIdFactory,
};

function uniqueIdFactory(): string {
  return `${instancesCount++}`;
}

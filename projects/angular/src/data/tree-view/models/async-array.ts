/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

// We need to make sure people can give us null or undefined children even if they run strict type checking.
import { Observable } from 'rxjs';

export type AsyncArray<T> =
  | T[]
  | null
  | undefined
  | Promise<T[] | null | undefined>
  | Observable<T[] | null | undefined>;

export function isPromise<T>(o: AsyncArray<T>): o is Promise<T[]> {
  // Shamelessly copied from every open-source project out there.
  return o && typeof (o as any).then === 'function';
}

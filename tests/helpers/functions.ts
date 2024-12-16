/*
 * Copyright (c) 2016-2024 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import * as path from 'path';

export function localePathBuilder(pathStr: string) {
  const parts = pathStr.split('/');

  return path.join(...parts);
}

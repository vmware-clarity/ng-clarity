/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'cssVariable',
})
export class CssVariablePipe implements PipeTransform {
  transform(cssVariableName: string) {
    return `var(${cssVariableName})`;
  }
}

/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'appVizGeneralColorNumber',
  standalone: false,
})
export class VizGeneralColorNumberPipe implements PipeTransform {
  transform(value: string) {
    const numberMatch = value.match(/[0-9]+/);

    return numberMatch ? +numberMatch[0] : undefined;
  }
}

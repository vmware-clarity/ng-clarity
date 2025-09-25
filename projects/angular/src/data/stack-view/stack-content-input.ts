/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Directive } from '@angular/core';

import { uniqueIdFactory } from '../../utils/id-generator/id-generator.service';

@Directive({
  selector: '[clrStackInput]',
  host: {
    '[class.clr-input]': 'true',
    '[attr.aria-labelledby]': 'uniqueId',
  },
  standalone: false,
})
export class ClrStackContentInput {
  uniqueId = uniqueIdFactory();
}

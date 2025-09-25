/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Directive } from '@angular/core';

@Directive({
  selector: 'clr-icon',
  standalone: false,
})
export class ClrIconCustomTag {
  // No behavior
  // The only purpose is to "declare" the tag in Angular
}

@Directive({
  selector: 'cds-icon',
  standalone: false,
})
export class CdsIconCustomTag {
  // No behavior
  // The only purpose is to "declare" the tag in Angular
}

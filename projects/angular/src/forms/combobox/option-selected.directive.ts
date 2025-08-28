/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Directive, Input, TemplateRef } from '@angular/core';

@Directive({
  selector: '[clrOptionSelected]',
  standalone: false,
})
export class ClrOptionSelected<T> {
  @Input('clrOptionSelected') selected: T;

  constructor(public template: TemplateRef<{ $implicit: T }>) {}
}

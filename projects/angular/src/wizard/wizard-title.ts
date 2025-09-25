/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Directive, Input } from '@angular/core';

import { HeadingLevel } from './heading-level';

@Directive({
  selector: 'clr-wizard-title',
  standalone: false,
})
export class ClrWizardTitle {
  @Input('clrHeadingLevel') headingLevel: HeadingLevel;
}

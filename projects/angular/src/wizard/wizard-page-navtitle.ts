/*
 * Copyright (c) 2016-2025 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Directive, TemplateRef } from '@angular/core';

@Directive({
  selector: '[clrPageNavTitle]',
  standalone: false,
})
export class ClrWizardPageNavTitle {
  constructor(public pageNavTitleTemplateRef: TemplateRef<any>) {}
}

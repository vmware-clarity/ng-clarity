/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Directive, Input, TemplateRef } from '@angular/core';

import { HeadingLevel } from './heading-level';

@Directive({
  selector: '[clrPageTitle]',
})
export class ClrWizardPageTitle {
  @Input('clrHeadingLevel') headingLevel: HeadingLevel;

  constructor(public pageTitleTemplateRef: TemplateRef<any>) {}
}

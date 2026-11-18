/*
 * Copyright (c) 2016-2026 Broadcom. All Rights Reserved.
 * The term "Broadcom" refers to Broadcom Inc. and/or its subsidiaries.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { Directive, Input, signal, TemplateRef } from '@angular/core';
import { HeadingLevel } from '@clr/angular/utils';

@Directive({
  selector: '[clrPageTitle]',
  standalone: false,
})
export class ClrWizardPageTitle {
  // The wizard renders the level, so it is a signal.
  private readonly level = signal<HeadingLevel>(undefined);

  constructor(public pageTitleTemplateRef: TemplateRef<any>) {}

  @Input('clrHeadingLevel')
  get headingLevel(): HeadingLevel {
    return this.level();
  }
  set headingLevel(value: HeadingLevel) {
    this.level.set(value);
  }
}

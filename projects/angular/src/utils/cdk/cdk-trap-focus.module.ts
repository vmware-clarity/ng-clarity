/*
 * Copyright (c) 2016-2023 VMware, Inc. All Rights Reserved.
 * This software is released under MIT license.
 * The full license information can be found in LICENSE in the root directory of this project.
 */

import { CdkTrapFocus, FocusTrapFactory } from '@angular/cdk/a11y';
import { DOCUMENT } from '@angular/common';
import { Directive, ElementRef, Inject, NgModule, Optional } from '@angular/core';

/**
 * This is just a copy of CdkTrapFocus so it can be used independent of the rest of the A11yModule.
 */
@Directive({
  selector: '[cdkTrapFocus]',
})
export class CdkTrapFocusModule_CdkTrapFocus extends CdkTrapFocus {
  constructor(elementRef: ElementRef, focusTrapFactory: FocusTrapFactory, @Optional() @Inject(DOCUMENT) document: any) {
    super(elementRef, focusTrapFactory, document);
  }
}

/**
 * This module allows us to avoid importing all of A11yModule which results in a smaller application bundle.
 */
@NgModule({
  declarations: [CdkTrapFocusModule_CdkTrapFocus],
  exports: [CdkTrapFocusModule_CdkTrapFocus],
})
export class CdkTrapFocusModule {}
